import Sequelize from 'sequelize';

import User from '../app/models/User';
import Files from '../app/models/File';
import Meetups from '../app/models/Meetup';

import databaseConfig from '../config/database';
import Subscription from '../app/models/Subscription';

// Crinado array de models
const models = [User, Files, Meetups, Subscription];

class Database {
  constructor() {
    this.init();
  }

  // Método responsável por criar a conexão com o banco e passar a conexão para o método init
  // contido em cada model
  init() {
    // Atribuindo as configurações de conexão a variável connection
    this.connection = new Sequelize(databaseConfig);

    // Passando o connection para o metodo init  dos models
    models.map((model) => model.init(this.connection));
    // Chama o método associate em todos os models que o tiveremc
    models.map((model) => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
