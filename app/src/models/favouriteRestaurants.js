module.exports = (sequelize, DataTypes) => {
  const favouriteRestaurants = sequelize.define('favouriteRestaurants', {
    userId: DataTypes.INTEGER,
    restaurantId: DataTypes.INTEGER,
  }, {});

  favouriteRestaurants.associate = function associate() {
    // associations can be defined here. This method receives a models parameter.
  };

  return favouriteRestaurants;
};
