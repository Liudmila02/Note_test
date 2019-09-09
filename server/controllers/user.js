import model from '../models';

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
                password
              }) 
              return {email: user.email, username: user.username, first_name: user.first_name, last_name: user.last_name}
            }catch(err){
              console.log(err)
              return null
            }
          }
        }

        export default Users;