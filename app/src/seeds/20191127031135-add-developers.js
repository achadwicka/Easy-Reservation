const faker = require('faker');

const TOKEN_LENGTH = 45;

function maketoken(length) {
  let result = '';
  const characters = '-_.~ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

module.exports = {
  up: (queryInterface) => {
    const data = [{
      userId: 3,
      name: 'Test App',
      description: 'First test',
      access_token: maketoken(TOKEN_LENGTH),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      userId: 3,
      name: 'Test App 2',
      description: 'Second test',
      access_token: maketoken(TOKEN_LENGTH),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      userId: 3,
      name: 'Test App 3',
      description: 'Third Test',
      access_token: maketoken(TOKEN_LENGTH),
      createdAt: new Date(),
      updatedAt: new Date(),
    }];

    return queryInterface.bulkInsert('apps', data);
  },

  down: (queryInterface) => queryInterface.bulkDelete('apps', null, {}),
};
