import model from '../models';

const { Task } = model;

class Tasks {
  static create(req, res) {
    const { title, description, priority, due_date, completed } = req.body
    return Task
      .create({
        title,
        description,
        priority,
        due_date,
        completed,
        userId: req.user.id
      })
      .then(task => res.status(200).send({
        message: `Your task with the title ${title} has been created successfully `,
        task
      }))
  }

  static list(req, res) {
    return Task
      .findAll({
        where:{ userId: req.user.id}})
      .then(tasks => res.status(200).send(tasks));
  }

  static async modify(req, res) {
    const { title, description, priority, due_date, completed } = req.body
    console.log(req.body);
    try{ 
      const task = await Task.findOne({where: {id: req.params.taskId }})
        console.log(req.params.taskId)
        if (!task) throw new Error()
        const updatedTask = task.update({
          title: title || task.title,
          description: description || task.description,
          priority: priority || task.priority,
          due_date: due_date || task.due_date,
          completed: typeof completed == 'boolean' ? completed : task.completed
        })
        
        console.log('completed', completed);
        console.log(updatedTask);
        
        res.status(200).send({
          message: 'Task successfully update',
          data: updatedTask
        })
      }catch(err) {
        console.log(err)
        return res.status(400).send({
        message: 'Task Not Update',
        });         
      } 
  }   
  static async delete(req, res) {
    console.log(req.params.taskIds)
    try{ 
      await Task
      .destroy({
        where:{id: req.params.taskIds.split(',')}
      })
      res.status(200).send({
        message: 'Task successfully deleted'
      })
    }catch(err) {
      console.log(err)
      return res.status(400).send({
      message: 'Task Not Found',
      });
    }    
  }
  
  static async show(req, res) {
    try{ 
      const newTask= await Task
      .findOne({where:{id: req.params.taskId}})
      res.status(200).json({
        task: newTask
      })
    }catch(err) {
      console.log(err)
      return res.status(400).send({
      message: 'Task Not Found',
      });
    }    
  }  
}


export default Tasks