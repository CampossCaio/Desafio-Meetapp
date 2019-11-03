import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import User from '../models/User';
import authConfig from '../../config/auth';

class SessiomController {
  async store(req, res) {
    // validando dados de entrada
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // Pegando o email e senha do usuário no corpo da requisição
    const { email, password } = req.body;

    // Busca o usuário pelo email
    const user = await User.findOne({ where: { email } });

    // Verificadno  se o usuário existe
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Verifica se a senha passada no corpo da requisição é a mesma salva no banco
    if (!await user.checkPassword(password)) {
      return res.status(401).json({ error: 'User does not match' });
    }

    const { id, name } = user;
    // Retorna algumas informações do usuário junto ao token
    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}
export default new SessiomController();
