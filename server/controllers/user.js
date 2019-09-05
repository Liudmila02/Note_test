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
              return user
            }catch(err){
              return null
            }
          }
        }

        export default Users;