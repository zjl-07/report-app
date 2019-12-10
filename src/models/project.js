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
    start_pentest: {
      type: Date
    },
    end_pentest: {
      type: Date
    },
    start_report: {
      type: Date
    },
    end_pentest: {
      type: Date
    },
    target: {
      type: Buffer
    },
    assigned: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    owner: {
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
