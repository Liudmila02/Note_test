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

var express = require('express');
var router = express.Router();
  
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

