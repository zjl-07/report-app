const express = require("express");
const Vuln = require("../models/vuln");
const router = new express.Router();
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");
const Description = require("../models/description");

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

//create vuln by project id
router.post(
  "/projects/:id/vulns",
  auth,
  upload.single("poc"),
  async (req, res) => {
    var buffer = null;
    const _id = req.params.id;

    try {
      buffer = await sharp(req.file.buffer)
        .png()
        .toBuffer();
    } catch (e) {}

    // console.log("a", buffer);

    const vuln = new Vuln({
      ...req.body,
      projectId: _id,
      userId: req.user._id,
      poc: buffer
    });

    try {
      await vuln.save();
      res.status(201).send(vuln);
    } catch (e) {
      res.status(500).send();
    }
  }
);

//upload pocverif image and update pocverif
router.post("/peojects/:id/vulnspocverif"),
  auth,
  upload.single("pocverif"),
  async (req, res) => {
    const buffer = await sharp(req.filter.buffer)
      .png()
      .toBuffer();
    const _id = req.params.id;

    const child = new child({
      ...req.body,
      owner: _id,
      pocverif: buffer
    });

    try {
      await child.save();
      res.status(201).send(child);
    } catch (e) {
      res.status(500).send(e);
    }
  };

//read picture in poc
router.get("/vulns_poc/:id", async (req, res) => {
  try {
    const vuln = await Vuln.findById(req.params.id);

    if (!vuln || !vuln.poc) {
      throw new Error("Vuln cant be found");
    }

    res.set("Content-Type", "image/png");
    res.send(vuln.poc);
  } catch (e) {
    res.status(404).send(e);
  }
});

//read picture in pocverif
router.get("/vulns_pocverif/:id", async (req, res) => {
  try {
    const vuln = await Vuln.findById(rqe.params.id);

    if (!vuln || !vuln.pocverif) {
      throw new Error("Vuln cant be found");
    }

    res.set("Content-Type", "image/png");
    res.send(vuln.pocverif);
  } catch (e) {
    res.status(404).send(e);
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
    const vuln = await Vuln.find({ projectId: _id })
      .limit(parseInt(req.query.limit))
      .skip(parseInt(req.query.skip))
      .sort(sort);
    if (!vuln) {
      return res.status(400).send();
    }

    for (var p of vuln) {
      var desc = await Description.findOne({ _id: p.desc });
      p.desc = desc;
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

//read vulns by id
router.get("/vulns/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const vuln = await Vuln.findOne({ _id });
    if (!vuln) {
      return res.status(400).send();
    }
    res.send(vuln);
  } catch (e) {
    res.status(500).send(e);
  }
});

//update vulns
router.put("/vulns/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "name",
    "location",
    "status",
    "isvuln",
    "poc",
    "description",
    "pocverif",
    "desc",
    "_id",
    "child",
    "projectId",
    "createdAt",
    "updatedAt",
    "userId",
    "__v"
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

    if (req.user.id != vuln.userId) {
      res.status(400).send({ error: "You need to create one " });

      // res.redirect(`../vulns/${vuln._id}/child`).send(vuln);
      return;
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
