const bcrypt = require('bcrypt');

const PASSWORD_SALT = 10;

async function buildPasswordHash(instance) {
  if (instance.changed('password')) {
    const hash = await bcrypt.hash(instance.password, PASSWORD_SALT);
    instance.set('password', hash);
  }
}

module.exports = (sequelize, DataTypes) => {
  const restaurant = sequelize.define('restaurant', {
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    score: DataTypes.FLOAT,
    votes: DataTypes.FLOAT,
    open_at: DataTypes.TIME,
    close_at: DataTypes.TIME,
    phone: DataTypes.STRING,
    nickname: DataTypes.STRING,
    password: DataTypes.STRING,
    commune: DataTypes.STRING,
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT,
    image: DataTypes.STRING,
  }, {});

  restaurant.beforeUpdate(buildPasswordHash);
  restaurant.beforeCreate(buildPasswordHash);

  restaurant.prototype.checkPassword = function checkPassword(password) {
    return bcrypt.compare(password, this.password);
  };

  restaurant.associate = (models) => {
    restaurant.hasMany(models.review);
    // eslint-disable-next-line object-curly-newline
    restaurant.hasMany(models.reservation, { as: 'Reservations', foreignKey: 'restaurantId', onDelete: 'CASCADE', hooks: true });
    // eslint-disable-next-line object-curly-newline
    restaurant.hasMany(models.dish, { as: 'Dishes', foreignKey: 'restaurantId', onDelete: 'CASCADE', hooks: true });
    // eslint-disable-next-line object-curly-newline
    restaurant.hasOne(models.registration, { as: 'Registrations', foreignKey: 'restaurantId', onDelete: 'CASCADE', hooks: true });
    // eslint-disable-next-line object-curly-newline
    restaurant.hasMany(models.review, { as: 'Reviews', foreignKey: 'restaurantId', onDelete: 'CASCADE', hooks: true });
  };

  return restaurant;
};
