/* eslint-disable consistent-return */
const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadCategory(ctx, next) {
  ctx.state.category = await ctx.orm.category.findByPk(ctx.params.id);
  return next();
}

async function loadRestaurants(ctx, next) {
  const categories = await ctx.orm.restaurantCategory.findAll({
    where: { categoryId: ctx.state.category.id },
  });
  ctx.state.restaurantList = [];
  for (let i = 0; i < categories.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const restaurant = await ctx.orm.restaurant.findByPk(categories[i].restaurantId);
    ctx.state.restaurantList.push(restaurant);
  }
  return next();
}

router.get('categories.list', '/', async (ctx) => {
  const categoryList = await ctx.orm.category.findAll();
  await ctx.render('categories/index', {
    categoryList,
    newCategoryPath: ctx.router.url('categories.new'),
    editCategoryPath: (category) => ctx.router.url('categories.edit', { id: category.id }),
    deleteCategoryPath: (category) => ctx.router.url('categories.delete', { id: category.id }),
    showCategoryPath: (category) => ctx.router.url('categories.show', { id: category.id }),
  });
});

router.get('categories.new', '/new', async (ctx) => {
  if (!ctx.state.currentRestaurant) return ctx.redirect(ctx.router.url('categories.list'));
  const category = ctx.orm.category.build();
  await ctx.render('categories/new', {
    category,
    submitCategoryPath: ctx.router.url('categories.create'),
  });
});

router.get('categories.edit', '/:id/edit', loadCategory, async (ctx) => {
  if (!ctx.state.currentUser) return ctx.redirect(ctx.router.url('categories.list'));
  const { category } = ctx.state;
  await ctx.render('categories/edit', {
    category,
    submitCategoryPath: ctx.router.url('categories.update', { id: category.id }),
  });
});

router.get('categories.show', '/:id', loadCategory, loadRestaurants, async (ctx) => {
  const { category, restaurantList } = ctx.state;
  await ctx.render('categories/show', {
    category,
    restaurantList,
    editCategoryPath: ctx.router.url('categories.edit', { id: category.id }),
    deleteCategoryPath: ctx.router.url('categories.delete', { id: category.id }),
    showRestaurantPath: (restaurant) => ctx.router.url('restaurants.show', { id: restaurant.id }),
  });
});

router.post('categories.create', '/', async (ctx) => {
  if (ctx.state.currentRestaurant) {
    const category = ctx.orm.category.build(ctx.request.body);
    try {
      await category.save({ fields: ['name'] });
      ctx.redirect(ctx.router.url('restaurantcategories.new'));
    } catch (validationError) {
      await ctx.render('categories/new', {
        category,
        errors: validationError.errors,
        submitCategoryPath: ctx.router.url('categories.create'),
      });
    }
  }
});


router.patch('categories.update', '/:id', loadCategory, async (ctx) => {
  if (!ctx.state.currentUser) return ctx.redirect(ctx.router.url('categories.list'));
  const { category } = ctx.state;
  try {
    // score, votes,
    // eslint-disable-next-line camelcase, object-curly-newline
    const { name } = ctx.request.body;

    // eslint-disable-next-line object-curly-newline
    await category.update({ name });

    ctx.redirect(ctx.router.url('categories.list'));
  } catch (validationError) {
    await ctx.render('categories/edit', {
      category,
      errors: validationError.errors,
      submitCategoryPath: ctx.router.url('categories.update'),
    });
  }
});

router.del('categories.delete', '/:id', loadCategory, async (ctx) => {
  if (!ctx.state.currentUser) return ctx.redirect(ctx.router.url('categories.list'));
  const { category } = ctx.state;
  await category.destroy();
  ctx.redirect(ctx.router.url('categories.list'));
});

module.exports = router;
