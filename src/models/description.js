const mongoose = require("mongoose");

const descriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  desc: {
    type: String
  },
  CWE: {
    type: String
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Vuln"
  }
});

const Description = mongoose.model("Description", descriptionSchema);

module.exports = Description;
