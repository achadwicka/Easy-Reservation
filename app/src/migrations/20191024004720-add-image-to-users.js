module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'users',
    'image',
    {
      allowNull: false,
      defaultValue: 'https://res.cloudinary.com/docc8wglk/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1571875986/empty-profile.jpg',
      type: Sequelize.STRING,
    },
  ),

  down: (queryInterface) => queryInterface.removeColumn('users', 'image'),
};
