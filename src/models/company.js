const mongoose = require("mongoose");
const Task = require("./project");

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    address: {
      type: String
    },
    imageLink: {
      type: Buffer
    },
    description: {
      type: String
    },
    personInCharge: {
      type: String
    },
    phoneNumber: {
      type: Number,
      default: 0
    },
    userId: {
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
