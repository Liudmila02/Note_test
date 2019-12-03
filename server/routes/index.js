import Users from '../controllers/user';
import Tasks from '../controllers/task';
import passport from '../passport';
import { validateRegisterForm } from '../validator';
import { validateTasksForm } from '../validator';
import { tsConstructSignatureDeclaration } from '@babel/types';
import redis from "redis";
import client from "../redis";
import { confirmEmail } from '../redis'
import { CustomConsole } from '@jest/console';
import db from '../models/index'
import { confirmEmailPassword } from '../redis'

var express = require('express');
var router = express.Router();
var passportLinkedIn = require('../auth/linkedIn');

  
export default (app) => {
app.get('/api', (req, res) => res.status(200).send({message: 'Welcome to the bookStore API!',}));

app.post('/api/login', (req, res, next)=>{
  passport.authenticate('local', function(err, user, info) {
    if (!user) { return res.status(401).json({
      message: "not found"
    }) }
      req.logIn(user, function(err) {
        if (err) { 
          console.log(err)
          return next(err); }
          console.log(res.headers)
        return res.status(200).json({
          user
        })
      });
  })(req, res, next);
})
//linkedin
app.get('/auth/linkedin',(req, res, next) => {
  passport.authenticate('linkedin')(req, res, next)
 });

 app.get('/auth/linkedin/callback', async (req, res, next) => {
  passport.authenticate('linkedin', (err, user, info) => {
    const message =
      info && info.message
        ? info.message
        : "An error occurred. Please try again later.";
    if (err) {
      return res.status(500).json({ message });
    }
    if (!user) {
      return res.status(401).json({ message });
    }
    return req.login(user, (innerErr) => {
      if (innerErr) {
        console.log(innerErr);
        return res.status(401).json({ message });
      }
      return res.redirect('http://localhost:3000/');
    });
  })(req, res, next);
 });
//github
 app.get('/auth/github',(req, res, next) => {
  passport.authenticate('github')(req, res, next)
 });

 app.get('/auth/github/callback', async (req, res, next) => {
  passport.authenticate('github', (err, user, info) => {
    const message =
      info && info.message
        ? info.message
        : "An error occurred. Please try again later.";
    if (err) {
      return res.status(500).json({ message });
    }
    if (!user) {
      return res.status(401).json({ message });
    }
    return req.login(user, (innerErr) => {
      if (innerErr) {
        console.log(innerErr);
        return res.status(401).json({ message });
      }
      return res.redirect('http://localhost:3000/');
    });
  })(req, res, next);
 });

app.get('/confirm_email', async (req, res, next) => {
  const result = await confirmEmail(req)
  console.log(result)
  if (result)
    res.status(200).json({message: "Welcome to the ."});
  else
    res.status(500).json({message: "link is broken"});
})

app.post('/api/users', async (req, res, next)=>{
  const validationResult = validateRegisterForm(req.body)
  console.log(validationResult)
  if (Object.keys(validationResult).length) return res.status(500).json(validationResult)
  const user = await Users.signUp(req)
  if (!user) { return res.status(401).json({
    message: "bad request"
  }) }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.status(200).json({
      user
      })
    });
});

app.get('/api/users/:userId', isAuthenticated, Users.show);

app.put('/api/users/:userId', isAuthenticated, Users.modify);

//create
app.post('/api/tasks', isAuthenticated, async (req, res, next)=>{
  const validationTasks = validateTasksForm(req.body)
  if (Object.keys(validationTasks).length) return res.status(200).json(validationTasks)
    const task = await Tasks.create(req,res)
  if (!task) { return res.status(401).json({
    message: "bad request"
  }) }
});
//index
app.get('/api/tasks', isAuthenticated, Tasks.list); 

//update
app.put('/api/tasks/:taskId', isAuthenticated, Tasks.modify); 

//destroy
app.delete('/api/tasks/:taskIds', isAuthenticated, Tasks.delete);

//show
app.get('/api/tasks/:taskId', isAuthenticated, Tasks.show); 

app.get('/signout', async (req, res)=> {
  req.session.destroy(function (err) {
    req.user = null;
    return res.status(200).json({message:'user successfully signed out with account'})
  });
});
// forgot password
// app.get('/forgot', function(req, res) {
//   res.render('forgot', {
//     user: req.user
//   });
// });

// app.get('/forgot/reset', async (req, res, next) => {
//   const result = await confirmEmail(req)
//   console.log(result)
//   if (result)
//     res.status(200).json({message: "Welcome to the ."});
//   else
//     res.status(500).json({message: "link is broken"});
// })

//знаходить емейл, порывнюэ i вiдправляэ лист
app.post('/forgot', Users.resetPassword);

// обновляэ пароль
app.put('/forgot/reset/:userId', Users.updatePassword);
}


function isAuthenticated(req, res, next) {
  console.log(req.cookies)
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({
    error: "User not authenticated"
  });
}


