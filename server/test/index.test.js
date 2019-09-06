const supertest = require('supertest');
const should = require('should');
const express = require('express');

const app = require('../../app')


describe('not correct user',() => {
  it ('should not create user', async ()  => {
   await supertest(app)
    .post('/api/users')    
    .send({
    email: null,
    password: 'password',
    })
  .then(response => {
    expect(response.statusCode).toBe(500);
    expect( JSON.stringify(response.body)).toBe(JSON.stringify({
      email: "missing email",
      first_name: "this field cann't be blank",
      last_name: "this field cann't be blank",
      user_name: "this field cann't be blank",
    }));
  });
  })
})

describe('correct user',() => {
  it ('should create user', async ()  => {
   await supertest(app)
    .post('/api/users')    
    .send({
      first_name: "Lyuda",
      last_name: "Medyuk",
      email: "lyuda@gmail.com",
      password: "qwerty123",
    })
    .then(response => {
      expect(response.statusCode).toBe(200);
      expect( JSON.stringify(response.body)).toBe(JSON.stringify)
    })
  })
})

// describe('correct task', () => {
//   it('should create a new task', async () => {
//     await supertest(app)
//       .post('/api/tasks')
//       .send({
//         userId: 1,
//         title: 'task number one',
//         description: 'short description',
//         priority: 1,
//         due_date: '19/09/2019',
//         completed: false,
//       }).then(res =>{
//         expect(res.statusCode).toEqual(201)
//         expect(res.body).toHaveProperty('task')
//       })
//   })
// })



//describe('GET /api', () => {
  //it('', (done) => {
    
//describe('POST /api/login', () => {
  //it('create new user', (done) => {
   
      
//describe('POST /users/:userId/tasks', () => {
  //it('should create a task', (done) => {
   
//describe('GET /tasks', () => {
  //it('should list a task', (done) => {
      
//describe('PUT /tasks/:id', () => {
  //it('should modify a task', (done) => {

//describe('DELETE /tasks/:id', () => {
//it('should delete a task', (done) => {
