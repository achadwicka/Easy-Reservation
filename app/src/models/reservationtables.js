module.exports = (sequelize, DataTypes) => {
  const reservationtables = sequelize.define('reservationtables', {
    reservationId: DataTypes.INTEGER,
    tableId: DataTypes.INTEGER,
  }, {});

  reservationtables.associate = function associate() {
    // associations can be defined here. This method receives a models parameter.
  };

  return reservationtables;
};
