module.exports = (sequelize, DataTypes) => {
  const reservationdishes = sequelize.define('reservationdishes', {
    reservationId: DataTypes.INTEGER,
    dishId: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
  }, {});

  reservationdishes.associate = function associate() {
    // associations can be defined here. This method receives a models parameter.
  };

  return reservationdishes;
};
