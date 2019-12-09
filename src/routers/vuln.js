const express = require("express");
const Vuln = require("../models/vuln");
const router = new express.Router();
const auth = require("../middleware/auth");

router.post("/projects/:id/vuln", auth, async (req, res) => {
  const _id = req.params.id;
  const vuln = new Vuln({
    ...req.body,
    owner: _id
  });
  try {
    await vuln.save();
    res.status(201).send(vuln);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
