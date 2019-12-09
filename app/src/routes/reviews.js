const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadReview(ctx, next) {
  ctx.state.review = await ctx.orm.review.findByPk(ctx.params.id);
  return next();
}

async function loadUser(ctx, next) {
  ctx.state.user = await ctx.orm.user.findByPk(ctx.params.id);
  return next();
}

// router.get('reviews.list', '/', async (ctx) => {
//   const reviewsList = await ctx.orm.review.findAll();
//   await ctx.render('reviews/index', {
//     reviewsList,
//     newReviewPath: ctx.router.url('reviews.new'),
//     editReviewPath: (review) => ctx.router.url('reviews.edit', { id: review.id }),
//     showReviewPath: (review) => ctx.router.url('reviews.show', { id: review.id }),
//     deleteReviewPath: (review) => ctx.router.url('reviews.delete', { id: review.id }),
//   });
// });

router.get('reviews.new', '/new', async (ctx) => {
  const review = ctx.orm.review.build();
  await ctx.render('reviews/new', {
    review,
    submitReviewPath: ctx.router.url('reviews.create'),
  });
});

router.get('reviews.edit', '/:id/edit', loadReview, async (ctx) => {
  const { review } = ctx.state;
  await ctx.render('reviews/edit', {
    review,
    submitReviewPath: ctx.router.url('reviews.update', { id: review.id }),
  });
});

router.get('reviews.show', '/:id', loadReview, async (ctx) => {
  const { review } = ctx.state;
  await ctx.render('reviews/show', {
    review,
    submitReviewPath: ctx.router.url('review.list'),
    showUserPath: ctx.router.url('reviews.showuser', { id: review.userId }),
    editReviewPath: ctx.router.url('reviews.edit', { id: review.id }),
    deleteReviewPath: ctx.router.url('reviews.delete', { id: review.id }),
  });
});

router.get('reviews.showuser', '/user/:id', loadUser, async (ctx) => {
  const { user } = ctx.state;
  await ctx.render('users/show', {
    user,
    submitReviewPath: ctx.router.url('review.list'),
    backtoindexPath: ctx.router.url('users.list'),
  });
});

router.post('reviews.create', '/', async (ctx) => {
  const review = ctx.orm.review.build(ctx.request.body);
  try {
    await review.save({ fields: ['restaurantId', 'comment', 'userId'] });
    ctx.redirect(ctx.router.url('reviews.list'));
  } catch (validationError) {
    await ctx.render('reviews/new', {
      review,
      errors: validationError.errors,
      submitReviewPath: ctx.router.url('reviews.create'),
    });
  }
});

router.patch('reviews.update', '/:id', loadReview, async (ctx) => {
  const { review } = ctx.state;
  try {
    // eslint-disable-next-line object-curly-newline
    const { restaurantId, comment, userId } = ctx.request.body;
    // eslint-disable-next-line object-curly-newline
    await review.update({ restaurantId, comment, userId });
    ctx.redirect(ctx.router.url('reviews.list'));
  } catch (validationError) {
    await ctx.render('reviews/edit', {
      review,
      errors: validationError.errors,
      submitReviewPath: ctx.router.url('reviews.update'),
    });
  }
});

router.del('reviews.delete', '/:id', loadReview, async (ctx) => {
  const { review } = ctx.state;
  await review.destroy();
  ctx.redirect(ctx.router.url('reviews.list'));
});

module.exports = router;
