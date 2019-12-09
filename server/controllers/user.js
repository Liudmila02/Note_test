import model from '../models';
import {sendEmail} from "../redis"
import {sendEmailPassword} from "../redis"

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
    try {
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
    } catch(err){
      console.log(err)
      return null
    }
  }  

  // static async resetPassword(req,res) {
  //   const  email = req.body.email
  //     User.findOne({ where: {email: email},
  //     })
  //     .then(function (user) {
  //       if (!user) {
  //         return res.status(400).send({
  //           message: 'User Not Found',
  //           });
  //       }
  //       sendEmailPassword({ email: email })
  //     })
  // }

  static async resetPassword(req,res) {
    const  { email } = req.body
    try{
      const user = await User.findOne({ where: {email: email}
      })
      if (!user) {
        return res.status(400).send({
          message: 'User Not Found',
        });
      }else {
        sendEmailPassword({ email: email })
        console.log( user.id)
        return res.status(200).json({ id: user.id }) 
      }
    }catch(err){
      console.log(err)
      return null 
    }
  }

  static async updatePassword(req, res) {
    const { password } = req.body
    console.log(req.body);
    try{ 
      const user = await  User.findOne({ where: {id: req.params.userId},
      })
        console.log("id===", req.params.userId)
        if (!user) throw new Error()
        const updatedPassword = user.update({
          password: password || user.password,
        })
        console.log(updatedPassword);
        
        res.status(200).send({
          message: 'Password successfully update',
          data: updatedPassword
        })
      }catch(err) {
        console.log(err)
        return res.status(400).send({
        message: 'Password Not Update',
        });         
      } 
  }   

  static async show(req, res) {
    try{ 
      const newUser= await User
      .findOne({where:{id: req.params.userId}})
      res.status(200).json({
        user: newUser
      })
    }catch(err) {
      console.log(err)
      return res.status(400).send({
      message: 'User Not Found',
      });
    }    
  } 
  
  static async modify(req, res) {
    const { username, first_name, last_name, email, password } = req.body
    console.log(req.body);
    try{ 
      const user = await User.findOne({where: {id: req.params.userId }})
        console.log(req.params.userId)
        if (!user) throw new Error()
        const updatedUser = user.update({
          username: username || user.username,
          first_name: first_name || user.first_name,
          last_name: last_name || user.last_name,
          email: email || user.email,
          password: password || user.password,
        })
        console.log(updatedUser);
        res.status(200).send({
          message: 'User successfully update',
          data: updatedUser
        })
      }catch(err) {
        console.log(err)
        return res.status(400).send({
        message: 'User Not Update',
        });         
      } 
  }      
}
export default Users;
