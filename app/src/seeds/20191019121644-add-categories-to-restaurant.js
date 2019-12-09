module.exports = {
  up: (queryInterface) => {
    const associationData = [];

    for (let i = 0; i < 50; i += 1) {
      associationData.push({
        restaurantId: (i % 15) + 1,
        categoryId: (i % 7) + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return queryInterface.bulkInsert('restaurantCategories', associationData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('restaurantCategories', null, {}),
};
