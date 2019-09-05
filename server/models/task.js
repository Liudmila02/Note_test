'use strict';
module.exports = (sequelize, DataTypes) => {
  var Task = sequelize.define('Task', {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    priority: DataTypes.INTEGER,
    due_date: DataTypes.DATE,
    completed: DataTypes.BOOLEAN,
    userId: DataTypes.INTEGER,
  }, {});
  Task.associate = function(models) {
    // associations can be defined here
  };
  return Task;
};
export default (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    title: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Please enter the title for your task'
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Please input a description'
      }
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: {
        args: false,
        msg: 'Please input a priority'
      }
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: {
        args: false,
        msg: 'Please input a priority'
      }
    }, 
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: {
        args: false,
        msg: 'Please input a completed'
    }
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id',
        as: 'userId',
      }
    }
  }, {});
  Task.associate = (models) => {
    // associations can be defined here
    Task.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  return Task;
};