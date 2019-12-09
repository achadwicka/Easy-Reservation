module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'users',
    'admin',
    {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  ),


  down: (queryInterface) => queryInterface.removeColumn(
    'users',
    'admin',
  ),
};
