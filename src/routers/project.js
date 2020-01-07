const express = require("express");
const Project = require("../models/project");
const Company = require("../models/company");
const User = require("../models/user");
const router = new express.Router();
const auth = require("../middleware/auth");

//Create Project
router.post("/company/:id/projects", auth, async (req, res) => {
  const _id = req.params.id;
  const project = new Project({
    ...req.body,
    corporateId: _id //company
  });
  try {
    await project.save();
    res.status(201).send(project);
  } catch (e) {
    res.status(500).send(e);
  }
});

//Read Project By Id (menggunakan company Id)
router.get("/company/:id/projects/", auth, async (req, res) => {
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
    var project = await Project.find({ corporateId: _id })
      .limit(parseInt(req.query.limit))
      .skip(parseInt(req.query.skip))
      .sort(sort);
    if (!project) {
      return res.status(400).send();
    }
    for (var p of project) {
      var arr_team = []; //bikin array untuk nampung, baru di push ke var assign yang asli
      for (var a of p.team) {
        var team = await User.findOne({ _id: a });
        console.log(team);
        arr_team.push(team);
      }
      p.team = arr_team; //lsg ganti pake key yang harus dibuat baru
    }
    res.send(project);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/projects/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const project = await Project.findOne({ _id });
    if (!project) {
      return res.status(400).send();
    }
    var arr_team = []; //bikin array untuk nampung, baru di push ke var assign yang asli

    for (var p of project.team) {
      var team = await User.findOne({ _id: p });
      console.log(team);
      arr_team.push(team);
    }

    project.team = arr_team; //lsg ganti pake key yang harus dibuat baru

    res.send(project);
  } catch (e) {
    res.status(500).send();
  }
});

//Read all projects
router.get("/projects", auth, async (req, res) => {
  try {
    const project = await Project.find();
    if (!project) {
      return res.status(400).send();
    }
    res.send(project);
  } catch (e) {
    res.status(500).send();
  }
});

//Update Projects
router.put("/projects/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "name",
    "description",
    "startDate",
    "endDate",
    "reportStartDate",
    "reportEndDate",
    "team",
    "target"
  ];
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Updates!" });
  }
  try {
    const project = await Project.findOne({
      _id: req.params.id
    });

    if (!project) {
      return res.status(400).send();
    }

    updates.forEach(update => (project[update] = req.body[update]));
    await project.save();
    res.send(project);
  } catch (e) {
    res.status(500).send();
  }
});

router.delete("/projects/:id", auth, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id
    });
    if (!project) {
      res.status(400).send();
    }
    res.send(project);
  } catch (e) {
    res.status(500).send();
  }
});

//upload image
router.post("/c");

module.exports = router;
