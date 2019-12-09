module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'reviews',
    'userName',
    {
      allowNull: false,
      type: Sequelize.STRING,
    },
  ),

  down: (queryInterface) => queryInterface.removeColumn('reviews', 'userName'),
};
