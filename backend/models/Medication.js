const mongoose = require("mongoose");

const medicationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  dosages: [{ type: String }],
});

module.exports = mongoose.model("Medication", medicationSchema);
