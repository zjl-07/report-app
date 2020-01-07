const express = require("express");
const Task = require("../models/task");
const router = new express.Router();
const auth = require("../middleware/auth");

router.post("/tasks", auth, async (req, res) => {
  // const task = new Task(req.body);
  const task = new Task({
    ...req.body,
    owner: req.user._id
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(500).send();
  }
});

//GET /tasks?completed=true
//GET /tasks?limit=10&skip=20
//ngambil data yang completed nya true doang
//GET /tasks?sortBy=
router.get("/tasks", auth, async (req, res) => {
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
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit), //untuk limit, dari url di parse ke integer
          skip: parseInt(req.query.skip), //untuk skip mulai dari data mana
          sort
        }
      })
      .execPopulate();
    res.send(req.user.tasks);
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    // const task = await Task.findById(_id);
    //search dari id nya si user yang login
    const task = await Task.findOne({
      _id,
      owner: req.user._id
    });
    if (!task) {
      return res.status(400).send();
    }
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

router.put("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "invalid updates!" });
  }
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id
    });
    // const task = await Task.findById(req.params.id);

    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true
    // });
    if (!task) {
      return res.status(400).send();
    }
    updates.forEach(update => (task[update] = req.body[update]));
    await task.save();
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    // const task = await Task.findByIdAndDelete(req.params.id);
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });
    if (!task) {
      res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
