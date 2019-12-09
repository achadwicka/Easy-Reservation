
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.changeColumn(
    'users',
    'birthday',
    {
      type: Sequelize.DATEONLY,
    },
  ),
  /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */


  down: (queryInterface) => queryInterface.removeColumn(
    'users',
    'birthday',
  ),
};
