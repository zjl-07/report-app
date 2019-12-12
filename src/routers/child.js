const express = require("express");
const Child = require("../models/child");
const router = new express.Router();
const auth = require("../middleware/auth");

router.post("/vulns/:id/childs", auth, async (req, res) => {
  const _id = req.params.id;
  const child = new Child({
    ...req.body,
    owner: _id
  });
  try {
    await child.save();
    res.status(201).send(child);
  } catch (e) {
    res.status(500).send();
  }
});

//read childs by vulns id (menggunakan vulns id)
router.get("/vulns/:id/childs", auth, async (req, res) => {
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
    const child = await Child.find({ owner: _id })
      .limit(parseInt(req.query.limit))
      .skip(parseInt(req.query.skip))
      .sort(sort);
    if (!child) {
      return res.status(400).send();
    }
    res.send(child);
  } catch (e) {
    res.status(500).send(e);
  }
});

//update childs
router.patch("/childs/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "name",
    "location",
    "status",
    "isvuln",
    "poc",
    "pocverif"
  ];
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Updates!" });
  }

  try {
    const child = await Child.findOne({
      _id: req.params.id
    });

    if (!child) {
      return res.status(400).send();
    }

    updates.forEach(update => (child[update] = req.body[update]));
    await child.save();
    res.send(child);
  } catch (e) {
    res.status(500).send();
  }
});

//delete vuln
router.delete("/childs/:id", auth, async (req, res) => {
  try {
    const child = await Child.findOneAndDelete({
      _id: req.params.id
    });
    if (!child) {
      res.status(400).send();
    }
    res.send(child);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
