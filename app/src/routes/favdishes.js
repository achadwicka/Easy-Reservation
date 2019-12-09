const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('favdishes.new', '/:userId/:dishId', async (ctx) => {
  const uId = ctx.params.userId;
  const dId = ctx.params.dishId;
  const newFavourite = ctx.orm.favouriteDishes.build({ userId: uId, dishId: dId });
  await newFavourite.save({ fields: ['userId', 'dishId'] });

  await ctx.redirect(ctx.router.url('users.list'));
});

module.exports = router;
