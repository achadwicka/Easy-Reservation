
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.changeColumn(
    'userVotes',
    'scoreData',
    {
      type: Sequelize.FLOAT,
    },
  ),


  down: (queryInterface) => queryInterface.removeColumn(
    'userVotes',
    'scoreData',
  ),
};
