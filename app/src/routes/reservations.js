/* eslint-disable consistent-return */
const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadReservation(ctx, next) {
  ctx.state.reservation = await ctx.orm.reservation.findByPk(ctx.params.id);
  return next();
}

async function loadUser(ctx, next) {
  ctx.state.user = await ctx.orm.user.findByPk(ctx.params.id);
  return next();
}

async function loadRestaurant(ctx, next) {
  ctx.state.restaurant = await ctx.orm.restaurant.findByPk(ctx.params.id);
  return next();
}

async function getFavouriteRestaurants(ctx, user) {
  if (!user) return [];
  const favResList = await ctx.orm.favouriteRestaurants.findAll({ where: { userId: user.id } });
  const ids = await favResList.map((res) => res.restaurantId);

  return ids;
}

async function getDishes(ctx, restaurant) {
  const dishes = await ctx.orm.dish.findAll({
    where: { restaurantId: restaurant.id },
  });
  return dishes;
}

async function getFavouriteDishes(ctx, user) {
  if (!user) return [];
  const favDishesList = await ctx.orm.favouriteDishes.findAll({ where: { userId: user.id } });
  const ids = await favDishesList.map((dish) => dish.dishId);

  return ids;
}

async function getObjectsRestaurants(ctx, list) {
  const final = [];
  await list.map(async (rid) => {
    const d = await ctx.orm.restaurant.findOne({ where: { id: rid } });
    final.push(d);
  });
  return final;
}

async function getObjectsDishes(ctx, list) {
  const final = [];
  await list.map(async (rid) => {
    const d = await ctx.orm.dish.findOne({ where: { id: rid } });
    final.push(d);
  });
  return final;
}

async function getVotes(ctx, user, restaurant) {
  if (!user) return [];
  // eslint-disable-next-line max-len
  const votesList = await ctx.orm.userVote.findAll({ where: { userId: user.id, restaurantId: restaurant.id } });
  const ids = await votesList.map((res) => res.id);
  return ids;
}

async function getObjectsCategories(ctx, list) {
  const final = [];
  for (let cat = 0; cat < list.length; cat += 1) {
    // eslint-disable-next-line no-await-in-loop
    const d = await ctx.orm.category.findOne({ where: { id: list[cat] } });
    final.push(d);
  }
  return final;
}

async function getCategories(ctx, restaurant) {
  // eslint-disable-next-line max-len
  const categoriesList = await ctx.orm.restaurantCategory.findAll({ where: { restaurantId: restaurant.id } });
  const ids = await categoriesList.map((res) => res.categoryId);
  const categories = await getObjectsCategories(ctx, ids);

  return categories;
}

// router.get('reservations.list', '/', async (ctx) => {
//   const reservationsList = await ctx.orm.reservation.findAll();
//   await ctx.render('reservations/index', {
//     reservationsList,
//     newReservationPath: ctx.router.url('reservations.new'),
//     showReservationPath: (reserv) => ctx.router.url('reservations.show', { id: reserv.id }),
//   });
// });

router.get('reservations.new', '/new', async (ctx) => {
  if (!ctx.state.currentUser) return ctx.redirect(ctx.state.newSessionPath);
  const reservation = ctx.orm.reservation.build();
  await ctx.render('reservations/new', {
    reservation,
    submitReservationPath: ctx.router.url('reservations.create'),
  });
});

router.get('reservations.myReservations', '/myReservations', async (ctx) => {
  const { currentUser } = ctx.state;
  let reservations;

  if (!currentUser) return ctx.redirect(ctx.router.url('restaurants.list'));
  // eslint-disable-next-line prefer-const
  reservations = await ctx.orm.reservation.findAll({
    where: {
      userId: currentUser.id,
      acceptance: [0, 1],
    },
  });


  await ctx.render('reservations/myReservations', {
    currentUser,
    reservations,
    showReservationPath: (reserv) => ctx.router.url('reservations.show', { id: reserv.id }),
  });
});

router.get('reservations.edit', '/:id/edit', loadReservation, async (ctx) => {
  const { reservation } = ctx.state;

  const dishes = await ctx.orm.dish.findAll({
    where: {
      restaurantId: reservation.restaurantId,
    },
  });

  await ctx.render('reservations/edit', {
    reservation,
    dishes,
    submitReservationPath: ctx.router.url('reservations.update', { id: reservation.id }),
    cancelPath: ctx.router.url('reservations.myReservations'),
  });
});

