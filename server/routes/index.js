import Users from '../controllers/user';
import Tasks from '../controllers/task';

var express = require('express');
var router = express.Router();
  
export default (app) => {
app.get('/api', (req, res) => res.status(200).send({
        message: 'Welcome to the bookStore API!',}));
app.post('/api/users', Users.signUp); // API route for user to signup
app.post('/api/users/:userId/tasks', Tasks.create); // API route for user to create a task

app.get('/api/tasks', Tasks.list); // API route for user to get all tasks in the database

app.put('/api/tasks/:taskId', Tasks.modify); // API route for user to edit a task
app.delete('/api/tasks/:taskId', Tasks.delete); // API route for user to delete a boo


}
