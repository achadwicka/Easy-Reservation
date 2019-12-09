module.exports = (sequelize, DataTypes) => {
  const review = sequelize.define('review', {
    // score: DataTypes.FLOAT,
    comment: DataTypes.TEXT,
    userName: DataTypes.STRING,
    markDown: DataTypes.BOOLEAN,
  }, {});

  review.associate = (models) => {
    review.belongsTo(models.user);
    review.belongsTo(models.restaurant);
  };

  return review;
};
