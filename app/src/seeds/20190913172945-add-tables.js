const faker = require('faker');

module.exports = {
  up: (queryInterface) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

    const tablesData = [];

    for (let i = 0; i < 50; i += 1) {
      tablesData.push({
        capacity: parseFloat((Math.random() * 4 + 2).toFixed(0)),
        restaurantId: faker.random.number({ min: 1, max: 15 }),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return queryInterface.bulkInsert('tables', tablesData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('tables', null, {}),
};
