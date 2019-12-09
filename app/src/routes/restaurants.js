/* eslint-disable camelcase */
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
/* eslint-disable max-len */
const KoaRouter = require('koa-router');
const fetch = require('node-fetch');
const Sequelize = require('sequelize');
const SimpleCrypto = require("simple-crypto-js").default;

const _secretKey = "encriptado";



const Op = Sequelize.Op;

const router = new KoaRouter();

async function loadRestaurant(ctx, next) {
  ctx.state.restaurant = await ctx.orm.restaurant.findByPk(ctx.params.id);
  return next();
}

function validateFields(body) {
  if (!(/^[a-zA-ZÀ-ÖØ-öø-ÿ0-9]+((( - )|-|(, )|( ))?[a-zA-ZÀ-ÖØ-öø-ÿ0-9])*\.?$/.test(body.name))) {
    return false;
  }
  if (!(/^[A-Za-z0-9]+(\w+)*$/.test(body.nickname))) {
    return false;
  }
  if (body.password.length < 6) {
    return false;
  }
  if (!(/^[a-zA-ZÀ-ÖØ-öø-ÿ0-9]+(((. )|( )|-)?[a-zA-ZÀ-ÖØ-öø-ÿ0-9])*$/.test(body.address))) {
    return false;
  }
  if (!(/^[a-zA-ZÀ-ÖØ-öø-ÿ0-9]+(((. )|( )|-)?[a-zA-ZÀ-ÖØ-öø-ÿ0-9])*$/.test(body.commune))) {
    return false;
  }
  if (!(/^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$$/.test(body.open_at))) {
    return false;
  // eslint-disable-next-line no-else-return
  } else if (!(/^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$$/.test(body.close_at))) {
    return false;
  }
  return true;
}

// eslint-disable-next-line no-unused-vars
function validateVote(score) {
  if (/^[0-5](.[0-9][0-9]?)?$/.test(score)) {
    // eslint-disable-next-line no-console
    console.log('\nvoto');
    return true;
  }
  return false;
}
async function loadRestsByName(ctx, text) {
  const rests = await ctx.orm.restaurant.findAll({
    where: {
      name: {
        [Op.like]: `%${text}%`,
      },
    },
  });

  return rests;
}

async function getFavouriteRestaurants(ctx, user) {
  if (!user) return [];
  const favResList = await ctx.orm.favouriteRestaurants.findAll({ where: { userId: user.id } });
  const ids = await favResList.map((res) => res.restaurantId);

  return ids;
}

async function getVotes(ctx, user, restaurant) {
  if (!user) return [];
  const votesList = await ctx.orm.userVote.findAll({ where: { userId: user.id, restaurantId: restaurant.id } });
  const ids = await votesList.map((res) => res.id);

  return ids;
}

async function getReviews(ctx, restaurant) {
  if (!restaurant) return [];
  const reviewsList = await ctx.orm.review.findAll({ where: { restaurantId: restaurant.id } });

  return reviewsList;
}

async function getObjectsCategories(ctx, list) {
  const final = [];
  await list.map(async (cid) => {
    const d = await ctx.orm.category.findByPk(cid);
    final.push(d);
  });

  return final;
}


async function loadOrder(ctx, next) {
  ctx.state.order = await ctx.orm.reservation.findByPk(ctx.request.body.order);
  return next();
}

async function getCategories(ctx, restaurant) {
  const categoriesList = ctx.orm.restaurantCategory.findAll({ where: { restaurantId: restaurant.id } });
  const ids = categoriesList.map((res) => res.categoryId);
  const categories = getObjectsCategories(ctx, ids);

  return categories;
}

async function getDishes(ctx, restaurant) {
  const dishes = await ctx.orm.dish.findAll({
    where: { restaurantId: restaurant.id },
  });
  return dishes;
}

async function setLatLng(restaurant) {
  const address = `${restaurant.address}, ${restaurant.commune}, Chile`;
  const addressInFormat = address.replace(/ /g, '+').replace(/ñ/g, 'n');
  const linkInFormat = `https://maps.googleapis.com/maps/api/geocode/json?address=${addressInFormat}&key=${env.secretKey}`;

  await fetch(linkInFormat)
    .then((response) => response.json())
    .then((res) => {
      const geoJSON = res.results[0].geometry.location;
      restaurant.lat = geoJSON.lat;
      restaurant.lng = geoJSON.lng;
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
    });
}

