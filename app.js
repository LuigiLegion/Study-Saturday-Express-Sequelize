const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const db = require('./db/db');
const Student = require('./db/models/student');
const Test = require('./db/models/test');
const students = require('./routes/students');
const tests = require('./routes/tests');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/students', students);
app.use('/tests', tests);

// My routes:

app.get('/students', async (req, res, next) => {
  try {
    const allStudentsData = await Student.findAll();
    res.send(allStudentsData);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.get('/students/:id', async (req, res, next) => {
  try {
    const curStudentId = +req.params.id;
    // console.log(typeof curStudentId, curStudentId);
    // const allStudentsData = await Student.findAll();
    // console.log(allStudentsData);
    const curStudentData = await Student.findOne({
      where: {
        id: curStudentId,
      },
    });
    // console.log(curStudentData);
    if (curStudentData) {
      res.send(curStudentData);
    } else {
      res.statusCode = 404;
      res.send('STUDENT DOES NOT EXIST');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.post('/students', async (req, res, next) => {
  try {
    const newStudentFirstName = req.body.firstName;
    const newStudentLastName = req.body.lastName;
    const newStudentEmail = req.body.email;
    const newStudent = await Student.create({
      firstName: newStudentFirstName,
      lastName: newStudentLastName,
      email: newStudentEmail,
    });
    res.statusCode = 201;
    res.send(newStudent);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.put('/students/:id', async (req, res, next) => {
  try {
    const curStudentId = +req.params.id;
    console.log(typeof curStudentId, curStudentId);
    const curUpdate = req.body;
    console.log(curUpdate);
    // const allStudentsData = await Student.findAll();
    // console.log(allStudents);
    // const curStudentData = await Student.findOne({
    //   where: {
    //     id: curStudentId,
    //   },
    // });
    // console.log(curStudentData);
    const curUpdatedStudent = await Student.update(curUpdate, {
      returning: true,
      where: {
        id: curStudentId,
      },
    });
    // console.log(curUpdatedStudent[1][0]);
    res.send(curUpdatedStudent[1][0]);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const init = async () => {
  if (require.main === module) {
    //will only run when run with npm start and not with npm test to avoid db syncing in multiple threads when running tests
    try {
      await db.sync();
      app.listen(3000, () => {
        console.log('Server is listening on port 3000!');
      });
    } catch (err) {
      console.error(err);
    }
  }
};

init();

module.exports = app;
