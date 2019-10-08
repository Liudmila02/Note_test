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
      .findAll()
      .then(tasks => res.status(200).send(tasks));
    }
  static async modify(req, res) {
    const { title, description, priority, due_date, completed } = req.body
    try{ 
      const task = await Task.findOne({where: {id: req.params.taskId }})
        console.log(req.params.taskId)
        if (!task) throw new Error()
        const updatedTask = task.update({
        title: title || task.title,
        description: description || task.description,
        priority: priority || task.priority,
        due_date: due_date || task.due_date,
        completed: completed || task.completed
      })
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
    //   return Task
    //     .findById(req.params.taskId)
    //     .then((task) => {
    //       task.update({
    //         title: title || task.title,
    //         description: description || task.description,
    //         priority: priority || task.priority,
    //         due_date: due_date || task.due_date,
    //         completed: completed || task.completed
    //       })
    //       .then((updatedTask) => {
    //         res.status(200).send({
    //           message: 'Task updated successfully',
    //           data: {
    //             title: title || updatedTask.title,
    //             description: description || updatedTask.description,
    //             priority: priority || updatedTask.priority,
    //             due_date: due_date || updatedTask.due_date,
    //             completed: completed || updatedTask.completed
    //           }
    //         })
    //       })
    //       .catch(error => res.status(400).send(error));
    //     })
    //     .catch(error => res.status(400).send(error));
    // }


    static async delete(req, res) {
      try{ 
        await Task
        .destroy({
          where:{id: req.params.taskId}
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