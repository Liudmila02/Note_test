// import db from '../models/index';
// import bcrypt from 'bcrypt';


// export const sendEmail = args =>{
//     const uuidv4 = require('uuid/v4');
//     const token = uuidv4()+uuidv4();
//       client.set(token, args.email, redis.print);
//       client.expire(token, 99999);
  
//     var nodemailer = require('nodemailer');
  
//     var transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: 'test.email.for.myapp@gmail.com',
//         pass: 'nodejs2020'
//       }
//     });
    
//     var mailOptions = {
//       from: 'test.email.for.myapp@gmail.com',
//       to: args.email,
//       subject: 'Confirm email',
//       text: `<a href="localhost:3000/confirm_email?token=${token}">Click</a>`
//     };
//       console.log(token)
//     transporter.sendMail(mailOptions, function(error, info){
//       if (error) {
//      //console.log(error);
//       } else {
//      //console.log('Email sent: ');
//       }
//     });
//     return {
//         success: true,
//         user: {
//           email: user.email,
//           first_name: user.first_name
//         }
//       }
//     // } catch (err) {
//     //   return {
//     //     success: false,
//     //     message: err.message,
//     //   }
//     // }
// }
  
//   export const login = async args => {
//     if(!args.email || !args.password)
//       throw new Error('Wrong credentials')
  
//     let user = await db.User.findOne({where: {email: args.email}})
//     if(!user || !await bcrypt.compare(args.password, user.password_hash)){
//       throw new Error('Wrong email or password')
//     }
//     if(!user.confirmed)
//       throw new Error('Please confirm your email')
//     return {
//       id: user.id,
//       first_name: user.first_name,
//       last_name: user.last_name,
//       email: user.email,
//     };
//   }
  
//   export const confirmEmail = async req => {
//     const token = req.query.token
//     const email = await client.getAsync(token)
//     if (!email) return false
//     const user = await db.User.findOne({where: {email}})
//     if (!user) return false
//     await user.update({confirmed: true}) 
//     client.del(token)
//     return true
//   }
