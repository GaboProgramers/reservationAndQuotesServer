const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const hpp = require('hpp');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const compression = require("compression")

const { db } = require('../../database/db');
const { authRouter } = require('../../routes/auth/auth.routes');
const { usersRouter } = require('../../routes/user.routes');
const globalErrorHandler = require('../../controllers/error/error.controller');
const initModel = require('../init.model');
const { localRouter } = require('../../routes/local.routes');
const AppError = require('../../utils/appError');

class Server {
  constructor() {
    this.app = express();

    this.port = process.env.PORT || 3000;

    this.limiter = rateLimit({
      max: 100,
      windowMs: 60 * 60 * 1000,
      message: 'Too many request from this IP, Place try again in an hour!',
    });

    this.paths = {
      auth: '/api/v1/auth',
      user: '/api/v1/users',
      local: '/api/v1/locals',
    };

    this.database();

    this.middlewares();

    this.routes();
  }

  middlewares() {
    this.app.use(express.static('/public'))

    this.app.use(helmet());

    this.app.use(xss());

    this.app.use(hpp());

    this.app.use(compression())

    if (process.env.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    }

    // ! nuevo para copiar
    this.app.use('/api/v1', this.limiter);

    this.app.use(cors());

    this.app.use(express.json());

    this.app.use(express.urlencoded({extended: false}))
  }

  routes() {
    // Ruta de validacion de token
    this.app.use(this.paths.auth, authRouter);

    this.app.use(this.paths.user, usersRouter);

    this.app.use(this.paths.local, localRouter);

    this.app.all('*', (req, res, next) => {
      return next(
        new AppError(`can't find ${req.originalUrl} on this server`, 404)
      );
    });

    this.app.use(globalErrorHandler);
  }

  database() {
    db.authenticate()
      .then(() => console.log('Database authenticated'))
      .catch(error => console.log(error));

    // Relations
    initModel();

    db.sync()
      .then(() => console.log('Database synced'))
      .catch(error => console.log(error));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log('Server is running on port', this.port);
    });
  }
}

module.exports = Server;
