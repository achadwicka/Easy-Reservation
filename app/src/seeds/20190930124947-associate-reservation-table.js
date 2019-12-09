// const faker = require('faker');

module.exports = {
  up: (queryInterface) => {
    const associationData = [];

    for (let i = 0; i < 50; i += 1) {
      associationData.push({
        tableId: i + 1,
        reservationId: (i % 15) + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return queryInterface.bulkInsert('reservationtables', associationData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('reservationtables', null, {}),
};
