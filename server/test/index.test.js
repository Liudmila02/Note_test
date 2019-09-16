const supertest = require('supertest');
const should = require('should');
const express = require('express');

const app = require('../../app')
import db from '../models/index';
import {register} from '../regist';
import User from '../controllers/user';
import redis from "redis";
import client from "../redis";

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
    let cookie
    await supertest(app)
        .post('/api/login')
        .set('content-type', 'application/json')
        .send({
          email: user.email,
          password: user.password,
        })
        .then(async response => {
          cookie = response.headers['set-cookie'].pop().split(';')[0];
        });
    await supertest(app)
      .post('/api/tasks')
      .set('Cookie', cookie)
      .send({
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

describe('/api/login', () => {
  beforeEach(async () => {
    await db.User.destroy({ where: {}, force: true });
    await db.Task.destroy({ where: {}, force: true });
  });
  const testUser = {
    email: 'test@gmail.com',
    password: 'password123',
    first_name: 'Fname',
    last_name: 'Lname',
    username: 'name',
  }
  describe('Bad params', () => {
    it("Should respond with error", async () => {
      await register(testUser)
      await supertest(app)
        .post('/api/login')
        .set('content-type', 'application/json')
        .send({
          email: testUser.email,
          password: "wrongpassword",
        })
        .then(async response => {
          expect(response.statusCode).toBe(401);
          expect(response.body.message).toBe("not found");
        });
    })
  })

  describe('Good params', () => {
    it("Should respond with profile", async () => {
      let cookie
      await User.signUp({body: testUser})
      await supertest(app)
        .post('/api/login')
        .set('content-type', 'application/json')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .then(async response => {
          expect(response.statusCode).toBe(200);
          expect(response.body.user).toBeTruthy();
          console.log(response.headers)
          cookie = response.headers['set-cookie'].pop().split(';')[0];
        });

      await supertest(app)
        .get('/auth')
        .set('Cookie', cookie)
        .then(response => {
          console.log(response.body)
          expect(response.statusCode).toBe(200);
          expect(response.body.id).toBeTruthy();
        });
    })
  })
})

describe('app/confirm_email', () => {
  beforeEach(async () => {
    await db.Task.destroy({ where: {}, force: true });
    await db.User.destroy({ where: {}, force: true });
  });

  const testUser = {
    email: 'test@gmail.com',
    password: 'password123',
    firstName: 'Fname',
    lastName: 'Lname',
  }

  let token = 'safasfasf'

  describe('Bad params', () => {
    it("Should respond with error", async () => {
      await supertest(app)
      .get('/confirm_email?token='+ token)
      .set('content-type', 'application/json')
      .then(async response => {
        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe("link is broken");
      });
    })
  })

  describe('Good params', () => {
    it("Should respond with true", async () => {
      await register(testUser)
      const uuidv4 = require('uuid/v4');
      token = uuidv4()+uuidv4();
      client.set(token, testUser.email, redis.print);

      await supertest(app)
      .get('/confirm_email?token='+ token)
      .set('content-type', 'application/json')
      .then(async response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("ok");
      });
    })
  })
})

  describe('List tasks', () => {
   it('should list all tasks', async () => {
    await supertest(app).get('/api/tasks')
    .expect(200).get, 'tasks list'
     });
   })
  
  describe('Modify a task', () => {
    it('should modify a task', async () => {
      await supertest(app).put('/api/tasks/:taskId')
      .expect(200).put, 'task modified'
      });
    })
  
  describe('Delete a task', () => {
    it('should delete a task', async () => {
      await supertest(app).delete('/api/tasks/:taskId')
        .expect(200).delete, 'task deleted'
    });
  })
  
 