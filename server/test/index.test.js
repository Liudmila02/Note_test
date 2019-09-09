const supertest = require('supertest');
const should = require('should');
const express = require('express');

const app = require('../../app')
import db from '../models/index';
import {register} from '../local'
// it('Test for the get api',(done) => {
//   requestAnimationFrame(app).get('/api').expect('Welcome to the bookStore API!').end(done);
// })

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
      username: "this field cann't be blank",
    }));
  });
  })
})

describe('correct user',() => {
   it ('should create user', async ()  => {
    await db.User.destroy({ where: {}, force: true });
    await supertest(app)
    .post('/api/users')    
    .send({
      username: 'name',
      first_name: 'Lyuda',
      last_name: 'Medyuk',
      email: 'Lyuda1@gmail.com',
      password: 'qwerty123',
    })
    .then(response => {
      expect(response.statusCode).toBe(200);
      expect(JSON.stringify(response.body)).toBe(JSON.stringify({  user: { email: 'Lyuda1@gmail.com', username: 'name',  first_name: 'Lyuda', last_name: 'Medyuk'}}))
    })
})
})

describe('not correct task',() => {
  it ('should not create task', async ()  => {
   await supertest(app)
    .post('/api/tasks')    
    .send({
    title: null,
    description: null,
    })
  .then(response => {
    expect(response.statusCode).toBe(500);
    expect( JSON.stringify(response.body)).toBe(JSON.stringify({
      title: "this field cann't be blank",
      description: "this field cann't be blank",
      priority: "choose a priority",
      due_date: "choose a due date",
    }));
  });
  })
});

describe('correct task', () => {
  it('should create a new task', async () => {
    await db.Task.destroy({ where: {}, force: true });
    const user = await db.User.findOne({})

    await supertest(app)
      .post('/api/tasks')
      .send({
        userId: user.id,
        title: 'task number one',
        description: 'short description',
        priority: 2,
        due_date: '01/01/2020',
        completed: false,
      }).then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Your task with the title task number one has been created successfully ")
      })
    })
});

// describe('/api/login', () => {
//   beforeEach(async () => {
//     await db.User.destroy({ where: {}, force: true });
//     await db.Task.destroy({ where: {}, force: true });
//   });

//   const testUser = {
//     email: 'test@gmail.com',
//     password: 'password123',
//     first_name: 'Fname',
//     last_name: 'Lname',
//   }

//   describe('Bad params', () => {
//     test("Should respond with error", async () => {
//       await register(testUser)
//       await request(app)
//         .post('/api/login')
//         .set('content-type', 'application/json')
//         .send({
//           email: testUser.email,
//           password: "wrongpassword",
//         })
//         .then(async response => {
//           expect(response.statusCode).toBe(401);
//           expect(response.body.message).toBe("Incorrect email or password");
//         });
//     })
//   })

//   describe('Good params', () => {
//     test("Should respond with profile", async () => {
//       let cookie
//       await register(testUser)
//       await request(app)
//         .post('/api/login')
//         .set('content-type', 'application/json')
//         .send({
//           email: testUser.email,
//           password: testUser.password,
//         })
//         .then(async response => {
//           expect(response.statusCode).toBe(200);
//           expect(response.body.id).toBeTruthy();
//           cookie = response.headers['set-cookie'].pop().split(';')[0];
//         });

//       await request(app)
//         .get('/me')
//         .set('Cookie', cookie)
//         .then(response => {
//           expect(response.statusCode).toBe(200);
//           expect(response.body.id).toBeTruthy();
//         });
//     })
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

// describe('DELETE /api/tasks/:taskId', () => {
//   it('should delete a task', async () => {
//     await supertest(app)
//       .delete("/api/tasks/:taskId")
//       .expect(200)
//       .end(done);
//   })
// });
