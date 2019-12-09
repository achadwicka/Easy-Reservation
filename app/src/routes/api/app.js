/* eslint-disable no-underscore-dangle */
const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadUser(ctx, next) {
  const { token } = ctx.request.query;

  if (token) {
    const apps = await ctx.orm.app.findOne({
      where: {
        access_token: token,
      },
    });

    ctx.state.user = await ctx.orm.user.findByPk(apps.userId);
  }

  return next();
}

async function loadRestaurant(ctx, next) {
  ctx.state.restaurant = await ctx.orm.restaurant.findByPk(ctx.params.id);
  return next();
}

async function loadReservation(ctx, next) {
  const { user } = ctx.state;
  let reserv = await ctx.orm.reservation.findByPk(ctx.params.id);

  if (!(reserv && user && reserv.userId === user.id)) reserv = 'Not Found';

  // eslint-disable-next-line prefer-destructuring
  ctx.state.reservation = reserv;

  return next();
}

async function fieldCorrectness(ctx, fields_) {
  if (!fields_) return false;
  if (!fields_.day) return false;
  if (!fields_.hour) return false;
  // eslint-disable-next-line no-restricted-globals
  if (!fields_.restaurantId || isNaN(fields_.restaurantId)) return false;

  const rest = await ctx.orm.restaurant.findByPk(fields_.restaurantId);
  if (!rest) return false;

  // eslint-disable-next-line no-restricted-globals
  if (!fields_.peopleCount || isNaN(fields_.peopleCount)) return false;

  return true;
}

router.get('api.instructions', '/', async (ctx) => {
  const instructions = [
    'Hi, these are the instructions for our API',
    '',
    '',
    'The routes you can access with this API are:',
    '',
    'GET /api to get this instructions',
    'GET /api/restaurants to get the restaurants',
    'GET /api/restaurants/:id to get a specific restaurant by it\'s id',
    'GET /api/categories to get the categories',
    'GET /api/myReservations to get your own reservations',
    'GET /api/myReservations/:id to get only one reservation by it\'s id',
    'POST /api/myReservations/new to create a new reservation',
    'DEL /api/myReservations/:id to delete a reservation by it\'s id',
    '',
    '',
    'For the GET and the DEL requests, in order for the query to get',
    'accepted you must include your access token as a parameter',
    'like ?token=YOUR_ACCESS_TOKEN',
    'To get one go to /developer/apps and create your own app.',
    '',
    'You also can specify a limit for the search by including the limit parameter',
    'in the query like ?limit=3',
    '',
    'In the case of the POST to create a reservation you will need to pass as a',
    'the following fields in the body of the request:',
    '',
    '"restaurantId" the id for the restaurant you want to make a reservation to.',
    '"peopleCount" the amount of people that the reservation will be for',
    '"day" in a date format (a full Javascript Date object should do it)',
    '"hour" in a 24 hours HH:MM:SS format',
    '"comments" leaving an optional comment for the restaurant.',
    '',
    '',
    'A few full examples for valid requests may be:',
    '',
    'GET /api/restaurants?token=YOUR_ACCESS_TOKEN',
    'GET /api/restaurants/2?token=YOUR_ACCESS_TOKEN',
    'GET /api/myReservations?token=YOUR_ACCESS_TOKEN&limit=3',
    '',
    'POST /api/myReservations/new?token=YOUR_ACCESS_TOKEN',
    'body:',
    '{ day: 2019-11-27T08:46:14.408Z, hour: 13:30:00, comments: "hi there", restaurantId: 2, peopleCount: 6 }',
    '',
    'DEL /api/myReservations/1?token=YOUR_ACCESS_TOKEN',
  ].join('\n');

  ctx.body = instructions;
});

router.get('api.getRestaurants', '/restaurants', loadUser, async (ctx) => {
  const { user } = ctx.state;
  let response = { fake: 'this should never be seen' };

  const conditions = {};
  const { limit } = ctx.request.query;

  if (limit) conditions.limit = limit;

  if (user) {
    const restaurants = await ctx.orm.restaurant.findAll(conditions);
    restaurants.sort((a, b) => ((a.name < b.name) ? 1 : -1));

    response = {
      status: 200,
      message: 'Ok',
      data: restaurants,
    };

    if (!restaurants) {
      response = {
        status: 404,
        message: 'No Restaurants Found',
      };
    }
  } else {
    response = {
      status: 401,
      message: 'Unauthorized',
    };
  }

  ctx.body = response;
});

