/* eslint-disable consistent-return */
/* eslint-disable no-await-in-loop */
const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function clearCategories(ctx, currentRestaurant) {
  const inRestaurant = await ctx.orm.restaurantCategory.findAll({
    where: { restaurantId: currentRestaurant.id },
  });
  const len = inRestaurant.length;
  for (let i = 0; i < len; i += 1) {
    const categoryRestaurant = inRestaurant.pop();
    await categoryRestaurant.destroy();
  }
}


router.get('restaurantcategories.new', '/new', async (ctx) => {
  const { currentRestaurant } = ctx.state;
  if (!currentRestaurant) return ctx.redirect(ctx.router.url('restaurants.list'));
  const categories = await ctx.orm.category.findAll({
    order: [
      ['name', 'ASC'],
      ['id', 'ASC'],
    ],
  });
  const categoriesList = [];
  const inRestaurant = await ctx.orm.restaurantCategory.findAll({
    where: { restaurantId: currentRestaurant.id },
  });
  for (let i = 0; i < inRestaurant.length; i += 1) {
    inRestaurant[i] = inRestaurant[i].categoryId;
  }
  for (let i = 0; i < categories.length; i += 1) {
    if (inRestaurant.includes(categories[i].id)) {
      categoriesList.push([categories[i], true]);
    } else {
      categoriesList.push([categories[i], false]);
    }
  }
  await ctx.render('restaurantcategories/new', {
    categoriesList,
    submitCategoryPath: ctx.router.url('restaurantcategories.update'),
    newCategoryPath: ctx.router.url('categories.new'),
  });
});

router.post('restaurantcategories.update', '/', async (ctx) => {
  const { currentRestaurant } = ctx.state;
  const { categories } = ctx.request.body;
  if (!currentRestaurant) return ctx.redirect(ctx.router.url('restaurants.list'));
  try {
    await clearCategories(ctx, currentRestaurant);
    for (let i = 0; categories && i < categories.length; i += 1) {
      const categoryId = categories[i];
      const newRestCategory = ctx.orm.restaurantCategory.build({
        restaurantId: currentRestaurant.id,
        categoryId,
      });
      await newRestCategory.save();
    }
  } finally {
    ctx.redirect(ctx.router.url('restaurants.show', { id: currentRestaurant.id }));
  }
});

module.exports = router;
