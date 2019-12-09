const KoaRouter = require('koa-router');
// const pkg = require('../../package.json');

const router = new KoaRouter();

router.get('maps.show', '/', async (ctx) => {
  const restaurantList = await ctx.orm.restaurant.findAll();

  await ctx.render('maps/index', { list: restaurantList });
});

module.exports = router;
