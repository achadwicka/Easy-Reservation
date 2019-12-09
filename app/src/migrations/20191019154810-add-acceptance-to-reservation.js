
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'reservations',
    'acceptance',
    {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
  ),

  down: (queryInterface) => queryInterface.removeColumn(
    'reservations',
    'acceptance',
  ),
};