async function getDataToShowOrders(ctx, order) {
  let user = await ctx.orm.user.findByPk(order.userId);
  user = user.name;
  const tables = await ctx.orm.reservationtables.findAll({
    where: {
      reservationId: order.id,
    },
  })
    .then(async (tbls) => {
      const tbs = [];
      tbls.forEach((tbl) => {
        tbs.push(tbl.tableId);
      });
      return tbs;
    });
  const dishes = await ctx.orm.reservationdishes.findAll({
    where: {
      reservationId: order.id,
    },
  })
    .then((dshs) => {
      const ds = [];
      dshs.forEach(async (dish) => {
        const d = await ctx.orm.dish.findByPk(dish.id);
        if (d) {
          ds.push(d.name);
        } else {
          ds.push(d);
        }
      });
      return ds;
    });
  return [user, tables, dishes];
}

router.get('restaurants.list', '/', async (ctx) => {
  const restaurantList = await ctx.orm.restaurant.findAll();
  restaurantList.sort((a, b) => ((a.score < b.score) ? 1 : -1));

  await ctx.render('restaurants/index', {
    restaurantList,
    showMapPath: ctx.router.url('maps.show'),
    newRestaurantPath: ctx.router.url('restaurants.new'),
    showRestaurantPath: (rest) => ctx.router.url('restaurants.show', { id: rest.id }),
  });
});

router.get('restaurants.search', '/search', async (ctx) => {
  const { term } = ctx.request.query;
  const restaurantList = await loadRestsByName(ctx, term);
  restaurantList.sort((a, b) => ((a.score < b.score) ? 1 : -1));

  await ctx.render('restaurants/index', {
    restaurantList,
    showMapPath: ctx.router.url('maps.show'),
    newRestaurantPath: ctx.router.url('restaurants.new'),
    showRestaurantPath: (rest) => ctx.router.url('restaurants.show', { id: rest.id }),
  });
});

router.get('restaurants.new', '/new', async (ctx) => {
  const restaurant = ctx.orm.restaurant.build();
  await ctx.render('restaurants/new', {
    restaurant,
    submitRestaurantPath: ctx.router.url('restaurants.create'),
  });
});

router.get('restaurants.edit', '/:id/edit', loadRestaurant, async (ctx) => {
  const { restaurant, currentRestaurant } = ctx.state;
  if (!(currentRestaurant && (currentRestaurant.id === restaurant.id))) {
    ctx.redirect(ctx.router.url('restaurants.show', { id: restaurant.id }));
  }
  await ctx.render('restaurants/edit', {
    restaurant,
    submitRestaurantPath: ctx.router.url('restaurants.update', { id: restaurant.id }),
  });
});

/** When restaurant is logged */
// show list of orders, accepted or not
router.get('restaurants.orders', '/myOrders', async (ctx) => {
  const { currentRestaurant } = ctx.state;
  if (currentRestaurant) {
    try {
      const waiting = [];
      const accepted = [];
      const canceled = [];
      const acceptedOrderList = await ctx.orm.reservation.findAll({
        where: {
          restaurantId: currentRestaurant.id,
        },
      });
      const users = {};
      const tables = {};
      const dishes = {};

      for (let i = 0; i < acceptedOrderList.length; i += 1) {
        const element = acceptedOrderList[i];
        switch (element.acceptance) {
          case 0:
            waiting.push(element);
            break;
          case 1:
            accepted.push(element);
            break;
          default:
            canceled.push(element);
            break;
        }
        // eslint-disable-next-line no-await-in-loop
        const toShow = await getDataToShowOrders(ctx, element);
        users[element.id] = toShow[0];
        tables[element.id] = toShow[1];
        dishes[element.id] = toShow[2];
      }
      await ctx.render('restaurants/myOrders', {
        waiting,
        accepted,
        canceled,
        users,
        tables,
        dishes,
        currentRestaurant,
        acceptPath: (ord) => ctx.router.url('restaurants.acceptOrders', { order: ord }),
        cancelPath: (ord) => ctx.router.url('restaurants.cancelOrders', { order: ord }),
      });
    } catch (ordersError) {
      await ctx.render('restaurants/myOrders', {
        waiting: [],
        accepted: [],
        canceled: [],
        users: [],
        tables: [],
        dishes: [],
        currentRestaurant,
        acceptPath: (ord) => ctx.router.url('restaurants.acceptOrders', { order: ord }),
        cancelPath: (ord) => ctx.router.url('restaurants.cancelOrders', { order: ord }),
      });
    }
  } else {
    ctx.redirect(ctx.router.url('session.newRest'));
  }
});

