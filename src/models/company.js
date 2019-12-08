const mongoose = require("mongoose");
const Task = require("./project");

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
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
