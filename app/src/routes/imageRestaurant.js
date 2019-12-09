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

router.get('imageRestaurant.listRestaurant', '/', async (ctx) => {
  await ctx.render('images/index', {
    submitImagePath: ctx.router.url('imageRestaurant.uploadRestaurant'),
  });
});

router.get('imageRestaurant.image', '/image', async (ctx) => {
  await ctx.render('images/image', {
    submitImagePath: ctx.router.url('images.upload'),
  });
});


router.post('imageRestaurant.uploadRestaurant', '/image', async (ctx) => {
  const { file } = ctx.request.files;
  const { currentRestaurant } = ctx.state;

  // Manejar el error de subir imagen
  // eslint-disable-next-line eqeqeq
  if (file.type != 'image/png' && file.type != 'image/jpeg') {
    // console.log('No puedo subirlo');
  } else {
    // eslint-disable-next-line no-unused-vars
    const uploadedFile = await cloudinary.uploader.upload(file.path);
    // Aca tenemos el url de la imagen en uploadedFile.url, hay que guardar
    const image = uploadedFile.url;

    await currentRestaurant.update({ image });
  }

  const { id } = currentRestaurant;
  await ctx.redirect(ctx.router.url('restaurants.show', { id }));
});


module.exports = router;
