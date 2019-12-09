module.exports = (sequelize, DataTypes) => {
  const restaurantCategory = sequelize.define('restaurantCategory', {
    restaurantId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER,
  }, {});

  restaurantCategory.associate = function associate() {
    // associations can be defined here. This method receives a models parameter.
  };

  return restaurantCategory;
};
