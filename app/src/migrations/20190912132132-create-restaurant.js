module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('restaurants', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING,
    },
    address: {
      type: Sequelize.STRING,
    },
    score: {
      type: Sequelize.FLOAT,
      defaultValue: 0,
    },
    votes: {
      type: Sequelize.FLOAT,
      defaultValue: 0,
    },
    open_hours: {
      type: Sequelize.STRING,
    },
    phone: {
      type: Sequelize.STRING,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: new Date(),
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: new Date(),
    },
  }),

  down: (queryInterface) => queryInterface.dropTable('restaurants'),
};
