const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/patients", require("./routes/patients"));
app.use("/api/appointments", require("./routes/appointments"));
app.use("/api/prescriptions", require("./routes/prescriptions"));
app.use("/api/medications", require("./routes/medications"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error(err));
