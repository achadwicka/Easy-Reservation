
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    // user hasOne registration
    // is the same that "registration belongsTo a user" [IMPLEMENTAR SOLO UNA]
    'registrations',
    'restaurantId',
    {
      type: Sequelize.INTEGER,
      references: {
        model: 'restaurants',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
  ),

  down: (queryInterface) => queryInterface.removeColumn(
    // remove column userId from registrations
    'registrations',
    'restaurantId',
  ),
};
