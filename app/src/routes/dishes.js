/* eslint-disable no-throw-literal */
const KoaRouter = require('koa-router');
const fx = require('money');
const axios = require('axios');

const router = new KoaRouter();

async function loadDish(ctx, next) {
  ctx.state.dish = await ctx.orm.dish.findByPk(ctx.params.id);
  return next();
}

async function loadRest(ctx, next) {
  ctx.state.restaurant = await ctx.orm.restaurant.findByPk(ctx.params.id);
  return next();
}

async function getFavouriteDishes(ctx, user) {
  if (!user) return [];
  const favDishesList = await ctx.orm.favouriteDishes.findAll({ where: { userId: user.id } });
  const ids = await favDishesList.map((dish) => dish.dishId);

  return ids;
}

async function getPrice(ctx, dish) {
  const rates = await axios.get('https://openexchangerates.org/api/latest.json?app_id=e181f72e2e724c00abad8f417a3d3515');

  fx.base = 'USD';
  fx.rates = {
    "EUR" : rates.data.rates['EUR'],
    "GBP" : rates.data.rates['GBP'], 
    "HKD" : rates.data.rates['HKD'],
    "CLP" : rates.data.rates['CLP'],
    "USD" : rates.data.rates['USD'], 
  }

  const finalPrice = Math.round(await fx.convert(dish.price, {from: "CLP", to: ctx.session.currency}) * 100) / 100;
  return finalPrice;
  }



function validateFields(body) {
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(body.price)) return false;
  return true;
}

// router.get('dishes.list', '/', async (ctx) => {
//   const dishList = await ctx.orm.dish.findAll();
//   await ctx.render('dishes/index', {
//     dishList,
//     newDishPath: ctx.router.url('dishes.new'),
//     editDishPath: (dish) => ctx.router.url('dishes.edit', { id: dish.id }),
//     deleteDishPath: (dish) => ctx.router.url('dishes.delete', { id: dish.id }),
//     showDishPath: (dish) => ctx.router.url('dishes.show', { id: dish.id }),
//   });
// });

router.get('dishes.new', '/new/:id', loadRest, async (ctx) => {
  const { restaurant } = ctx.state;


  if (ctx.state.currentRestaurant) {
    const dish = ctx.orm.dish.build();
    await ctx.render('dishes/new', {
      dish,
      restaurant,
      submitDishPath: ctx.router.url('dishes.create'),
    });
  } else {
    ctx.redirect(ctx.router.url('session.newRest'));
  }
});

router.get('dishes.edit', '/:id/edit', loadDish, async (ctx) => {
  if (ctx.state.currentRestaurant) {
    const { dish } = ctx.state;
    if (ctx.state.currentRestaurant.id === dish.restaurantId) {
      await ctx.render('dishes/edit', {
        dish,
        submitDishPath: ctx.router.url('dishes.update', { id: dish.id }),
      });
    } else {
      ctx.redirect(ctx.router.url('restaurants.orders'));
    }
  } else {
    ctx.redirect(ctx.router.url('session.newRest'));
  }
});

router.get('dishes.show', '/:id', loadDish, async (ctx) => {
  const { dish, currentUser, currentRestaurant } = ctx.state;
  const symbol = ctx.session.symbol;
  const favouriteList = await getFavouriteDishes(ctx, ctx.state.currentUser);
  dish.price = await getPrice(ctx, dish);


  await ctx.render('dishes/show', {
    dish,
    symbol,
    currentUser,
    currentRestaurant,
    favouriteList,
    editDishPath: ctx.router.url('dishes.edit', { id: dish.id }),
    deleteDishPath: ctx.router.url('dishes.delete', { id: dish.id }),

    addFavouriteDishPath: (user) => ctx.router.url('favdishes.new', { userId: user.id, dishId: dish.id }),
  });
});

router.post('dishes.create', '/', async (ctx) => {
  const { currentRestaurant } = ctx.state.currentRestaurant;
  // eslint-disable-next-line object-curly-newline
  const { name, price, description, restaurantId } = ctx.request.body;

  // eslint-disable-next-line eqeqeq
  if (currentRestaurant && currentRestaurant.id == restaurantId) {
    if (!validateFields(ctx.request.body)) throw 'input invalido';
    // eslint-disable-next-line object-curly-newline

    // const restaurantId = ctx.state.currentRestaurant.id;
    const dish = ctx.orm.dish.build({
      name, price, description, restaurantId,
    });
    try {
      await dish.save({ fields: ['name', 'price', 'description', 'restaurantId'] });
      ctx.redirect('/');
    } catch (validationError) {
      await ctx.render('dishes/new', {
        dish,
        errors: validationError.errors,
        submitDishPath: ctx.router.url('dishes.create'),
      });
    }
  } else {
    ctx.redirect(ctx.router.url('session.newRest'));
  }
});


router.patch('dishes.update', '/:id', loadDish, async (ctx) => {
  if (ctx.state.currentRestaurant) {
    const { dish } = ctx.state;
    if (ctx.state.currentRestaurant === dish.restaurantId) {
      try {
        // score, votes,
        if (!validateFields(ctx.request.body)) throw 'input invalido';
        const { name, price, description } = ctx.request.body;

        // eslint-disable-next-line object-curly-newline
        await dish.update({ name, price, description });

        ctx.redirect(ctx.router.url('dishes.list'));
      } catch (validationError) {
        await ctx.render('dishes/edit', {
          dish,
          errors: validationError.errors,
          submitDishPath: ctx.router.url('dishes.update'),
        });
      }
    } else {
      ctx.redirect(ctx.router.url('restaurants.orders'));
    }
  } else {
    ctx.redirect(ctx.router.url('session.newRest'));
  }
});

router.del('dishes.delete', '/:id', loadDish, async (ctx) => {
  const { currentUser, currentRestaurant, dish } = ctx.state;
  if ((currentUser && currentUser.admin)
  || (currentRestaurant && (currentRestaurant.id === dish.restaurantId))) {
    await dish.destroy();
    ctx.redirect('/');
  } else {
    ctx.redirect(ctx.router.url('restaurants.list'));
  }
  ctx.redirect('/');
});

module.exports = router;
