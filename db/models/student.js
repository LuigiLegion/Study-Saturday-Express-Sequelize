'use strict';

const Sequelize = require('sequelize');
const db = require('../db');

const Student = db.define('student', {
  firstName: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  lastName: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  email: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
});

Student.beforeCreate('student', newStudent => {
  newStudent.firstName =
    newStudent.firstName[0].toUpperCase() + newStudent.firstName.slice(1);
  newStudent.lastName =
    newStudent.lastName[0].toUpperCase() + newStudent.lastName.slice(1);
});

module.exports = Student;
