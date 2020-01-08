const express = require("express");
const Company = require("../models/company");
const router = new express.Router();
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");

const upload = multer({
  limits: {
    fileSize: 1000000 //1MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg)$/)) {
      return cb(new Error("Please upload an image"));
    }

    cb(undefined, true);
  }
});

//Create Company
router.post("/company/", auth, upload.single("imageLink"), async (req, res) => {
  // const task = new Task(req.body);
  var buffer = null;

  try {
    buffer = await sharp(req.file.buffer)
      .png()
      .toBuffer();
  } catch (e) {}

  const company = new Company({
    ...req.body,
    userId: req.user._id,
    imageLink: buffer
  });

  try {
    company.save();
    res.status(201).send(company);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

//Read Company
router.get("/company/", auth, async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  try {
    // const tasks = await Task.find({ owner: req.user._id });
    //atau//
    await req.user
      .populate({
        path: "company",
        match,
        options: {
          limit: parseInt(req.query.limit), //untuk limit, dari url di parse ke integer
          skip: parseInt(req.query.skip), //untuk skip mulai dari data mana
          sort
        }
      })
      .execPopulate();

    const out = [];
    req.user.company.forEach(c => {
      c = c.toObject();
      delete c.imageLink;

      out.push({
        ...c,
        image: "http://localhost:3000/company/image/" + c._id
      });
    });

    console.log(out);
    res.send(out);
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/company/image/:id", async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company || !company.imageLink) {
      throw new Error("Company cant be found");
    }

    res.set("Content-Type", "image/png");
    res.send(company.imageLink);
  } catch (e) {
    res.status(404).send(e);
  }
});

//get company by id
router.get("/company/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const company = await Company.findOne({
      _id,
      userId: req.user._id
    });
    if (!company) {
      return res.status(400).send();
    }
    res.send(company);
  } catch (e) {
    res.status(500).send();
  }
});

//update company
router.put("/company/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "name",
    "email",
    "address",
    "imageLink",
    "description",
    "personInCharge",
    "phoneNumber",
    "_id",
    "userId",
    "createdAt",
    "updatedAt",
    "__v"
  ];

  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Operation" });
  }
  try {
    const company = await Company.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!company) {
      return res.status(400).send();
    }
    updates.forEach(update => (company[update] = req.body[update]));
    await company.save();
    res.send(company);
  } catch (e) {
    res.status(500).send();
  }
});

//Delete Company by ID
router.delete("/company/:id", auth, async (req, res) => {
  try {
    const company = await Company.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!company) {
      res.status(404).send();
    }
    res.send(company);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
