import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./controllers/authRoutes.js";
import todoRoutes from "./controllers/todoRoutes.js";
import authenticateUser from "./middleware/authenticateUser.js";

// Creating an express app
const app = express();

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

app.listen(8000, () => console.log("Running. . ."));
