const mongoose = require("mongoose");

const descriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  cwe: {
    type: String
  }
});

const Description = mongoose.model("Description", descriptionSchema);

module.exports = Description;
