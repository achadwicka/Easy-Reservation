module.exports = (sequelize, DataTypes) => {
  const userVote = sequelize.define('userVote', {
    userId: DataTypes.INTEGER,
    restaurantId: DataTypes.INTEGER,
    scoreData: DataTypes.INTEGER,
  }, {});

  userVote.associate = function associate() {
    // associations can be defined here. This method receives a models parameter.
  };

  return userVote;
};
