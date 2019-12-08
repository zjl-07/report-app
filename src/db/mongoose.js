const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/report-app", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});
