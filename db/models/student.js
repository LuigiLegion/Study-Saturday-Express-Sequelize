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

module.exports = Student;
