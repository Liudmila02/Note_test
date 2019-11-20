// import db from '../models/user';
import bcrypt from 'bcrypt';
import model from '../../server/models';
const { User } = model;
import db from '../models/index'

// export const loginLinkedIn = async args => {
//   console.log(user)
//   let user = await User.findOne({where: {email: args.email}}) 
//    bcrypt.compare(args.password, user.password_hash, async function (user, password) {
//     if (user && password) {
      
//       return user
      
//     }  else if (user == null){
//         return user = await User.create({
//           email: args.email,
//           password_hash: hashPassword(args.password),
//           first_name: args.first_name,
//           last_name: args.last_name,
//           username: args.username || args.first_name + args.last_name
//         });
//       }
   
//   } )
//   return user 
//  }
export const loginLinkedIn = async args => {
  let user = await db.User.findOne({
    where: {
      email: args.email
    }
  })
  console.log(user)
  if (user && (await bcrypt.compare(args.password, user.password_hash)))
    return user
  else if (user)
    return null
  user = await db.User.create({
    email: args.email,
    password_hash: hashPassword(args.password),
    first_name: args.first_name,
    last_name: args.last_name,
    username: args.username || args.first_name + args.last_name
  });
  return user
 }

 export const loginGitHub = async args => {
  console.log(user)
    let user = await User.findOne({where: {email: args.email}}) 
     bcrypt.compare(args.password, user.password_hash, async function (user, password) {
      if (user && password) {  
        return user    
      }  else if (user == null){
          return user = await User.create({
            email: args.email,
            password_hash: hashPassword(args.password),
            first_name: args.first_name,
            last_name: args.last_name,
            username: args.username || args.first_name + args.last_name
          });
        }
    } )
    return user 
 }
 
 export function hashPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}