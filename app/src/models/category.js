
module.exports = (sequelize, DataTypes) => {
  const category = sequelize.define('category', {
    name: DataTypes.STRING,
  }, {});
  category.associate = () => {
    // associations can be defined here
  };
  return category;
};
