const mongoose = require("mongoose");
const Task = require("./project");

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId, //menambahkan object id untuk siapa yang berhak
      required: true,
      ref: "User" //reference untuk membuat relationship
    }
  },

  {
    timestamps: true
  }
);

companySchema.virtual("projects", {
  ref: "Project",
  localField: "_id",
  foreignField: "owner"
});

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
