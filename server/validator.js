//if (!req.body.email)
  //return res.status(500).json({ message: "missing email"})
export const validateRegisterForm = args => {
    var errors = {}
    if (!args.email) errors.email =  "missing email";
    if (!args.password) errors.password =  "this field cannot be blank";
    if (!args.first_name) errors.first_name =  "this field cannot be blank";
    if (!args.last_name) errors.last_name =  "this field cannot be blank";
    if (!args.user_name) errors.user_name =  "this field cannot be blank";

   return errors
}