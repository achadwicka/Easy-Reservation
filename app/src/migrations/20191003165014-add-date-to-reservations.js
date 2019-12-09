
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'reservations',
    'day',
    {
      allowNull: false,
      type: Sequelize.DATE,
    },
  )
    .then(() => queryInterface.addColumn(
      'reservations',
      'hour',
      {
        allowNull: false,
        type: Sequelize.TIME,
      },
    ))
    .then(() => queryInterface.addColumn(
      'reservations',
      'peopleCount',
      {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
    ))
    .then(() => queryInterface.addColumn(
      'reservations',
      'comments',
      {
        allowNull: false,
        type: Sequelize.STRING,
      },
    )),


  down: (queryInterface) => queryInterface.removeColumn(
    'reservations',
    'day',
  )
    .then(() => queryInterface.removeColumn(
      'reservations',
      'hour',
    ))
    .then(() => queryInterface.removeColumn(
      'reservations',
      'peopleCount',
    ))
    .then(() => queryInterface.removeColumn(
      'reservations',
      'comments',
    )),
};
