const express = require("express");
const cors = require("cors");
require("dotenv").config();

const dataRoutes = require("./routes/data.routes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.use("/api", dataRoutes);

app.get("/", (req, res) => {
  res.json({ message: "DataForge API is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});