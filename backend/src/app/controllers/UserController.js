import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  // Cria usuário
  async store(req, res) {
    // Validando os dados de entrada
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    // Verificando se as infomçẽos passadas no body são validas
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // Buscando o usuário na base de dados
    const userExists = await User.findOne({ where: { email: req.body.email } });

    // Verificando se o usuário existe na base de dados
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Crinado o usuário
    const { id, name, email } = await User.create(req.body);

    // Retornando os dados do usuário
    return res.json({
      user: {
        id,
        name,
        email,
      },
    });
  }

  // Atualiza informaçẽos do usuário
  async update(req, res) {
    // Validando os dados de entrada
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      odlPassword: Yup.string().min(6),
      // Torna o campo password obrigatório caso o campo oldPassword tenha sido preenchido
      password: Yup.string().min(6)
        .when('oldPassword', (odlPassword, field) => (odlPassword ? field.required() : field)),
      // Torna o campo confirmPassword obrigatório caso o campo password tenha sido preenchido
      confirmPassword: Yup.string().when('password', (password, field) => (password ? field.required().oneOf([Yup.ref('password')]) : field)),
    });


    // Verificadndo se os dados passados no body são validos
    if (!await schema.isValid(req.body)) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, odlPassword } = req.body;

    const user = await User.findByPk(req.userId);

    // Compara se o email passado é diferente do email salvo no banco
    if (email !== user.email) {
      const userExist = await User.findOne({ where: { email } });

      if (userExist) {
        return res.status(401).json({ error: 'User already existis' });
      }
    }

    // Compara se o usuário passou uma senha antiga e caso tenha passado,
    // verifica se a senha é diferente da senha salva no banco
    if (odlPassword && !(await user.checkPassword(odlPassword))) {
      res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }
}
export default new UserController();
