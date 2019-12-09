
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    // user hasOne registration
    // is the same that "registration belongsTo a user" [IMPLEMENTAR SOLO UNA]
    'registrations',
    'userId',
    {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
  ),

  down: (queryInterface) => queryInterface.removeColumn(
    // remove column userId from registrations
    'registrations',
    'userId',
  ),
};
