const router = require("express").Router();
const Appointment = require("../models/Appointment");

router.get("/patient/:userId", async (req, res) => {
  try {
    const appointments = await Appointment.find({
      userId: req.params.userId,
    }).sort({ dateTime: 1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const appt = new Appointment(req.body);
    await appt.save();
    res.status(201).json(appt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const appt = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(appt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
