const KoaRouter = require('koa-router');
const cloudinary = require('cloudinary').v2;

// const fs = require('fs');
// const pkg = require('../../package.json');

// Seteamos la conexion con cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.STORAGE_KEY,
  api_secret: process.env.STORAGE_SECRET,
});


const router = new KoaRouter();

router.get('images.list', '/', async (ctx) => {
  await ctx.render('images/index', {
    submitImagePath: ctx.router.url('images.upload'),
  });
});

router.get('images.image', '/image', async (ctx) => {
  await ctx.render('images/image', {
    submitImagePath: ctx.router.url('images.upload'),
  });
});

router.post('images.upload', '/image', async (ctx) => {
  const { file } = ctx.request.files;
  const { currentUser } = ctx.state;

  // eslint-disable-next-line eqeqeq
  if (file.type != 'image/png' && file.type != 'image/jpeg') {
    // console.log('No puedo subirlo');
  } else {
    // eslint-disable-next-line no-unused-vars
    const uploadedFile = await cloudinary.uploader.upload(file.path);
    // Aca tenemos el url de la imagen en uploadedFile.url, hay que guardar
    const image = uploadedFile.url;

    await currentUser.update({ image });
  }

  const { nickname } = currentUser;
  await ctx.redirect(ctx.router.url('users.show', { nickname }));
});

module.exports = router;
