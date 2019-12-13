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
    },
    desc: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "description"
    }
  },
  { timestamps: true }
);

childSchema.methods.toJSON = function() {
  const child = this;
  const childObject = child.toObject();

  delete childObject.poc;
  delete childObject.pocverif;

  return childObject;
};

const Child = mongoose.model("Child", childSchema);

module.exports = Child;
