// eslint-disable-next-line no-unused-vars
const faker = require('faker');

module.exports = {
  up: (queryInterface) => {
    const associationData = [];

    for (let i = 1; i < 36; i += 1) {
      associationData.push({
        dishId: i,
        reservationId: (i % 16) + 1,
        amount: faker.random.number({ min: 1, max: 4 }),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return queryInterface.bulkInsert('reservationdishes', associationData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('reservationdishes', null, {}),
};
