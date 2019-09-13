import Users from '../controllers/user';
import Tasks from '../controllers/task';
import passport from '../passport';
import { validateRegisterForm } from '../validator';
import { validateTasksForm } from '../validator';
import { tsConstructSignatureDeclaration } from '@babel/types';
import redis from "redis";
import client from "../redis";
import { confirmEmail } from '../redis'

var express = require('express');
var router = express.Router();
  
export default (app) => {
app.get('/api', (req, res) => res.status(200).send({
        message: 'Welcome to the bookStore API!',}));

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

router.get('/confirm_email', async (req, res, next) => {
  const result = await confirmEmail(req)
  if (result)
    res.status(200).json({message: "ok"});
  else
    res.status(500).json({message: "link is broken"});
})


app.post('/api/users', async (req, res, next)=>{
  const validationResult = validateRegisterForm(req.body)
  //console.log(validationResult)
  if (Object.keys(validationResult).length) return res.status(500)//.json(validationResult)
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
}); // API route for user to signup
app.post('/api/tasks', async (req, res, next)=>{
  const validationTasks = validateTasksForm(req.body)
  if (Object.keys(validationTasks).length) return res.status(500)//.json(validationTasks)
  const task = await Tasks.create(req,res)
  if (!task) { return res.status(401).json({
    message: "bad request"
  }) }
});
app.get('/api/tasks', Tasks.list); // API route for user to get all tasks in the database
app.put('/api/tasks/:taskId', Tasks.modify); // API route for user to edit a task
app.delete('/api/tasks/:taskId', Tasks.delete); // API route for user to delete a book

app.get('/auth', (req, res) => {
  if (!req.isAuthenticated())
  return res.status(401).json({message: "not authenticated"})
  else return res.status(200).json(req.user)
})
}

