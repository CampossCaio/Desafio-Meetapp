/* eslint-disable arrow-body-style */
/* eslint-disable indent */


module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('subscriptions', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        meetup_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
       });
  },

  down: (queryInterface) => queryInterface.dropTable('subscriptions'),
};
