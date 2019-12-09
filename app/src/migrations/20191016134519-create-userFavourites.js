module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('favouriteRestaurants', {
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

    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  })
    .then(() => queryInterface.createTable('favouriteDishes', {
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
      dishId: {
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
    })),

  down: (queryInterface) => queryInterface.dropTable('favouriteRestaurants')
    .then(() => queryInterface.dropTable('favouriteDishes')),
};
