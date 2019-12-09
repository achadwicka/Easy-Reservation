
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'restaurants',
    'commune',
    {
      allowNull: false,
      type: Sequelize.STRING,
    },
  )
    .then(() => queryInterface.addColumn(
      'restaurants',
      'lat',
      {
        allowNull: false,
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
    ))
    .then(() => queryInterface.addColumn(
      'restaurants',
      'lng',
      {
        allowNull: false,
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
    )),

  down: (queryInterface) => queryInterface.removeColumn(
    'restaurants',
    'commune',
  )
    .then(() => queryInterface.removeColumn(
      'restaurants',
      'lat',
    ))
    .then(() => queryInterface.removeColumn(
      'restaurants',
      'lng',
    )),
};
