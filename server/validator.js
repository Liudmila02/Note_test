//if (!req.body.email)
  //return res.status(500).json({ message: "missing email"})
export const validateRegisterForm = args => {
    var errors = {}
    if (!args.email) errors.email =  "missing email";
    if (!args.password) errors.password =  "this field cann't be blank";
    if (!args.first_name) errors.first_name =  "this field cann't be blank";
    if (!args.last_name) errors.last_name =  "this field cann't be blank";
    if (!args.username) errors.username =  "this field cann't be blank";

   return errors
}

export const validateTasksForm = args => {
  var errors = {}
  if (!args.title) errors.title =  "this field cann't be blank";
  if (!args.description) errors.description =  "this field cann't be blank";
  if (!args.due_date) errors.due_date =  "choose a due date";
  
 return errors
}