router.get('reservations.show', '/:id', loadReservation, async (ctx) => {
  const { reservation } = ctx.state;
  const tables = await ctx.orm.reservationtables.findAll({
    where: {
      reservationId: reservation.id,
    },
  })
    .then(async (tabs) => {
      const tbs = [];
      tabs.forEach(async (table) => {
        const t = await ctx.orm.table.findOne({
          where: {
            id: table.tableId,
          },
        });
        tbs.push(t);
      });

      return tbs;
    });

  const dishes = await ctx.orm.reservationdishes.findAll({
    where: {
      reservationId: reservation.id,
    },
  })
    .then((dshs) => {
      const ds = [];
      dshs.forEach(async (dish) => {
        const d = await ctx.orm.dish.findOne({
          where: {
            id: dish.dishId,
          },
        });
        d.amount = dish.amount;
        ds.push(d);
      });
      return ds;
    });

  const user = await ctx.orm.user.findOne({
    where: {
      id: reservation.userId,
    },
  });

  const restaurant = await ctx.orm.restaurant.findOne({
    where: {
      id: reservation.restaurantId,
    },
  });

  await ctx.render('reservations/show', {
    reservation,
    tables,
    dishes,
    user,
    restaurant,
    showUserPath: ctx.router.url('reservations.showuser', { id: user.id }),
    showRestaurantPath: ctx.router.url('restaurants.show', { id: restaurant.id }),
    editReservationPath: ctx.router.url('reservations.edit', { id: reservation.id }),
    deleteReservationPath: ctx.router.url('reservations.delete', { id: reservation.id }),
  });
});

router.get('reservations.showuser', '/user/:id', loadUser, async (ctx) => {
  const { user, currentUser } = ctx.state;

  const favDishesListId = await getFavouriteDishes(ctx, currentUser);
  const favRestaurantListId = await getFavouriteRestaurants(ctx, currentUser);

  const favDishesList = await getObjectsDishes(ctx, favDishesListId);
  const favRestaurantList = await getObjectsRestaurants(ctx, favRestaurantListId);

  await ctx.render('users/show', {
    user,
    favDishesList,
    favRestaurantList,
    submitReviewPath: ctx.router.url('reservations.list'),
    backtoindexPath: ctx.router.url('users.list'),
    updateImagePath: ctx.router.url('images.list'),
    editUserPath: ctx.router.url('users.edit', { nickname: user.nickname }),
    deleteUserPath: ctx.router.url('users.delete', { nickname: user.nickname }),
    myReservationsPath: ctx.router.url('reservations.myReservations'),
  });
});

router.get('reservations.showrestaurant', '/restaurant/:id', loadRestaurant, async (ctx) => {
  const { restaurant, currentUser } = ctx.state;

  const favouriteList = await getFavouriteRestaurants(ctx, currentUser);
  const votes = await getVotes(ctx, currentUser, restaurant);
  const categoriesList = await getCategories(ctx, restaurant);
  const dishesList = await getDishes(ctx, restaurant);
  const reviewsCount = await ctx.orm.review.findAll();
  const count = reviewsCount.slice(-1)[0].dataValues.id;

  await ctx.render('restaurants/show', {
    restaurant,
    favouriteList,
    votes,
    count,
    categoriesList,
    viewDishesPath: ctx.router.url('restaurantDishes.viewDishes', { id: restaurant.id, list: dishesList }),
    newReservationPath: ctx.router.url('restaurants.newReservation', { id: restaurant.id }),
    editRestaurantPath: ctx.router.url('restaurants.edit', { id: restaurant.id }),
    deleteRestaurantPath: ctx.router.url('restaurants.delete', { id: restaurant.id }),
    submitScorePath: ctx.router.url('restaurants.addscore', { id: restaurant.id }),
    editScorePath: (item) => ctx.router.url('restaurants.editscore', { id: restaurant.id, item }),
    addFavouriteRestaurantPath: (user) => (ctx.router.url('favrestaurants.new', { userId: user.id, restaurantId: restaurant.id })),
  });
});

