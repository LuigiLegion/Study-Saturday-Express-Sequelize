'use strict';

const Sequelize = require('sequelize');
const db = require('../db');

const Student = db.define('student', {
  firstName: {
    type: Sequelize.TEXT,
  },
  lastName: {
    type: Sequelize.TEXT,
  },
  email: {
    type: Sequelize.TEXT,
    validate: {
      isEmail: true,
    },
  },
});

module.exports = Student;
