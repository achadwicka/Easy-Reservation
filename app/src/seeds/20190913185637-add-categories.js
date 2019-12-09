
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

    const categoriesData = [];
    const speciality = ['Comida Tai', 'Bar', 'Pizza', 'Comida Rapida', 'Hamburguesas', 'Sushi', 'Comida Casera'];

    for (let i = 0; i < 7; i += 1) {
      categoriesData.push({
        name: speciality[i],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return queryInterface.bulkInsert('categories', categoriesData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('categories', null, {}),
};
