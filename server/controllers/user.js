import model from '../models';
import {sendEmail} from "../redis"
        const { User } = model;

        class Users {
          static async login(email, password) { 
            return await User.findOne({
              where: {
                  email, 
                  password
              }
            })
          }
          static async signUp(req) {
            const { first_name, last_name, username, email, password } = req.body
            try{
              const user = await User
              .create({
                first_name,
                last_name,
                username,
                email,
                password,
              }) 
              sendEmail({email: email
              })
              return {email: user.email, confirmed: user.confirmed, username: user.username, first_name: user.first_name, last_name: user.last_name}
            }catch(err){
              console.log(err)
              return null
            }
          }
        
        static delete(req, res) {
          return User
            .findById(req.params.userId)
            .then(user => {
              if(!user) {
                return res.status(400).send({
                message: 'User Not Found',
                });
              }
              return user
                .destroy()
                .then(() => res.status(200).send({
                  message: 'Task successfully deleted'
                }))
                .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error))
        }
      }
        export default Users;