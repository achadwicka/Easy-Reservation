const bcrypt = require('bcrypt');
const faker = require('faker');

const PASSWORD_SALT = 10;

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

    const addressOptions = [['Av. Vicuña mackenna 5343', 'San Joaquín', -33.505646, -70.614834],
      ['Escuela Agrícola 1814', 'San Joaquín', -33.491011, -70.614136], ['Av. Salvador Allende 114', 'San Joaquín', -33.496314, -70.622452],
      ['Av. Haydn 4408', 'San Joaquín', -33.498184, -70.622913], ['Av. Marathon 3123', 'Macul', -33.483505, -70.613644],
      ['Castillo Urizar Sur 6865', 'Macul', -33.487190, -70.609784], ['Vicuña Mackenna 4865', 'San Joaquín', -33.499462, -70.616125],
      ['Benito Rebolledo 1893', 'Macul', -33.501240, -70.612825], ['Av Macul 4470', 'Macul', -33.494878, -70.599159],
      ['Carlos Dittborn 0890', 'Ñuñoa', -33.465814, -70.618150], ['República de Israel 1600', 'Ñuñoa', -33.458651, -70.616290],
      ['Pedro Torres 378', 'Ñuñoa', -33.451315, -70.589211], ['Av. Condell 566', 'Providencia', -33.439943, -70.627050],
      ['Ángel Cruchaga 2135', 'Macul', -33.503495, -70.610104], ['Av. Salvador Allende 143', 'San Joaquín', -33.496035, -70.624475]];

    const restaurantsData = [{
      name: 'Tip y Tap',
      address: 'Avda Grecia 3552',
      commune: 'Ñuñoa',
      lat: -33.464540,
      lng: -70.593955,
      score: 0,
      phone: 56999283812,
      open_at: '8:00',
      close_at: '23:00',
      nickname: 'tipytap',
      password: 'tipytap123',
      createdAt: new Date(),
      updatedAt: new Date(),
    }];


    for (let i = 1; i < 16; i += 1) {
      const nameSample = faker.company.companyName();
      restaurantsData.push({
        name: nameSample,
        address: addressOptions[i - 1][0],
        commune: addressOptions[i - 1][1],
        lat: addressOptions[i - 1][2],
        lng: addressOptions[i - 1][3],
        score: 0,
        phone: faker.phone.phoneNumber(),
        open_at: '8:00',
        close_at: '23:00',
        nickname: nameSample.split(' ')[0],
        password: bcrypt.hashSync(`${nameSample.split(' ')[0]}123`, PASSWORD_SALT),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return queryInterface.bulkInsert('restaurants', restaurantsData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('restaurants', null, {}),
};
