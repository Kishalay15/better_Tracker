import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import connectDb from "./config/db";
import authRoutes from "./routes/authRoutes";
import { errorHandler } from "./middleware/errorHandler";
import incomeRoutes from "./routes/incomeRoutes";
import expenseRoutes from "./routes/expenseRoutes";

dotenv.config();

const app = express();

//middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

//db
connectDb();

//route
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);

//if not found
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
