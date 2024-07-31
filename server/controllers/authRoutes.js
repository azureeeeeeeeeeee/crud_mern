import express from "express";
import db from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authenticateUser from "../middleware/authenticateUser.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

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

      const token = crypto.randomBytes(32).toString("hex");
      const userId = queryRes.insertId;

      db.query(
        "INSERT INTO tokens (user_id, token) VALUES (?, ?)",
        [userId, token],
        async (err, tokenRes) => {
          if (err)
            return res
              .status(500)
              .json({ message: "Failed to create verification token" });
          const url = `${process.env.BASE_URL}/api/auth/users/${userId}/verify/${token}`;
          await sendEmail(
            email,
            "Verify your email",
            `Please verify your email by clicking on the following link : ${url}`
          );
        }
      );

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

      if (!user.verified) {
        return res.status(401).json({ message: "User has not been verified" });
      }

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

router.get("/users/:userId/verify/:token", async (req, res) => {
  const { userId, token } = req.params;

  db.query(
    "SELECT * FROM tokens WHERE user_id = ? AND token = ?",
    [userId, token],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Internal server error" });
      }
      if (result.length === 0)
        return res.status(400).json({ message: "Invalid or expired token" });

      db.query(
        "UPDATE users SET verified = TRUE WHERE id = ?",
        [userId],
        (err) => {
          if (err)
            return res.status(500).json({ message: "Failed to update user" });

          db.query(
            "DELETE FROM tokens WHERE user_id = ? AND token = ?",
            [userId, token],
            (err) => {
              if (err)
                return res
                  .status(500)
                  .json({ message: "Failed to delete token" });

              res.status(200).json({ message: "User successfully verified" });
            }
          );
        }
      );
    }
  );
});

export default router;
