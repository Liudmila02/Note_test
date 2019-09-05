import model from '../models';

        const { User } = model;

        class Users {
          static signUp(req, res) {
            const { first_name, last_name, username, email, password } = req.body
            console.log(req.body)
              return User
                .create({
                  first_name,
                  last_name,
                  username,
                  email,
                  password
                })
                .then(userData => res.status(201).send({
                  success: true,
                  message: 'User successfully created',
                  userData
                }))
            }
        }

        export default Users;