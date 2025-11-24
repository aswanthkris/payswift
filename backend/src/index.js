const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { sequelize } = require("./models");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/wallet", require("./routes/walletRoutes"));
app.use("/api/transactions", require("./routes/transactionRoutes"));
app.use("/api/beneficiaries", require("./routes/beneficiaryRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));

const PORT = process.env.PORT || 5000;

// Sync Database and Start Server
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database connected and synced");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
