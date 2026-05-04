const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    provider: { type: String, required: true },
    datetime: { type: Date, required: true },
    repeat: {
      type: String,
      enum: ["none", "weekly", "monthly"],
      default: "none",
    },
    repeatEndsAt: { type: Date, default: null },
    notes: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Appointment", appointmentSchema);
