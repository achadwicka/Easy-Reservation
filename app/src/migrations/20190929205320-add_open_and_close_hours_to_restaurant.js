module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */

    queryInterface.addColumn(
      'restaurants',
      'open_at',
      Sequelize.TIME,
    );
    queryInterface.addColumn(
      'restaurants',
      'close_at',
      Sequelize.TIME,
    );
    return queryInterface.removeColumn(
      'restaurants',
      'open_hours',
    );
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    queryInterface.removeColumn(
      'restaurants',
      'open_at',
    );
    queryInterface.removeColumn(
      'restaurants',
      'close_at',
    );
    return queryInterface.addColumn(
      'restaurants',
      'open_hours',
      Sequelize.STRING,
    );
  },
};
