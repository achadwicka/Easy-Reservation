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
    const names = ['Alberto Chadwick', 'Sergio Lecaros', 'Enrique Waugh', 'Pedro Cruz', 'Jorge Aguilar'];
    const commentOptions = [
      'Es el mejor restaurant que he probado!',
      'Me encanto el ambiente del lugar, mucha onda y buena atencion',
      'Pesimo servicio, atencion muy lenta',
      'Muy buena variedad de comida, y todo muy rico',
      'Muy buena relacion de precio con calidad',
      'La ubicacion me gusto',
      'El baño estaba en pesimo estado',
      'El bar muy variado'
    ]

    const reviewsData = [
      {
        restaurantId: 1,
        userId: 1,
        comment: 'Me encanto el restaurant',
        userName: names[0],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        restaurantId: 1,
        userId: 2,
        comment: 'Me llego la comida fría.',
        userName: names[1],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        restaurantId: 1,
        userId: 3,
        comment: 'Encuentro que le falta mejor musica',
        userName: names[2],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    for (let i = 0; i < 100; i += 1) {
      const number = faker.random.number({ min: 1, max: 5 });
      reviewsData.push({
        restaurantId: (i % 15) + 1,
        userId: number,
        userName: names[number - 1],
        comment: commentOptions[i % 8],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return queryInterface.bulkInsert('reviews', reviewsData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('reviews', null, {}),
};
