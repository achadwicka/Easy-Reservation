module.exports = {

  // NOTA:
  // Es importante que los "up" esten en el mismo
  // orden que los "down"

  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    // restaurant hasMany reviews
    // is the same that "review belongsTo a restaurant" [IMPLEMENTAR SOLO UNA]
    'reviews',
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
  )
    .then(() => queryInterface.addColumn(
      // review belongsTo user
      'reviews',
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
    ))
    .then(() => queryInterface.addColumn(
      // reservation belongsTo user
      'reservations',
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
    ))
    .then(() => queryInterface.addColumn(
      // reservation belongsTo restaurant
      'reservations',
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
    ))
    .then(() => queryInterface.addColumn(
      // dish belongs to restaurant
      'dishes',
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
    ))
    .then(() => queryInterface.addColumn(
      // table belongs to restaurant
      'tables',
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
    )),


  down: (queryInterface) => queryInterface.removeColumn(
    // remove column restaurantId from reviews
    'reviews',
    'restaurantId',
  )
    .then(() => queryInterface.removeColumn(
      // remove column userId from reviews
      'reviews',
      'userId',
    ))
    .then(() => queryInterface.removeColumn(
      // remove column userId from reservations
      'reservations',
      'userId',
    ))
    .then(() => queryInterface.removeColumn(
      // remove column restaurantId from reservations
      'reservations',
      'restaurantId',
    ))
    .then(() => queryInterface.removeColumn(
      // remove column restaurantId from dishes
      'dishes',
      'restaurantId',
    ))
    .then(() => queryInterface.removeColumn(
      // remove column restaurantId from tables
      'tables',
      'restaurantId',
    )),
};
