import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init({
      name: Sequelize.STRING,
      email: Sequelize.STRING,
      // Campos virtuais só existem no código, jamais são salvos na tabela.
      password: Sequelize.VIRTUAL,
      password_hash: Sequelize.STRING,
    },
    {
      sequelize,
    });
    // Exucata uma ação antes que o usuário seja salvo no banco.
    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        // eslint-disable-next-line no-param-reassign
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });
    return this;
  }

  // Compara se a senha passada é igual a que está salva no banco.
  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
