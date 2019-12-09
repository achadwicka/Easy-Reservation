const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.post('returnRestaurant.map-ajax-search', '/map-ajax-search', async (ctx) => {
  const restaurantList = await ctx.orm.restaurant.findAll();

  ctx.response.body = restaurantList;
});

module.exports = router;
