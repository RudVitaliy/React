//loading the express module
const express = require("express");
const cors = require("cors");

const studentRouter = require("./controller/student-controller");
const classroomRouter = require("./controller/classroom-controller");
const subjectRouter = require("./controller/subject-controller");
const gradeRouter = require("./controller/grade-controller");

//initializing the new Express.js server
const app = express();
//defining the port on which the application should run on localhost
const port = process.env.PORT || 8000;

// Parsing
app.use(express.json()); // support for application/json
app.use(express.urlencoded({ extended: true })); // support for application/x-www-form-urlencoded

app.use(cors())

//a simple route definition with an HTTP GET method that only returns text
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/student", studentRouter);
app.use("/classroom", classroomRouter);
app.use("/subject", subjectRouter);
app.use("/grade", gradeRouter);

app.get("/*", (req, res) => {
  res.send("Unknown path!");
});

//setting the port on which the HTTP server should run
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