router.get('api.getRestaurant', '/restaurants/:id', loadUser, loadRestaurant, async (ctx) => {
  const { user, restaurant } = ctx.state;

  let response = {
    status: 200,
    message: 'Ok',
    data: restaurant,
  };

  if (!restaurant) {
    response = {
      status: 404,
      message: 'Not Found',
    };
  }

  if (!user) {
    response = {
      status: 401,
      message: 'Unauthorized',
    };
  }

  ctx.body = response;
});

router.get('api.getCategories', '/categories', loadUser, async (ctx) => {
  const { user } = ctx.state;
  let response = { fake: 'this should never be seen' };

  const conditions = {};
  const { limit } = ctx.request.query;

  if (limit) conditions.limit = limit;

  if (user) {
    const categories = await ctx.orm.category.findAll(conditions);
    categories.sort((a, b) => ((a.name < b.name) ? 1 : -1));

    response = {
      status: 200,
      message: 'Ok',
      data: categories,
    };

    if (!categories) {
      response = {
        status: 404,
        message: 'No Categories Found',
      };
    }
  } else {
    response = {
      status: 401,
      message: 'Unauthorized',
    };
  }

  ctx.body = response;
});

router.get('api.getMyReservations', '/myReservations', loadUser, async (ctx) => {
  const { user } = ctx.state;
  let response = { fake: 'this should never be seen' };

  const conditions = {};
  const { limit } = ctx.request.query;

  if (limit) conditions.limit = limit;

  if (user) {
    conditions.where = {
      userId: user.id,
    };

    const reservations = await ctx.orm.reservation.findAll(conditions);

    response = {
      status: 200,
      message: 'Ok',
      data: reservations,
    };

    if (!reservations) {
      response = {
        status: 404,
        message: 'No Reservations Found',
      };
    }
  } else {
    response = {
      status: 401,
      message: 'Unauthorized',
    };
  }

  ctx.body = response;
});

router.get('api.getReservation', '/myReservations/:id', loadUser, loadReservation, async (ctx) => {
  const { user, reservation } = ctx.state;

  let response = {
    status: 200,
    message: 'Ok',
    data: reservation,
  };

  if (!reservation) {
    response = {
      status: 404,
      message: 'Not Found',
    };
  }

  if (reservation === 'Not Found') {
    response = {
      status: 401,
      message: 'Access denied',
    };
  }

  if (!user) {
    response = {
      status: 401,
      message: 'Unauthorized',
    };
  }

  ctx.body = response;
});

router.post('api.newReservation', '/myReservations/new', loadUser, async (ctx) => {
  // postman hace el post pero no llega ("not found")
  // errores 404 en consola

  const { user } = ctx.state;
  const fields_ = ctx.request.body;
  const message = {
    status: -100,
    message: 'fake message',
  };

  if (user && fieldCorrectness(ctx, fields_)) {
    fields_.userId = user.id;
    fields_.acceptance = 0;
    fields_.day = new Date(fields_.day);

    try {
      const reservation = ctx.orm.reservation.build(fields_);
      await reservation.save({ fields: ['userId', 'restaurantId', 'day', 'hour', 'peopleCount', 'comments', 'acceptance'] });

      message.status = 200;
      message.message = 'Reservation was successfull';
    } catch (err) {
      message.status = 500;
      message.message = 'Some server error while creating a new reservation: failed';
    }
  } else {
    message.status = 400;
    message.message = 'Some client error while creating a new reservation: failed';
  }

  ctx.body = message;
});

router.del('api.deleteReservation', '/myReservations/:id', loadUser, loadReservation, async (ctx) => {
  const { reservation, user } = ctx.state;
  const message = {};
  const { id } = ctx.params;

  if (user && reservation && user.id === reservation.userId) {
    try {
      await reservation.destroy();
      message.status = 200;
      message.message = `Reservation of id ${id.toString()} successfully deleted.`;
    } catch (err) {
      message.status = 500;
      message.message = `Some server error while deleting reservation of id ${id.toString()}: not deleted.`;
    }
  } else {
    message.status = 400;
    message.message = `Some client error while deleting reservation of id ${id.toString()}: not deleted.`;
  }

  ctx.body = message;
});

module.exports = router;
