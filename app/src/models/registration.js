
const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const registration = sequelize.define('registration', {
    closure: DataTypes.DATE,
  }, {});

  // eslint-disable-next-line no-return-assign, no-shadow, no-param-reassign, no-unused-vars
  registration.beforeCreate((registration, _) => registration.id = uuid());

  registration.associate = (models) => {
    registration.belongsTo(models.user);
    registration.belongsTo(models.restaurant);
  };
  return registration;
};