router.post('restaurants.acceptOrders', '/myOrders', loadOrder, async (ctx) => {
  const restaurant = ctx.state.currentRestaurant;
  if (restaurant) {
    try {
      const toAccept = ctx.request.body.accept;
      const order = ctx.state.order;

      if (order.acceptance === 0 && toAccept === 'true') {
        const acceptance = 1;
        await order.update({ acceptance });
      } else if (order.acceptance === 0 && toAccept === 'false') {
        const acceptance = 2;
        await order.update({ acceptance });
      } else if (order.acceptance === 1 && toAccept === 'false') {
        const acceptance = 2;
        await order.update({ acceptance });
      }
      ctx.redirect(ctx.router.url('restaurants.orders'));
    } catch (findingError) {
      ctx.redirect(ctx.router.url('restaurants.orders'));
    }
  } else {
    ctx.redirect(ctx.router.url('session.newRest'));
  }
});

router.get('restaurants.show', '/:id', loadRestaurant, async (ctx) => {
  const { restaurant, currentUser } = ctx.state;

  const favouriteList = await getFavouriteRestaurants(ctx, currentUser);
  const reviewsList = await getReviews(ctx, restaurant);
  const votes = await getVotes(ctx, currentUser, restaurant);
  const categoriesList = await getCategories(ctx, restaurant);
  const dishesList = await getDishes(ctx, restaurant);
  const reviewsCount = await ctx.orm.review.findAll();
  const count = reviewsCount.slice(-1)[0].dataValues.id;
  const encriptador = new SimpleCrypto(_secretKey);
  const encryptedrestaurantId = encriptador.encrypt(restaurant.id)
  let encrypteduserId = ''
  if (ctx.state.currentUser){
    encrypteduserId = encriptador.encrypt(currentUser.id)
  }
  


  await ctx.render('restaurants/show', {

    restaurant,
    encryptedrestaurantId,
    encrypteduserId,
    favouriteList,
    votes,
    categoriesList,
    count,
    dishesList,
    reviewsList,
    newReservationPath: ctx.router.url('restaurants.newReservation', { id: restaurant.id }),
    editRestaurantPath: ctx.router.url('restaurants.edit', { id: restaurant.id }),
    deleteRestaurantPath: ctx.router.url('restaurants.delete', { id: restaurant.id }),
    submitScorePath: ctx.router.url('restaurants.addscore', { id: restaurant.id }),
    newDishPath: ctx.router.url('dishes.new', { id: restaurant.id }),
    addCategoryPath: ctx.router.url('restaurantcategories.new'),
    updateRestaurantImagePath: ctx.router.url('imageRestaurant.listRestaurant'),
    viewDishesPath: ctx.router.url('restaurantDishes.viewDishes', { id: restaurant.id, list: dishesList }),
    editScorePath: (item) => ctx.router.url('restaurants.editscore', { id: restaurant.id, item }),
    addFavouriteRestaurantPath: (user) => (ctx.router.url('favrestaurants.new', { userId: user.id, restaurantId: restaurant.id })),
    showDishPath: (element) => ctx.router.url('dishes.show', { id: element.id }),
  });
});

router.post('restaurants.addscore', '/:id', loadRestaurant, async (ctx) => {
  const { restaurant, currentUser } = ctx.state;
  const { scoreValue } = ctx.request.body;
  const scoreData = parseInt(scoreValue, 10);
  if (!currentUser) {
    ctx.redirect(ctx.router.url('restaurants.show', { id: restaurant.id }));
  }

  // ACA ESTA BIEN SOLO DOS == porque son de distinto tipo
  // Si el nuevo score no es entero, no se hace update
  // eslint-disable-next-line eqeqeq
  if (!(scoreData == scoreValue) || scoreData > 5 || scoreData < 0) {
    ctx.redirect(ctx.router.url('restaurants.show', { id: restaurant.id }));
  } else {
    const newScore = ctx.orm.userVote.build({ userId: currentUser.id, restaurantId: restaurant.id, scoreData: scoreValue });
    await newScore.save({ fields: ['userId', 'restaurantId', 'scoreData'] });

    const score = Math.round((((restaurant.score * restaurant.votes) + parseFloat(scoreValue)) / (restaurant.votes + 1)) * 100) / 100;
    const votes = restaurant.votes + 1;
    await restaurant.update({ score, votes });
    ctx.redirect(ctx.router.url('restaurants.show', { id: restaurant.id }));
  }
});

