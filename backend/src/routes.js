import { Router } from 'express';
import authMiddleware from './app/middlewares/auth';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';

const routes = new Router();

// Logar
routes.post('/session', SessionController.store);
// Cria um usuário
routes.post('/users', UserController.store);

// Aplicando a middleare de autenticação
routes.use(authMiddleware);
// Atualiza informações do usuário
routes.put('/users', UserController.update);

export default routes;
