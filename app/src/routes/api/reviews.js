/* eslint-disable no-empty */
/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable eqeqeq */
const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('api.review', '/:restaurantId', async (ctx) => {
  ctx.state.restaurant = await ctx.orm.restaurant.findByPk(ctx.params.restaurantId);
  const reviewsList = await ctx.orm.review.findAll({ order: [['createdAt', 'ASC']] });
  const restaurantReviewList = reviewsList.filter((rev) => rev.restaurantId == ctx.params.restaurantId);

  ctx.body = ctx.jsonSerializer('reviews', {
    attributes: ['id', 'userId', 'restaurantId', 'comment', 'userName', 'markDown', 'createdAt', 'updatedAt'],

  }).serialize(restaurantReviewList);


  ctx.body.data.forEach(async (review) => {
    review.attributes['created-at'] = review.attributes['created-at'].toString().slice(0, -29);
    review.attributes['updated-at'] = review.attributes['updated-at'].toString().slice(0, -29);
  });
});

router.post('api.review.create', '/create/', async (ctx) => {
  const obj = JSON.parse(ctx.request.body);
  const review = ctx.orm.review.build(obj);

  try {
    await review.save({ fields: ['userId', 'restaurantId', 'comment', 'userName', 'markDown'] });
  } catch (validationError) {
  }
});

router.patch('api.review.update', '/update/', async (ctx) => {
  const obj = JSON.parse(ctx.request.body);

  ctx.orm.review.findById(obj.reviewId).then(async (review) => {
    try {
      const { comment } = obj;
      await review.update({ comment });
    } catch (validationError) {
    }
  });
});

router.del('api.review.delete', '/delete/:id', async (ctx) => {
  try {
    ctx.orm.review.findByPk(ctx.params.id).then(async (review) => { await review.destroy(); });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
});

module.exports = router;
