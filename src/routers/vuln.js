const express = require("express");
const Vuln = require("../models/vuln");
const router = new express.Router();
const auth = require("../middleware/auth");

router.post("/projects/:id/vulns", auth, async (req, res) => {
  const _id = req.params.id;
  const vuln = new Vuln({
    ...req.body,
    project_id: _id
  });
  try {
    await vuln.save();
    res.status(201).send(vuln);
  } catch (e) {
    res.status(500).send();
  }
});

//read vuln by project id (menggunakan project id)
router.get("/projects/:id/vulns", auth, async (req, res) => {
  const _id = req.params.id;
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
    const vuln = await Vuln.find({ project_id: _id })
      .limit(parseInt(req.query.limit))
      .skip(parseInt(req.query.skip))
      .sort(sort);
    if (!vuln) {
      return res.status(400).send();
    }
    res.send(vuln);
  } catch (e) {
    res.status(500).send(e);
  }
});

//read all vulns
router.get("/vulns", auth, async (req, res) => {
  try {
    const vuln = await Vuln.find();
    if (!vuln) {
      return res.status(400).send();
    }
    res.send(vuln);
  } catch (e) {
    res.status(500).send();
  }
});

//update vulns
router.patch("/vulns/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "name",
    "location",
    "status",
    "isvuln",
    "poc",
    "description",
    "pocverif"
  ];

  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Updates!" });
  }

  try {
    const vuln = await Vuln.findOne({
      _id: req.params.id
    });

    if (!vuln) {
      return res.status(400).send();
    }

    updates.forEach(update => (vuln[update] = req.body[update]));
    await vuln.save();
    res.send(vuln);
  } catch (e) {
    res.status(500).send();
  }
});

//delete vuln
router.delete("/vulns/:id", auth, async (req, res) => {
  try {
    const vuln = await Vuln.findOneAndDelete({
      _id: req.params.id
    });
    if (!vuln) {
      res.status(400).send();
    }
    res.send(vuln);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