router.post('restaurants.editscore', '/:id/:item', loadRestaurant, async (ctx) => {
  const lastVote = await ctx.orm.userVote.findByPk(ctx.params.item);

  const { restaurant, currentUser } = ctx.state;
  const { scoreValue } = ctx.request.body;
  const scoreData = parseInt(scoreValue, 10);

  // ACA ESTA BIEN SOLO DOS == porque son de distinto tipo
  // Si el nuevo score no es entero, no se hace update
  // eslint-disable-next-line eqeqeq
  if (!(scoreData == scoreValue) || scoreData > 5 || scoreData < 0) {
    ctx.redirect(ctx.router.url('restaurants.show', { id: restaurant.id }));
  } else {
    if (!currentUser || currentUser.id !== lastVote.userId) {
      ctx.redirect(ctx.router.url('restaurants.show', { id: restaurant.id }));
    }
    const userId = currentUser.id;
    const restaurantId = restaurant.id;

    // eslint-disable-next-line no-mixed-operators
    const score = Math.round(((restaurant.score * restaurant.votes) + scoreData - parseInt(lastVote.scoreData, 10)) * 100 / (restaurant.votes)) / 100;
    await lastVote.update({ userId, restaurantId, scoreData });
    await restaurant.update({ score });

    ctx.redirect(ctx.router.url('restaurants.show', { id: restaurant.id }));
  }
});


router.post('restaurants.create', '/', async (ctx) => {
  if (!validateFields(ctx.request.body)) return ctx.redirect(ctx.router.url('restaurants.new'));
  const restaurant = ctx.orm.restaurant.build(ctx.request.body);
  try {
    await setLatLng(restaurant);
    await restaurant.save({ fields: ['name', 'address', 'open_at', 'close_at', 'phone', 'nickname', 'password', 'commune', 'lat', 'lng'] });
    const reg = await ctx.orm.registration.build({ restaurantId: restaurant.id });
    await reg.save();
    ctx.session.registrationId = reg.id;
    ctx.redirect(ctx.router.url('restaurants.list'));
  } catch (validationError) {
    await ctx.render('restaurants/new', {
      restaurant,
      errors: validationError.errors,
      submitRestaurantPath: ctx.router.url('restaurants.create'),
    });
  }
});

router.patch('restaurants.update', '/:id', loadRestaurant, async (ctx) => {
  const { restaurant } = ctx.state;
  if (!(ctx.state.currentRestaurant && (ctx.state.currentRestaurant.id === restaurant.id))) {
    ctx.redirect(ctx.router.url('restaurants.show', { id: restaurant.id }));
  }
  try {
    // score, votes,
    // eslint-disable-next-line camelcase, object-curly-newline
    if (!validateFields(ctx.request.body)) return ctx.redirect(ctx.router.url('restaurants.edit', { id: restaurant.id }));
    const {
      name, address, open_at, close_at, phone, nickname, password,
    } = ctx.request.body;

    // eslint-disable-next-line object-curly-newline
    await restaurant.update({ name, address, open_at, close_at, phone, nickname, password });

    ctx.redirect(ctx.router.url('restaurants.list'));
  } catch (validationError) {
    await ctx.render('restaurants/edit', {
      restaurant,
      errors: validationError.errors,
      submitRestaurantPath: ctx.router.url('restaurants.update'),
    });
  }
});

router.del('restaurants.delete', '/:id', loadRestaurant, async (ctx) => {
  const { restaurant, currentRestaurant } = ctx.state;
  if (!(currentRestaurant && (currentRestaurant.id === restaurant.id))
    || (ctx.state.currentUser && ctx.state.currentUser.admin)) {
    ctx.redirect(ctx.router.url('restaurants.show', { id: restaurant.id }));
  }
  await restaurant.destroy();
  ctx.redirect(ctx.router.url('restaurants.list'));
});

// eslint-disable-next-line consistent-return
router.get('restaurants.newReservation', '/new-reservation/:id', loadRestaurant, async (ctx) => {
  const { restaurant, currentUser } = ctx.state;

  if (!currentUser) return ctx.redirect(ctx.state.newSessionPath);

  const tables = await ctx.orm.table.findAll({
    where: {
      restaurantId: restaurant.id,
    },
  });
  const dishes = await ctx.orm.dish.findAll({
    where: {
      restaurantId: restaurant.id,
    },
  });
  const reservation = ctx.orm.reservation.build();
  await ctx.render('restaurants/newReservation', {
    currentUser,
    restaurant,
    reservation,
    tables,
    dishes,
    submitPath: ctx.router.url('reservations.create'),
  });
});

module.exports = router;
