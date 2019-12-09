// paquetes faker y bcrypt para encriptar --> bcrypt.hashSync('1234567', PASSWORD_SAalgo)
const bcrypt = require('bcrypt');
const faker = require('faker');

const PASSWORD_SALT = 10;

// async function newPassword(password) {
// return bcrypt.hashSync(password, PASSWORD_SALT);
// }

module.exports = {
  up: (queryInterface) => {
    const usersData = [{
      email: 'achadwick@uc.cl',
      name: 'Alberto Chadwick',
      password: bcrypt.hashSync('alberto', PASSWORD_SALT),
      birthday: new Date(1996, 12, 13),
      createdAt: new Date(),
      updatedAt: new Date(),
      nickname: 'alberto',
      admin: true,
    },
    {
      email: 'slecaros@uc.cl',
      name: 'Sergio Lecaros',
      password: bcrypt.hashSync('sergio', PASSWORD_SALT),
      birthday: new Date(1997, 8, 21),
      createdAt: new Date(),
      updatedAt: new Date(),
      nickname: 'sergio',
      admin: true,
    },
    {
      email: 'ewaugh2@uc.cl',
      name: 'Enrique Waugh',
      password: bcrypt.hashSync('enrique', PASSWORD_SALT),
      birthday: new Date(1997, 1, 1),
      createdAt: new Date(),
      updatedAt: new Date(),
      nickname: 'enrique',
      admin: true,
    }];
    for (let i = 1; i < 16; i += 1) {
      const emailSample = faker.internet.email();
      const nameSample = faker.name.findName();

      usersData.push({
        email: emailSample,
        name: nameSample,
        password: bcrypt.hashSync(`${nameSample.split(' ')[0]}123`, PASSWORD_SALT),
        birthday: new Date(1997, 1, 1),
        createdAt: new Date(),
        updatedAt: new Date(),
        nickname: emailSample.split('@')[0],
      });
    }
    return queryInterface.bulkInsert('users', usersData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('users', null, {}),
};
