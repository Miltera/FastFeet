import 'dotenv/config';

import express from 'express';
import { resolve } from 'path';
import cors from 'cors';
import routes from './routes';
import './database/index';

class App {
  constructor() {
    this.server = express();
    this.cors();
    this.middlewares();
    this.routes();
  }

  cors() {
    this.server.use(cors());
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
