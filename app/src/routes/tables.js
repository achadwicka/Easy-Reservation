const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadTable(ctx, next) {
  ctx.state.table = await ctx.orm.table.findByPk(ctx.params.id);
  return next();
}

// router.get('tables.list', '/', async (ctx) => {
//   const tableList = await ctx.orm.table.findAll();
//   await ctx.render('tables/index', {
//     tableList,
//     newTablePath: ctx.router.url('tables.new'),
//     editTablePath: (table) => ctx.router.url('tables.edit', { id: table.id }),
//     deleteTablePath: (table) => ctx.router.url('tables.delete', { id: table.id }),
//     showTablePath: (table) => ctx.router.url('tables.show', { id: table.id }),
//   });
// });

router.get('tables.new', '/new', async (ctx) => {
  const table = ctx.orm.table.build();
  await ctx.render('tables/new', {
    table,
    submitTablePath: ctx.router.url('tables.create'),
  });
});

router.get('tables.edit', '/:id/edit', loadTable, async (ctx) => {
  const { table } = ctx.state;
  await ctx.render('tables/edit', {
    table,
    submitTablePath: ctx.router.url('tables.update', { id: table.id }),
  });
});

router.get('tables.show', '/:id', loadTable, async (ctx) => {
  const { table } = ctx.state;
  await ctx.render('tables/show', {
    table,
    editTablePath: ctx.router.url('tables.edit', { id: table.id }),
    deleteTablePath: ctx.router.url('tables.delete', { id: table.id }),
  });
});

router.post('tables.create', '/', async (ctx) => {
  const table = ctx.orm.table.build(ctx.request.body);
  try {
    await table.save({ fields: ['capacity'] });
    ctx.redirect(ctx.router.url('tables.list'));
  } catch (validationError) {
    await ctx.render('tables/new', {
      table,
      errors: validationError.errors,
      submitTablePath: ctx.router.url('tables.create'),
    });
  }
});


router.patch('tables.update', '/:id', loadTable, async (ctx) => {
  const { table } = ctx.state;
  try {
    // score, votes,
    // eslint-disable-next-line camelcase, object-curly-newline
    const { capacity } = ctx.request.body;

    // eslint-disable-next-line object-curly-newline
    await table.update({ capacity });

    ctx.redirect(ctx.router.url('tables.list'));
  } catch (validationError) {
    await ctx.render('tables/edit', {
      table,
      errors: validationError.errors,
      submitTablePath: ctx.router.url('tables.update'),
    });
  }
});

router.del('tables.delete', '/:id', loadTable, async (ctx) => {
  const { table } = ctx.state;
  await table.destroy();
  ctx.redirect(ctx.router.url('tables.list'));
});

module.exports = router;
