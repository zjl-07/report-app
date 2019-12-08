const express = require("express");
const Project = require("../models/project");
const router = new express.Router();
const auth = require("../middleware/auth");

router.post("/projects".auth, async (req, res) => {
  const project = new Project({
    ...req.body,
    owner: req.user_id
  });
  try {
    await project.save();
    res.status(201).send(project);
  } catch (e) {
    res.status(500).send();
  }
});
