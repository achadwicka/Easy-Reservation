const faker = require('faker');

module.exports = {

  up: (queryInterface) => {

    const reservationsData = [];
    const optionComments = [
      'I want the table outside',
      'I want the table on the smoking area',
      'I want the table on the non smoking area',
      'I want to be close to the bathroom'
    ]

    for (let i = 1; i < 16; i += 1) {
      reservationsData.push({
        restaurantId: i,
        userId: i,
        day: new Date(),
        hour: '13:30',
        peopleCount: faker.random.number({ min: 3, max: 12 }),
        comments: optionComments[i % 4],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return queryInterface.bulkInsert('reservations', reservationsData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('reservations', null, {}),
};
