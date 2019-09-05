import model from '../models';

const { Task } = model;

class Tasks {
  static create(req, res) {
    const { title, description, priority, due_date, completed } = req.body
    const { userId } = req.params
    return Task
      .create({
        title,
        description,
        priority,
        due_date,
        completed,
        userId
      })
      .then(task => res.status(201).send({
        message: `Your task with the title ${title} has been created successfully `,
        task
      }))
    }

  static list(req, res) {
    return Task
      .findAll()
      .then(tasks => res.status(200).send(tasks));
    }
  static modify(req, res) {
    const { title, description, priority, due_date, completed } = req.body
      return Task
        .findById(req.params.taskId)
        .then((task) => {
          task.update({
            title: title || task.title,
            description: description || task.description,
            priority: priority || task.priority,
            due_date: due_date || task.due_date,
            completed: completed || task.completed
          })
          .then((updatedTask) => {
            res.status(200).send({
              message: 'Task updated successfully',
              data: {
                title: title || updatedTask.title,
                description: description || updatedTask.description,
                priority: priority || updatedTask.priority,
                due_date: due_date || updatedTask.due_date,
                completed: completed || updatedTask.completed
              }
            })
          })
          .catch(error => res.status(400).send(error));
        })
        .catch(error => res.status(400).send(error));
    }
    static delete(req, res) {
      return Task
        .findById(req.params.taskId)
        .then(task => {
          if(!task) {
            return res.status(400).send({
            message: 'Task Not Found',
            });
          }
          return task
            .destroy()
            .then(() => res.status(200).send({
              message: 'Task successfully deleted'
            }))
            .catch(error => res.status(400).send(error));
        })
        .catch(error => res.status(400).send(error))
    }
}

export default Tasks