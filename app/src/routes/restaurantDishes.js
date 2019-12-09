const KoaRouter = require('koa-router');
const fx = require('money');
const axios = require('axios');

const router = new KoaRouter();

async function changePrices(ctx, dishesList) {

  const rates = await axios.get('https://openexchangerates.org/api/latest.json?app_id=e181f72e2e724c00abad8f417a3d3515');

  fx.base = 'USD';
  fx.rates = {
    "EUR" : rates.data.rates['EUR'],
    "GBP" : rates.data.rates['GBP'], 
    "HKD" : rates.data.rates['HKD'],
    "CLP" : rates.data.rates['CLP'],
    "USD" : rates.data.rates['USD'], 
  }

  for (let dish = 0; dish < dishesList.length; dish++) {
    dishesList[dish].price = Math.round(await fx.convert(dishesList[dish].price, {from: "CLP", to: ctx.session.currency}) * 100) / 100;
  };
  return dishesList;
;}


router.get('restaurantDishes.viewDishes', '/:id/dishes', async (ctx) => {
  const restaurant = await ctx.orm.restaurant.findByPk(ctx.params.id);
  const symbol = ctx.session.symbol;
  const dishesList1 = await ctx.orm.dish.findAll({
    where: { restaurantId: restaurant.id },
  });

  const dishesList = await changePrices(ctx, dishesList1);


  await ctx.render('restaurants/restaurantDishes', {
    restaurant,
    symbol,
    dishesList,
    showDishPath: (element) => ctx.router.url('dishes.show', { id: element.id }),
    newDishPath: ctx.router.url('dishes.new', { id: restaurant.id }),
    backtoRestaurantPath: ctx.router.url('restaurants.show', { id: restaurant.id }),
  });
});

module.exports = router;
