module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('reservationtables', {
    reservationId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    tableId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
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

  down: (queryInterface) => queryInterface.dropTable('reservationtables'),
};
