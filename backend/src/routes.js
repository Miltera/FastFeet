import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import CourierController from './app/controllers/CourierController';
import PackageController from './app/controllers/PackageController';
import FileController from './app/controllers/FileController';
import DeliveryControler from './app/controllers/DeliveryController';
import DeliveryStartController from './app/controllers/DeliveryStartController';
import DeliveryFinishController from './app/controllers/DeliveryFinishController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/session', SessionController.store);

routes.get('/deliveries', DeliveryControler.index);
routes.get('/deliveryman/:id/deliveries', DeliveryControler.show);

routes.put('/deliveries/:id/start', DeliveryStartController.update);
routes.put('/deliveries/:id/finish', DeliveryFinishController.update);

routes.use(authMiddleware);

routes.get('/recipients', RecipientController.index);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

routes.get('/couriers', CourierController.index);
routes.post('/couriers', CourierController.store);
routes.put('/couriers/:id', CourierController.update);
routes.delete('/couriers/:id', CourierController.delete);

routes.get('/packages', PackageController.index);
routes.post('/packages', PackageController.store);
routes.put('/packages/:id', PackageController.update);
routes.delete('/packages/:id', PackageController.delete);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
