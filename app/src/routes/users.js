/* eslint-disable consistent-return */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-useless-escape */
const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadUser(ctx, next) {
  ctx.state.user = await ctx.orm.user.findOne({ where: { nickname: ctx.params.nickname } });
  if (!ctx.state.user) return ctx.redirect(ctx.router.url('restaurants.list'));
  return next();
}


function validateFields(body) {
  if (!(/^[A-Za-z]+(( )?[A-Za-z])*$/.test(body.name))) {
    return false;
  }
  if (!(/^[A-Za-z0-9]+(\w+)*$/.test(body.nickname))) {
    return false;
  }
  if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(body.email))) {
    return false;
  }
  if (body.password.length < 6) {
    return false;
  }
  // edad minima 15 anios
  const birthday = new Date(body.birthday);
  // eslint-disable-next-line eqeqeq
  if (birthday >= (new Date() - (15 * 365 * 24 * 60 * 60 * 1000)) || birthday == 'NaN' || birthday == 'Invalid Date') {
    return false;
  }
  return true;
}

async function getFavouriteRestaurants(ctx, user) {
  if (!user) return [];
  const favResList = await ctx.orm.favouriteRestaurants.findAll({ where: { userId: user.id } });
  const ids = await favResList.map((res) => res.restaurantId);

  return ids;
}

async function getFavouriteDishes(ctx, user) {
  if (!user) return [];
  const favDishesList = await ctx.orm.favouriteDishes.findAll({ where: { userId: user.id } });
  const ids = await favDishesList.map((dish) => dish.dishId);

  return ids;
}

async function getObjectsRestaurants(ctx, list) {
  const final = [];
  for (let i = 0; i < list.length; i += 1) {
    const rest = await ctx.orm.restaurant.findOne({ where: { id: list[i] } });
    final.push(rest);
  }

  return final;
}

async function getObjectsDishes(ctx, list) {
  const final = [];
  for (let i = 0; i < list.length; i += 1) {
    const dish = await ctx.orm.dish.findOne({ where: { id: list[i] } });
    final.push(dish);
  }

  return final;
}

async function checkRefer(ctx, next) {
  if (ctx.session.routeBack) {
    const rtBk = ctx.session.routeBack;
    ctx.session.routeBack = rtBk;
  }
  return next();
}

router.get('users.list', '/', async (ctx) => {
  const { currentUser } = await ctx.state;
  if (!(currentUser && currentUser.admin)) return ctx.redirect(ctx.router.url('restaurants.list'));
  const usersList = await ctx.orm.user.findAll();
  await ctx.render('users/index', {
    usersList,
    newUserPath: ctx.router.url('users.new'),
    showUserPath: (user) => ctx.router.url('users.show', { nickname: user.nickname }),
  });
});

router.get('users.new', '/new', checkRefer, async (ctx) => {
  const user = ctx.orm.user.build();
  await ctx.render('users/new', {
    user,
    submitUserPath: ctx.router.url('users.create'),
  });
});

router.get('users.edit', '/:nickname/edit', loadUser, async (ctx) => {
  const { user, currentUser } = ctx.state;
  if (!(currentUser && (currentUser.id === user.id))) return ctx.redirect(ctx.router.url('restaurants.list'));
  await ctx.render('users/edit', {
    user,
    submitUserPath: ctx.router.url('users.update', { nickname: user.nickname }),
  });
});

router.get('users.show', '/:nickname', loadUser, async (ctx) => {
  const { user, currentUser } = await ctx.state;
  if (!(currentUser && (currentUser.admin || (currentUser.id === user.id)))) return ctx.redirect(ctx.router.url('restaurants.list'));
  const favDishesListId = await getFavouriteDishes(ctx, currentUser);
  const favRestaurantListId = await getFavouriteRestaurants(ctx, currentUser);

  const favDishesList = await getObjectsDishes(ctx, favDishesListId);
  const favRestaurantList = await getObjectsRestaurants(ctx, favRestaurantListId);

  await ctx.render('users/show', {
    user,
    currentUser,
    favDishesList,
    favRestaurantList,
    editUserPath: ctx.router.url('users.edit', { nickname: user.nickname }),
    deleteUserPath: ctx.router.url('users.delete', { nickname: user.nickname }),
    myReservationsPath: ctx.router.url('reservations.myReservations'),
    backtoindexPath: ctx.router.url('users.list'),
    updateImagePath: ctx.router.url('images.list'),
    showDishPath: (dish) => ctx.router.url('dishes.show', { id: dish.id }),
    showRestaurantPath: (restaurant) => ctx.router.url('restaurants.show', { id: restaurant.id }),
  });
});

// eslint-disable-next-line consistent-return
router.post('users.create', '/', checkRefer, async (ctx) => {
  const user = ctx.orm.user.build(ctx.request.body);
  try {
    if (!validateFields(ctx.request.body)) {
      // eslint-disable-next-line no-throw-literal
      throw 'invalid fields';
    }

    await user.save({ fields: ['name', 'email', 'password', 'birthday', 'nickname'] });
    const reg = await ctx.orm.registration.build({ userId: user.id });
    await reg.save();
    ctx.session.registrationId = reg.id;
    if (ctx.session.routeBack) {
      const redirectTo = `${ctx.session.routeBack[0]}.show`;
      return ctx.redirect(ctx.router.url(redirectTo, { id: ctx.session.routeBack[1] }));
    }
    return ctx.redirect(ctx.router.url('restaurants.list'));
  } catch (validationError) {
    await ctx.render('users/new', {
      user,
      errors: validationError.errors,
      submitUserPath: ctx.router.url('users.create'),
    });
  }
});

router.patch('users.update', '/:nickname', loadUser, async (ctx) => {
  const { user, currentUser } = ctx.state;
  if (!(currentUser && (currentUser.id === user.id))) return ctx.redirect(ctx.router.url('restaurants.list'));
  try {
    if (!validateFields(ctx.request.body)) {
      // eslint-disable-next-line no-throw-literal
      throw 'invalid fields';
    }
    // eslint-disable-next-line object-curly-newline
    const { name, email, password, birthday, nickname } = ctx.request.body;
    // eslint-disable-next-line object-curly-newline
    await user.update({ name, email, password, birthday, nickname });

    ctx.redirect(ctx.router.url('users.show', { nickname: user.nickname }));
  } catch (validationError) {
    await ctx.render('users/edit', {
      user,
      errors: validationError.errors,
      submitUserPath: ctx.router.url('users.update', { nickname: user.nickname }),
    });
  }
});

router.del('users.delete', '/:nickname', loadUser, async (ctx) => {
  const { user, currentUser } = ctx.state;
  if (!(currentUser && (currentUser.admin || (currentUser.id === user.id)))) return ctx.redirect(ctx.router.url('restaurants.list'));
  await user.destroy();
  if (currentUser.admin) return ctx.redirect(ctx.router.url('users.list'));
  ctx.redirect(ctx.router.url('session.destroy'));
});

router.get('images.image', '/image', async (ctx) => {
  await ctx.render('images/image', {
    submitImagePath: ctx.router.url('images.upload'),
  });
});


module.exports = router;
