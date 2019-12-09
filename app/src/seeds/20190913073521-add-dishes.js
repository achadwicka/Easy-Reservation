const faker = require('faker');

module.exports = {
  up: (queryInterface) => {
    
    const dishesOptions = [
      ['Cheese Burger', 'Delicious 250 gr. cheese burger with fries'],
      ['Hot Dog', 'The biggest hot dog you will ever eat'],
      ['Orange Juice', 'Natural Juice'],
      ['Steak', '200 gr steak'],
      ['Chicken Nuggets', 'Crunchy Chicken Nuggets with fries'],
      ['Fish and Chips', 'Just what you need'],
      ['Coca-Cola', 'You can have it Diet or Zero'],
      ['Sprite', 'You can have it Diet or Zero'],
      ['Fanta', 'You can have it Diet or Zero'], 
      ['Sushi', 'With shrimps and Avocado'],
      ['Pizza', 'Salami Pizza'], 
      ['Gohan', 'With shrimps and Avocado'],
      ['BBQ Chicken Wings', 'Really Spicy!'],
      ['Apple Pie', 'Home Traditional Recipe'],
      ['Tacos', 'Really Spicy!'], 
      ['Salad', 'Lettuce, tomatoes and onion.']
    ]
    const dishesData = [];

    for (let i = 1; i < 17; i += 1) {
      for (let j = 0; j < 16; j++) {
        dishesData.push({
          restaurantId: i,
          name: dishesOptions[j][0],
          price: parseFloat((Math.random() * 20000 + 5000).toFixed(0)),
          description: dishesOptions[j][1],
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    return queryInterface.bulkInsert('dishes', dishesData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('dishes', null, {}),
};
