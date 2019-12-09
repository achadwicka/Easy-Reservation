module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.changeColumn(
    'reviews',
    'comment',
    {
      type: Sequelize.TEXT,
      allowNull: false,
    },
  ),


  down: (queryInterface, Sequelize) => queryInterface.changeColumn(
    'reviews',
    'comment',
    {
      type: Sequelize.STRING,
    },
  ),
};
