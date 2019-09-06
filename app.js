import express from 'express'

import logger from 'morgan';
import bodyParser from 'body-parser';
import routes from './server/routes';

import passport from './server/passport';
import cookieParser from 'cookie-parser';
import session from 'express-session';

import cors from 'cors';

const app = express()


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
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))
app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

routes(app);

app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to the .',
}));


export default app;
module.exports = app;