router.post('reservations.create', '/', async (ctx) => {
  const reservation = ctx.orm.reservation.build(ctx.request.body);
  const { dishes } = ctx.request.body;
  let { tables } = ctx.request.body;

  try {
    // eslint-disable-next-line eqeqeq
    // if (!currentUser || currentUser.id != reservation.userId) {
    //   // eslint-disable-next-line no-throw-literal
    //   throw 'validationError';
    // }

    const pc = parseInt(reservation.peopleCount, 10);

    // eslint-disable-next-line no-throw-literal
    if (pc < 1 || !Number.isInteger(pc)) throw 'validationError';

    await reservation.save({ fields: ['userId', 'restaurantId', 'day', 'hour', 'peopleCount', 'comments'] });
    ctx.redirect(ctx.router.url('restaurants.list'));
  } catch (validationError) {
    const restaurantList = await ctx.orm.restaurant.findAll();
    restaurantList.sort((a, b) => ((a.score < b.score) ? 1 : -1));

    await ctx.render('restaurants/index', {
      restaurantList,
      errors: validationError.errors,
      showMapPath: ctx.router.url('maps.show'),
      newRestaurantPath: ctx.router.url('restaurants.new'),
      showRestaurantPath: (rest) => ctx.router.url('restaurants.show', { id: rest.id }),
    });
  }
  try {
    let auxId; let auxAmount;

    Object.keys(dishes).forEach(async (dish) => {
      auxId = parseInt(dish, 10); auxAmount = parseInt(dishes[dish], 10);

      if (auxAmount === 0) return;

      const relation = ctx.orm.reservationdishes.build();

      relation.dishId = auxId;
      relation.reservationId = reservation.id;
      relation.amount = auxAmount;

      await relation.save({ fields: ['reservationId', 'dishId', 'amount'] });
    });
  } catch (validationError) {
    const restaurantList = await ctx.orm.restaurant.findAll();
    restaurantList.sort((a, b) => ((a.score < b.score) ? 1 : -1));

    await ctx.render('restaurants/index', {
      restaurantList,
      errors: validationError.errors,
      showMapPath: ctx.router.url('maps.show'),
      newRestaurantPath: ctx.router.url('restaurants.new'),
      showRestaurantPath: (rest) => ctx.router.url('restaurants.show', { id: rest.id }),
    });
  }
  try {
    if (typeof tables === 'string') {
      tables = [tables];
    }

    tables.forEach(async (table) => {
      const relation = ctx.orm.reservationtables.build();
      relation.tableId = parseInt(table, 10);
      relation.reservationId = reservation.id;
      await relation.save({ fields: ['tableId', 'reservationId'] });
    });
    ctx.redirect(ctx.router.url('restaurants.list'));
  } catch (validationError) {
    const restaurantList = await ctx.orm.restaurant.findAll();
    restaurantList.sort((a, b) => ((a.score < b.score) ? 1 : -1));

    await ctx.render('restaurants/index', {
      restaurantList,
      errors: validationError.errors,
      showMapPath: ctx.router.url('maps.show'),
      newRestaurantPath: ctx.router.url('restaurants.new'),
      showRestaurantPath: (rest) => ctx.router.url('restaurants.show', { id: rest.id }),
    });
  }
});

router.patch('reservations.update', '/:id', loadReservation, async (ctx) => {
  const { reservation } = ctx.state;
  try {
    // eslint-disable-next-line object-curly-newline
    const { hour, peopleCount, comments } = ctx.request.body;
    let { day } = ctx.request.body;
    const pc = parseInt(peopleCount, 10);

    // eslint-disable-next-line no-throw-literal
    if (pc < 1 || !Number.isInteger(pc)) throw 'validationError';
    if (!day) day = reservation.day;

    // eslint-disable-next-line object-curly-newline
    await reservation.update({ day, hour, pc, comments });
    ctx.redirect(ctx.router.url('reservations.myReservations'));
  } catch (validationError) {
    await ctx.render('reservations/edit', {
      reservation,
      errors: validationError.errors,
      submitReservationPath: ctx.router.url('reservations.update'),
    });
  }

  ctx.redirect(ctx.router.url('reservations.myReservations'));
});

router.del('reservations.delete', '/:id', loadReservation, async (ctx) => {
  const { reservation, currentUser } = ctx.state;

  if (currentUser) {
    await reservation.destroy();
  }
  ctx.redirect(ctx.router.url('reservations.myReservations'));
});

module.exports = router;
