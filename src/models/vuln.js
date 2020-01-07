const mongoose = require("mongoose");
const Desc = require("./description");

const vulnSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    location: {
      type: String
    },
    status: {
      type: Boolean,
      default: false
      //status active atau inactive
    },
    description: {
      type: String
    },
    isvuln: {
      type: Boolean,
      default: false
    },
    child: {
      type: Boolean,
      default: false
    },
    poc: {
      type: Buffer
    },
    pocverif: {
      type: Buffer
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "Project"
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    desc: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Description"
    }
  },
  { timestamps: true }
);

vulnSchema.methods.toJSON = function() {
  const vuln = this;
  const vulnObject = vuln.toObject();

  delete vulnObject.poc;
  delete vulnObject.pocverif;

  return vulnObject;
};

const Vuln = mongoose.model("Vuln", vulnSchema);

module.exports = Vuln;
