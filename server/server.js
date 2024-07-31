import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./controllers/authRoutes.js";
import todoRoutes from "./controllers/todoRoutes.js";
import prisma from "./db/prismaClient.js";

dotenv.config();

// Creating an express app
const app = express();

const port = process.env.SERVER_PORT || 5000;

// Using middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// Auth routes
app.use("/api/auth", authRoutes);

// Todo routes
app.use("/api/todo", todoRoutes);

app.listen(port, () => console.log(`Server running on port ${port}. . .`));
