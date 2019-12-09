
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'restaurants',
    'nickname',
    {
      allowNull: false,
      unique: true,
      type: Sequelize.STRING,
    },
  )
    .then(() => queryInterface.addColumn(
      'restaurants',
      'password',
      {
        allowNull: false,
        type: Sequelize.STRING,
      },
    )),


  down: (queryInterface) => queryInterface.removeColumn(
    'restaurants',
    'nickname',
  )
    .then(() => queryInterface.removeColumn(
      'restaurants',
      'password',
    )),
};
