const KoaRouter = require('koa-router');

const router = new KoaRouter();

// disabled for testing purposes
// const sendLoginAlertEmail = require('../mailers/login-alert');

async function checkRefer(ctx, next) {
  const routeBack = ctx.request.header.referer.split('/');
  // eslint-disable-next-line no-restricted-globals
  if ((routeBack[routeBack.length - 1]) && !isNaN(routeBack[routeBack.length - 1])) {
    ctx.session.routeBack = [routeBack[routeBack.length - 2], routeBack[routeBack.length - 1]];
  } else if (ctx.session.routeBack) {
    const rtBk = ctx.session.routeBack;
    ctx.session.routeBack = rtBk;
  }
  return next();
}

/** User session */
router.get('session.new', '/new', checkRefer, async (ctx) => ctx.render('session/new', {
  createSessionPath: ctx.router.url('session.create'),
  newUserPath: ctx.router.url('users.new'),
  newRestSessionPath: ctx.router.url('session.newRest'),
  notice: ctx.flashMessage.notice,
}));

router.put('session.create', '/', checkRefer, async (ctx) => {
  const { email, password } = ctx.request.body;
  const user = await ctx.orm.user.findOne({ where: { email } });
  const isPasswordCorrect = user && await user.checkPassword(password);
  if (isPasswordCorrect) {
    try {
      const reg = await ctx.orm.registration.build({ userId: user.id });
      await reg.save();
      ctx.session.registrationId = reg.id;
      if (ctx.session.routeBack) {
        const redirectTo = `${ctx.session.routeBack[0]}.show`;
        return ctx.redirect(ctx.router.url(redirectTo, { id: ctx.session.routeBack[1] }));
      }
      return ctx.redirect('/');
    } catch (validationError) {
      ctx.render('session/new', {
        email,
        newUserPath: ctx.router.url('users.new'),
        newRestSessionPath: ctx.router.url('session.newRest'),
        createSessionPath: ctx.router.url('session.create'),
        error: 'Email or password is incorrect',
      });
    }
  }
  return ctx.render('session/new', {
    email,
    newUserPath: ctx.router.url('users.new'),
    newRestSessionPath: ctx.router.url('session.newRest'),
    createSessionPath: ctx.router.url('session.create'),
    error: 'Incorrect mail or password',
  });
});

/** Restaurant session */
router.get('session.newRest', '/newRest', async (ctx) => ctx.render('session/newRestaurant', {
  createRestSessionPath: ctx.router.url('session.createRest'),
  newRestaurantPath: ctx.router.url('restaurants.new'),
  newSessionPath: ctx.router.url('session.new'),
  notice: ctx.flashMessage.notice,
}));

router.put('session.createRest', '/rest', async (ctx) => {
  const { nickname, password } = ctx.request.body;
  const restaurant = await ctx.orm.restaurant.findOne({ where: { nickname } });
  const isPasswordCorrect = restaurant && await restaurant.checkPassword(password);
  if (isPasswordCorrect) {
    try {
      const reg = await ctx.orm.registration.build({ restaurantId: restaurant.id });
      await reg.save();
      ctx.session.registrationId = reg.id;
      return ctx.redirect(ctx.router.url('restaurants.list'));
    } catch (validationError) {
      ctx.render('session/newRestaurant', {
        newRestaurantPath: ctx.router.url('restaurants.new'),
        newSessionPath: ctx.router.url('session.new'),
        createRestSessionPath: ctx.router.url('session.createRest'),
        error: 'Email or password is incorrect',
      });
    }
  }

  return ctx.render('session/newRestaurant', {
    newRestaurantPath: ctx.router.url('restaurants.new'),
    newSessionPath: ctx.router.url('session.new'),
    createRestSessionPath: ctx.router.url('session.createRest'),
    error: 'Incorrect nickname or password',
  });
});

/** Comun */
router.delete('session.destroy', '/', async (ctx) => {
  try {
    const reg = await ctx.orm.registration.findByPk(ctx.session.registrationId);
    await reg.destroy();
    ctx.session = null;
    ctx.redirect(ctx.router.url('restaurants.list'));
  } catch (validationError) {
    ctx.send('Oops, looks something went wrong');
  }
});
module.exports = router;
