const router = require("express").Router();
const Medication = require("../models/Medication");

// GET all medications (for prescription form dropdowns)
router.get("/", async (req, res) => {
  try {
    const medications = await Medication.find().sort({ name: 1 });
    res.json(medications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
