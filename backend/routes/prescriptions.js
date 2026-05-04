const router = require("express").Router();
const Prescription = require("../models/Prescription");

router.get("/patient/:userId", async (req, res) => {
  try {
    const rxs = await Prescription.find({ userId: req.params.userId }).sort({
      refillDate: 1,
    });
    res.json(rxs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const rx = new Prescription(req.body);
    await rx.save();
    res.status(201).json(rx);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const rx = await Prescription.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(rx);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Prescription.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
