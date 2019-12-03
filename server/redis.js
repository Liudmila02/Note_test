import redis from 'redis';
import db from './models/index'

const client = redis.createClient({
  url: "//127.0.0.1:6379",
  retry_strategy(options) {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      return new Error('The redis server refused the connection');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      return new Error('Redis connection retry time exhausted');
    }
    if (options.attempt > 10) {
      return undefined;
    }
    return Math.min(options.attempt * 100, 3000);
  },
});
export const sendEmail = args =>{
  const uuidv4 = require('uuid/v4');
  const token = uuidv4()+uuidv4();
    client.set(token, args.email, redis.print);
    client.expire(token, 99999);

  var nodemailer = require('nodemailer');

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'test.email.for.myapp@gmail.com',
      pass: 'nodejs2020'
    }
  });
  
  var mailOptions = {
    from: 'test.email.for.myapp@gmail.com',
    to: args.email,
    subject: 'Confirm email',
    text: `<a href="localhost:3000/confirm_email?token=${token}">Click</a>`
  };
    console.log(token)
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ');
    }
  });
}
export const sendEmailPassword = args =>{
  const uuidv4 = require('uuid/v4');
  const token = uuidv4()+uuidv4();
    client.set(token, args.email, redis.print);
    client.expire(token, 99999);

  var nodemailer = require('nodemailer');

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'test.email.for.myapp@gmail.com',
      pass: 'nodejs2020'
    }
  });
  
  var mailOptions = {
    from: 'test.email.for.myapp@gmail.com',
    to: args.email,
    subject: 'Reset password',
    text: `<a href="localhost:3000/reset_password?token=${token}">Click</a>`
  };
    console.log(token)
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ');
    }
  });
}

export const confirmEmail = async req => {
  const token = req.query.token
  const email = await client.getAsync(token)
  if (!email) return false
  const user = await db.User.findOne({where: {email}})
  if (!user) return false
  await user.update({confirmed: true}) 
  client.del(token)
  return true
}

// export const confirmPassword = async req => {
//   const token = req.query.token
//   const email = await client.getAsync(token)
//   if (!email) return false
//   const user = await db.User.findOne({where: {email}})
//   if (!user) return false
//   await user.update({password: password}) 
//   client.del(token)
//   return true
// }
client.on('connect', () => {
  require('bluebird').promisifyAll(client)
})

client.on('error', err => console.log(err));

export default client;


