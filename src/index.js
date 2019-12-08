const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
const projectRouter = require("./routers/project");
const companyRouter = require("./routers/company");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);
app.use(projectRouter);
app.use(companyRouter);

app.listen(port, () => {
  console.log("Server is up on port", +port);
});

// const jwt = require("jsonwebtoken");

// const myFunction = async () => {
//   const token = jwt.sign({ _id: "abc132" }, "thisismynew", {
//     expiresIn: "0 seconds"
//   });
//   console.log(token);

//   const ver = jwt.verify(token, "thisismynew");
//   console.log(ver);
// };

// myFunction();

// app.use((req, res, next) => {
//   if (req.method === "GET") {
//     res.send("get request are disabled");
//   } else {
//     next();
//   }
// });
