/* eslint-disable consistent-return */
/* eslint-disable camelcase */

// Este archivo maneja la generacion de tokens de acceso
// para ser utilizados por la API.
// El archivo app.js maneja la api.

const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadApp(ctx, next) {
  ctx.state.app = await ctx.orm.app.findByPk((ctx.params.id));
  return next();
}

const TOKEN_LENGTH = 45;

function maketoken(length) {
  let result = '';
  const characters = '!#$%&=?¡¿+*-_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}


router.get('developer.myApps', '/apps', async (ctx) => {
  const { currentUser } = ctx.state;
  let apps;

  if (currentUser) {
    apps = await ctx.orm.app.findAll({
      where: {
        userId: currentUser.id,
      },
    });
  }

  await ctx.render('developer/index', {
    currentUser,
    apps,
    newAppPath: ctx.router.url('developer.app.new'),
    showAppPath: (app) => ctx.router.url('developer.app.show', { id: app.id }),
    newSessionPath: ctx.router.url('session.new'),
  });
});

router.get('developer.app.new', '/app/new', async (ctx) => {
  const { currentUser } = ctx.state;
  if (!currentUser) return ctx.redirect(ctx.state.newSessionPath);

  const app = ctx.orm.app.build();
  await ctx.render('developer/newApp', {
    app,
    currentUser,
    submitAppPath: ctx.router.url('developer.app.create'),
    cancelPath: ctx.router.url('developer.myApps'),
  });
});

router.get('developer.app.edit', '/app/:id/edit', loadApp, async (ctx) => {
  const { currentUser, app } = ctx.state;

  await ctx.render('developer/editApp', {
    app,
    currentUser,
    submitAppPath: ctx.router.url('developer.app.update', { id: app.id }),
    cancelPath: ctx.router.url('developer.myApps'),
  });
});

router.get('developer.app.show', '/app/:id', loadApp, async (ctx) => {
  const { currentUser, app } = ctx.state;

  await ctx.render('developer/showApp', {
    currentUser,
    app,
    editAppPath: ctx.router.url('developer.app.edit', { id: app.id }),
    deleteAppPath: ctx.router.url('developer.app.delete', { id: app.id }),
  });
});

router.post('developer.app.create', '/', async (ctx) => {
  const { currentUser } = ctx.state;

  const fields = ctx.request.body;
  fields.userId = currentUser.id;

  const acc_tok = maketoken(TOKEN_LENGTH);

  // comprovar que acc_tok no exista
  // así se asegura de que este es único.
  // A baja escala no es necesario (token aleatorio de largo 60).

  fields.access_token = acc_tok;

  const app = ctx.orm.app.build(fields);
  await app.save({ fields: ['userId', 'name', 'description', 'access_token'] });

  await ctx.redirect(ctx.router.url('developer.myApps'));
});

router.patch('developer.app.update', '/:id', loadApp, async (ctx) => {
  const { currentUser, app } = ctx.state;
  const { name, description } = ctx.request.body;

  if (currentUser && app && currentUser.id === app.userId) {
    await app.update({ name, description });
  }

  ctx.redirect(ctx.router.url('developer.myApps'));
});

router.del('developer.app.delete', '/:id', loadApp, async (ctx) => {
  const { app, currentUser } = ctx.state;

  if (currentUser && app && currentUser.id === app.userId) {
    await app.destroy();
  }
  ctx.redirect(ctx.router.url('developer.myApps'));
});

module.exports = router;
