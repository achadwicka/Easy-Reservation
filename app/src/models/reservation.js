
module.exports = (sequelize, DataTypes) => {
  const reservation = sequelize.define('reservation', {
    day: DataTypes.DATE,
    hour: DataTypes.TIME,
    acceptance: DataTypes.INTEGER,
    peopleCount: DataTypes.INTEGER,
    comments: DataTypes.STRING,
  }, {});

  reservation.associate = function associate(models) {
    // eslint-disable-next-line object-curly-newline
    reservation.belongsTo(models.user);
    reservation.belongsTo(models.restaurant);
    reservation.belongsToMany(models.dish, { through: 'reservationdishes' });
    reservation.belongsToMany(models.table, { through: 'reservationtables' });
  };

  return reservation;
};
