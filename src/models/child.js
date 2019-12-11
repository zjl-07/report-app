const mongoose = require("mongoose");

const childSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    id: {
      //untuk nyimpen id di description
      type: mongoose.Schema.Types.ObjectId
    },
    location: {
      type: String
    },
    status: {
      type: Boolean,
      default: false
      //status active atau inactive
    },
    isvuln: {
      type: Boolean,
      default: false
    },
    version: {
      type: Number
    },
    poc: {
      type: Buffer
    },
    pocverif: {
      type: Buffer
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "Vuln"
    }
  },
  { timestamps: true }
);

const Child = mongoose.model("Child", childSchema);

module.exports = Child;
