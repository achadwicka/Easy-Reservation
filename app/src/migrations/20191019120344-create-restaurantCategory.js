module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('restaurantCategories', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },

    restaurantId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    categoryId: {
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

  down: (queryInterface) => queryInterface.dropTable('restaurantCategories'),
};
