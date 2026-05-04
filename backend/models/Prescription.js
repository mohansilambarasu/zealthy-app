const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    medication: { type: String, required: true },
    dosage: { type: String, required: true },
    quantity: { type: Number, required: true },
    refill_on: { type: Date, required: true },
    refill_schedule: {
      type: String,
      enum: ["monthly", "quarterly", "annually"],
      default: "monthly",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Prescription", prescriptionSchema);
