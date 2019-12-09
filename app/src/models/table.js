module.exports = (sequelize, DataTypes) => {
  const table = sequelize.define('table', {
    capacity: DataTypes.INTEGER,
  }, {});

  table.associate = (models) => {
    // associations can be defined here
    table.belongsTo(models.restaurant);
    table.belongsToMany(models.reservation, { through: 'reservationtables' });
  };
  return table;
};
