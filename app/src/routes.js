const KoaRouter = require('koa-router');

const hello = require('./routes/hello');
const index = require('./routes/index');
const users = require('./routes/users');
const reservations = require('./routes/reservations');
const reviews = require('./routes/reviews');
const restaurants = require('./routes/restaurants');
const dishes = require('./routes/dishes');
const tables = require('./routes/tables');
const categories = require('./routes/categories');
const session = require('./routes/session');
const images = require('./routes/images');
const favrestaurants = require('./routes/favrestaurants');
const favdishes = require('./routes/favdishes');
const maps = require('./routes/maps');
const restaurantcategories = require('./routes/restaurantCategories');
const returnRestaurant = require('./routes/returnRestaurant');
const imageRestaurant = require('./routes/imageRestaurant');
const restaurantDishes = require('./routes/restaurantDishes');
const apiReview = require('./routes/api/reviews');
const setCurrency = require('./routes/setCurrency');
const apiDeveloper = require('./routes/api/developer');
const api = require('./routes/api/app');

const router = new KoaRouter();

router.use(async (ctx, next) => {
  // eslint-disable-next-line max-len
  const reg = ctx.session.registrationId && await ctx.orm.registration.findByPk(ctx.session.registrationId);
  if (reg) {
    if (reg.userId) {
      const user = await ctx.orm.user.findByPk(reg.userId);
      Object.assign(ctx.state, {
        currentUser: user,
        currentRestaurant: null,
        newSessionPath: ctx.router.url('session.new'),
        newRestSessionPath: ctx.router.url('session.newRest'),
        destroySessionPath: ctx.router.url('session.destroy'),
        restaurantsPath: ctx.router.url('restaurants.list'),
      });
    } else {
      const restaurant = await ctx.orm.restaurant.findByPk(reg.restaurantId);
      Object.assign(ctx.state, {
        currentUser: null,
        currentRestaurant: restaurant,
        newSessionPath: ctx.router.url('session.new'),
        newRestSessionPath: ctx.router.url('session.newRest'),
        destroySessionPath: ctx.router.url('session.destroy'),
        restaurantsPath: ctx.router.url('restaurants.list'),
      });
    }
  } else {
    Object.assign(ctx.state, {
      currentUser: null,
      currentRestaurant: null,
      newSessionPath: ctx.router.url('session.new'),
      destroySessionPath: ctx.router.url('session.destroy'),
      restaurantsPath: ctx.router.url('restaurants.list'),
    });
  }
  return next();
});


router.use('/', index.routes());
router.use('/hello', hello.routes());
router.use('/users', users.routes());
router.use('/reservations', reservations.routes());
router.use('/reviews', reviews.routes());
router.use('/restaurants', restaurants.routes());
router.use('/dishes', dishes.routes());
router.use('/tables', tables.routes());
router.use('/categories', categories.routes());
router.use('/session', session.routes());
router.use('/images', images.routes());
router.use('/favrestaurants', favrestaurants.routes());
router.use('/favdishes', favdishes.routes());
router.use('/maps', maps.routes());
router.use('/restaurantcategories', restaurantcategories.routes());
router.use('/returnRestaurant', returnRestaurant.routes());
router.use('/imageRestaurant', imageRestaurant.routes());
router.use('/restaurantDishes', restaurantDishes.routes());
router.use('/apiReview', apiReview.routes());
router.use('/setCurrency', setCurrency.routes());
router.use('/developer', apiDeveloper.routes());
router.use('/api', api.routes());

module.exports = router;
