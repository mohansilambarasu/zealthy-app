const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// GET all patients
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single patient
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "Patient not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create patient
router.post("/", async (req, res) => {
  try {
    const { name, email, password, dateOfBirth, phone } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashed,
      dateOfBirth,
      phone,
    });
    await user.save();
    const { password: _, ...safe } = user.toObject();
    res.status(201).json(safe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update patient
router.put("/:id", async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    const update = password
      ? { ...rest, password: await bcrypt.hash(password, 10) }
      : rest;
    const user = await User.findByIdAndUpdate(req.params.id, update, {
      new: true,
    }).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
