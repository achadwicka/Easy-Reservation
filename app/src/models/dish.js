module.exports = (sequelize, DataTypes) => {
  const dish = sequelize.define('dish', {
    name: DataTypes.STRING,
    price: DataTypes.FLOAT,
    description: DataTypes.STRING,
  }, {});
  dish.associate = (models) => {
    // associations can be defined here
    dish.belongsToMany(models.reservation, { through: 'reservationdishes' });
    dish.belongsTo(models.restaurant);
  };
  return dish;
};
