module.exports = (sequelize, DataTypes) => {
  const favouriteDishes = sequelize.define('favouriteDishes', {
    userId: DataTypes.INTEGER,
    dishId: DataTypes.INTEGER,
  }, {});

  favouriteDishes.associate = function associate() {
    // associations can be defined here. This method receives a models parameter.
  };

  return favouriteDishes;
};
