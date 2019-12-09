module.exports = (sequelize, DataTypes) => {
  const app = sequelize.define('app', {
    userId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    access_token: DataTypes.STRING,
  }, {});

  app.associate = () => {
    // associations can be defined here
  };
  return app;
};
