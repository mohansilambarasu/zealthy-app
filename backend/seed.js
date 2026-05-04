const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");
const Appointment = require("./models/Appointment");
const Prescription = require("./models/Prescription");
const Medication = require("./models/Medication");

const dosages = [
  "1mg",
  "2mg",
  "3mg",
  "5mg",
  "10mg",
  "25mg",
  "50mg",
  "100mg",
  "250mg",
  "500mg",
  "1000mg",
];

const medications = [
  "Diovan",
  "Lexapro",
  "Metformin",
  "Ozempic",
  "Prozac",
  "Seroquel",
  "Tegretol",
];

const users = [
  {
    name: "Mark Johnson",
    email: "mark@some-email-provider.net",
    password: "Password123!",
    appointments: [
      {
        provider: "Dr Kim West",
        datetime: "2026-04-16T16:30:00.000-07:00",
        repeat: "weekly",
      },
      {
        provider: "Dr Lin James",
        datetime: "2026-04-19T18:30:00.000-07:00",
        repeat: "monthly",
      },
    ],
    prescriptions: [
      {
        medication: "Lexapro",
        dosage: "5mg",
        quantity: 2,
        refill_on: "2026-04-05",
        refill_schedule: "monthly",
      },
      {
        medication: "Ozempic",
        dosage: "1mg",
        quantity: 1,
        refill_on: "2026-04-10",
        refill_schedule: "monthly",
      },
    ],
  },
  {
    name: "Lisa Smith",
    email: "lisa@some-email-provider.net",
    password: "Password123!",
    appointments: [
      {
        provider: "Dr Sally Field",
        datetime: "2026-04-22T18:15:00.000-07:00",
        repeat: "monthly",
      },
      {
        provider: "Dr Lin James",
        datetime: "2026-04-25T20:00:00.000-07:00",
        repeat: "weekly",
      },
    ],
    prescriptions: [
      {
        medication: "Metformin",
        dosage: "500mg",
        quantity: 2,
        refill_on: "2026-04-15",
        refill_schedule: "monthly",
      },
      {
        medication: "Diovan",
        dosage: "100mg",
        quantity: 1,
        refill_on: "2026-04-25",
        refill_schedule: "monthly",
      },
    ],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // Clear existing data
    await User.deleteMany({});
    await Appointment.deleteMany({});
    await Prescription.deleteMany({});
    await Medication.deleteMany({});
    console.log("Cleared existing data");

    // Seed medications list
    const medicationDocs = medications.map((name) => ({ name, dosages }));
    await Medication.insertMany(medicationDocs);
    console.log("Medications seeded");

    // Seed users, appointments, prescriptions
    for (const userData of users) {
      const hashed = await bcrypt.hash(userData.password, 10);
      const user = await User.create({
        name: userData.name,
        email: userData.email,
        password: hashed,
      });

      for (const appt of userData.appointments) {
        await Appointment.create({ ...appt, userId: user._id });
      }

      for (const rx of userData.prescriptions) {
        await Prescription.create({ ...rx, userId: user._id });
      }

      console.log(`Seeded user: ${user.name}`);
    }

    console.log("Seed complete!");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();
