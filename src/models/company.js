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
      unique: true,
      trim: true,
      lowercase: true
    },
    address: {
      typs: String
    },
    logo: {
      type: Buffer
    },
    description: {
      type: String
    },
    pic: {
      type: String
    },
    phone: {
      type: Number,
      default: 0
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
