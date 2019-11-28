import { Router } from 'express';
import multer from 'multer';
import authMiddleware from './app/middlewares/auth';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import FileController from './app/controllers/FileController';
import MeetupController from './app/controllers/MeetupController';
import multerConfig from './config/multer';
import SubscriptionController from './app/controllers/SubscriptionController';


const routes = new Router();

const upload = multer(multerConfig);

// Logar
routes.post('/session', SessionController.store);
// Cria um usuário
routes.post('/users', UserController.store);
// Aplicando a middleare de autenticação
routes.use(authMiddleware);
// Atualiza informações do usuário
routes.put('/users', UserController.update);
// Responsável por upload de arquivos
routes.post('/files', upload.single('file'), FileController.store);
// Create meetup
routes.post('/meetups', MeetupController.store);
// Update meetups
routes.put('/meetups/:id', MeetupController.update);
// List meetups
routes.get('/meetups', MeetupController.index);
// Delete meetups
routes.delete('/meetups/:id', MeetupController.delete);
// create a subscription
routes.post('/subscription', SubscriptionController.store);
// List subscriptions
routes.get('/subscription', SubscriptionController.index);


export default routes;
