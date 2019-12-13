const mongoose = require("mongoose");
const Vuln = require("./vuln");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    },
    reportStartDate: {
      type: Date
    },
    reportEndDate: {
      type: Date
    },
    target: {
      type: Buffer
    },
    team: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    corporateId: {
      type: mongoose.Schema.Types.ObjectId, //menambahkan object id untuk siapa yang berhak
      required: true,
      ref: "Company" //reference untuk membuat relationship
    }
  },
  { timestamps: true }
);

projectSchema.virtual("vuln", {
  ref: "Vuln",
  localField: "_id",
  foreignField: "owner"
});

//middleware untuk delete project, akan delete semua vuln
projectSchema.pre("remove", async function(next) {
  const project = this;
  await Vuln.deleteMany({ owner: project._id });
  next();
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
