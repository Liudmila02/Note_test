import express from 'express'

import logger from 'morgan';
import bodyParser from 'body-parser';
import routes from './server/routes';
import redis from "./server/redis";
import passport from './server/passport';
import connectRedis from 'connect-redis';
import cookieParser from 'cookie-parser';
import session from 'express-session';

import cors from 'cors';

// var flash = require('express-flash');
const app = express()
// var passportLinkedIn = require('./server/auth/linkedIn');
app.use(
  cors({
    origin(origin, cb) {
      cb(null, true);
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const sessionMaxAge = 60000 * 60 * 24 * 7;

const sessionConfig = {
    store: new (connectRedis(session))({ client: redis }),
    name: 'sid',
    resave: true,
    saveUninitialized: true,
    secret: "adasdaasdasd",
    unset: 'destroy',
    cookie: {
      httpOnly: true,
      secure: 'auto',
      maxAge: sessionMaxAge,
      domain: "localhost",
    },
  };
app.use(session(sessionConfig));
//
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));
//

app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

routes(app);

app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to the .',
}));

// app.use(flash());

export default app;
module.exports = app;
