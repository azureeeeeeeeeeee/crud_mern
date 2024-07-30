import express from "express";
import db from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authenticateUser from "../middleware/authenticateUser.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = await bcrypt.hash(req.body.password, 10);

  db.query(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [username, email, password],
    (err, queryRes) => {
      if (err) {
        return res.status(500).json({ message: "Failed to register user" });
      }

      res.status(201).json({ message: "User registered successfully" });
    }
  );
});

router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) {
        console.log("Database query error: ", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (result.length === 0) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const user = result[0];

      try {
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
          return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
          {
            userId: user.id,
            username: user.username,
            email: user.email,
          },
          "jwt-secret-key",
          { expiresIn: "1d" }
        );

        res.cookie("auth_token", token, {
          httpOnly: true,
          secure: true,
          maxAge: 86400000,
        });

        res.status(200).json({ message: "Login sucessful", token });
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );
});

router.post("/logout", (req, res) => {
  res.clearCookie("auth_token", {
    httpOnly: true,
    secure: true,
  });

  res.status(200).json({ message: "Logout Successful" });
});

router.post("/user", authenticateUser, (req, res) => {
  res.status(200).json({ message: "User is authorized" });
});

export default router;
