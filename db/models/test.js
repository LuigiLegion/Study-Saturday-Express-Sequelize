'use strict';
const Sequelize = require('sequelize');
const db = require('../db');
const Student = require('./student');

const Test = db.define('test', {
  subject: {
    type: Sequelize.STRING,
  },
  grade: {
    type: Sequelize.INTEGER,
  },
});

module.exports = Test;
