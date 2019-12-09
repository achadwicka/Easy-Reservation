const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('favrestaurants.new', '/:userId/:restaurantId', async (ctx) => {
  const uId = ctx.params.userId;
  const rId = ctx.params.restaurantId;
  const newFavourite = ctx.orm.favouriteRestaurants.build({ userId: uId, restaurantId: rId });
  await newFavourite.save({ fields: ['userId', 'restaurantId'] });

  await ctx.redirect(ctx.router.url('users.list'));
});

module.exports = router;
