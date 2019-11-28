import { Model, Sequelize } from 'sequelize';

class File extends Model {
  static init(sequelize) {
    super.init({
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      path: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      url: {
        type: Sequelize.VIRTUAL,
        get() {
          return `http://localhost:3000/files/${this.path}`;
        },
      },
    },
    {
      sequelize,
    });
    return this;
  }
}

export default File;
