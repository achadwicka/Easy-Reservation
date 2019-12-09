module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('reservationdishes', {
    reservationId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    dishId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    amount: {
      type: Sequelize.INTEGER,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),

  down: (queryInterface) => queryInterface.dropTable('reservationdishes'),
};
