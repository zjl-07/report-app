const express = require("express");
const Company = require("../models/company");
const router = new express.Router();
const auth = require("../middleware/auth");

//Create Company
router.post("/company", auth, (req, res) => {
  // const task = new Task(req.body);
  const company = new Company({
    ...req.body,
    owner: req.user._id
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
router.get("/company", auth, async (req, res) => {
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
    res.send(req.user.company);
  } catch (e) {
    res.status(500).send();
  }
});

//get company by id
router.get("/company/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const company = await Company.findOne({
      _id,
      owner: req.user._id
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
router.patch("/company/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name"];
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Operation" });
  }
  try {
    const company = await Company.findOne({
      _id: req.params.id,
      owner: req.user._id
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

router.delete("/company/:id", auth, async (req, res) => {
  try {
    const company = await Company.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
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
