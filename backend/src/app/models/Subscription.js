import { Model, Sequelize } from 'sequelize';

class Subscription extends Model {
  static init(sequelize) {
    super.init(
      { user_id: Sequelize.INTEGER },
      {
        sequelize,
      },
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { ForeignKey: 'user_id', as: 'user' });
    this.belongsTo(models.Meetup, { foreignKey: 'meetup_id', as: 'meetup' });
  }
}

export default Subscription;
