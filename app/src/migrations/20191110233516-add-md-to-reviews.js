module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'reviews',
    'markDown',
    {
      allowNull: false,
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  ),

  down: (queryInterface) => queryInterface.removeColumn('reviews', 'markDown'),
};
