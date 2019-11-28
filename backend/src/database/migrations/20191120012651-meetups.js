/* eslint-disable arrow-body-style */
/* eslint-disable indent */

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('meetups', {
         id: {
           type: Sequelize.INTEGER,
           autoIncrement: true,
           allowNull: false,
           primaryKey: true,
         },
         file_id: {
           type: Sequelize.INTEGER,
           references: { model: 'files', key: 'id' },
           onUpdate: 'CASCADE',
           onDelete: 'SET NULL',
           allowNull: true,
         },
         user_id: {
          type: Sequelize.INTEGER,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          allowNull: true,
        },

         title: {
          type: Sequelize.STRING,
          allowNull: false,
         },
         date: {
           type: Sequelize.DATE,
           allowNull: false,
         },
         description: {
           type: Sequelize.STRING,
           allowNull: false,
         },
         location: {
         type: Sequelize.STRING,
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

  down: (queryInterface) => queryInterface.dropTable('meetups'),
};
