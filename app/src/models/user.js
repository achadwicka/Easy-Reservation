const bcrypt = require('bcrypt');

const PASSWORD_SALT = 10;

async function buildPasswordHash(instance) {
  if (instance.changed('password')) {
    const hash = await bcrypt.hash(instance.password, PASSWORD_SALT);
    instance.set('password', hash);
  }
}

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    birthday: DataTypes.DATEONLY,
    nickname: DataTypes.STRING,
    admin: DataTypes.BOOLEAN,
    image: DataTypes.STRING,
  }, {});

  user.beforeUpdate(buildPasswordHash);
  user.beforeCreate(buildPasswordHash);

  user.prototype.checkPassword = function checkPassword(password) {
    return bcrypt.compare(password, this.password);
  };

  user.associate = function associate(models) {
    // associations can be defined here. This method receives a models parameter.
    // eslint-disable-next-line object-curly-newline
    user.hasMany(models.review, { as: 'Reviews', foreignKey: 'userId', onDelete: 'CASCADE', hooks: true });
    // eslint-disable-next-line object-curly-newline
    user.hasMany(models.reservation, { as: 'Reservations', foreignKey: 'userId', onDelete: 'CASCADE', hooks: true });
    // eslint-disable-next-line object-curly-newline
    user.hasOne(models.registration, { as: 'Registrations', foreignKey: 'userId', onDelete: 'CASCADE', hooks: true });
  };

  return user;
};
