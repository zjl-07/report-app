const mongoose = require("mongoose");
const Desc = require("./description");

const vulnSchema = new mongoose.Schema(
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
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "Project"
    }
  },
  { timestamps: true }
);

vulnSchema.virtual("desc", {
  ref: "Desc",
  localField: "_id",
  foreignField: "owner"
});

const Vuln = mongoose.model("Vuln", vulnSchema);

module.exports = Vuln;
