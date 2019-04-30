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

// Student routes:
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
    const curStudentData = await Student.findOne({
      where: {
        id: curStudentId,
      },
    });
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
    const curUpdate = req.body;
    const curUpdatedStudent = await Student.update(curUpdate, {
      returning: true,
      where: {
        id: curStudentId,
      },
    });
    res.send(curUpdatedStudent[1][0]);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.delete('/students/:id', async (req, res, next) => {
  try {
    const curStudentId = +req.params.id;
    const curStudentDataDeletion = await Student.destroy({
      where: {
        id: curStudentId,
      },
    });
    res.statusCode = 204;
    res.send(null);
  } catch (error) {
    console.error(error);
    next(error);
  }
});
//

// Test routes:
app.get('/tests', async (req, res, next) => {
  try {
    const allTestsData = await Test.findAll();
    res.send(allTestsData);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.get('/tests/:id', async (req, res, next) => {
  try {
    const curTestId = +req.params.id;
    const curTestData = await Test.findOne({
      where: {
        id: curTestId,
      },
    });
    res.send(curTestData);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.post('/tests/student/:studentId', async (req, res, next) => {
  try {
    const curStudentId = +req.params.studentId;
    const newTestSubject = req.body.subject;
    const newTestGrade = req.body.grade;
    const newTest = await Test.create({
      subject: newTestSubject,
      grade: newTestGrade,
      studentId: curStudentId,
    });
    res.statusCode = 201;
    res.send(newTest);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.delete('/tests/:id', async (req, res, next) => {
  try {
    const curTestId = +req.params.id;
    const curTestDeletion = await Test.destroy({
      where: {
        id: curTestId,
      },
    });
    res.statusCode = 204;
    res.send(null);
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
      await db.sync({ logging: false, force: false });
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
