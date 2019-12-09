module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('userVotes', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },

    userId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    restaurantId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    scoreData: {
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

  down: (queryInterface) => queryInterface.dropTable('userVotes'),
};
