const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const Desc = require("../models/description");

router.post("/descs", auth, async (req, res) => {
  const _id = req.params.id;
  const desc = new Desc({
    ...req.body
  });
  try {
    await desc.save();
    res.status(201).send(desc);
  } catch (e) {
    res.status(500).send();
  }
});

//read all vulns
router.get("/descs", auth, async (req, res) => {
  try {
    const desc = await Desc.find();
    if (!desc) {
      return res.status(400).send();
    }
    res.send(desc);
  } catch (e) {
    res.status(500).send();
  }
});

//update vulns
router.put("/descs/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "description", "cwe"];

  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Updates!" });
  }

  try {
    const desc = await Desc.findOne({
      _id: req.params.id
    });

    if (!desc) {
      return res.status(400).send();
    }

    updates.forEach(update => (desc[update] = req.body[update]));
    await desc.save();
    res.send(desc);
  } catch (e) {
    res.status(500).send();
  }
});

//delete vuln
router.delete("/descs/:id", auth, async (req, res) => {
  try {
    const desc = await Desc.findOneAndDelete({
      _id: req.params.id
    });
    if (!desc) {
      res.status(400).send();
    }
    res.send(desc);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
