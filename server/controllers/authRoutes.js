import express from "express";
import db from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authenticateUser from "../middleware/authenticateUser.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import prisma from "../db/prismaClient.js";

const router = express.Router();

// @ Register the username (username, email, password)
// @ POST /register
router.post("/register", async (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = await bcrypt.hash(req.body.password, 10);

  if (!username || !email || !password) {
    return res.status(404).json({ message: "Please input credentials" });
  }

  const user = await prisma.user.create({
    data: {
      username: username,
      email: email,
      password: password,
    },
  });

  const token = crypto.randomBytes(32).toString("hex");

  await prisma.token.create({
    data: {
      token: token,
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  const url = `${process.env.BASE_URL}/api/auth/users/${user.id}/verify/${token}`;

  await sendEmail(
    email,
    "Verify your email",
    `Please verify your email by clicking on the following link : ${url}`
  );
});

// @ User login
// @ POST /login
router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "Invalid email" });
  }

  if (!user.verified) {
    return res.status(401).json({ message: "User not verified" });
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
    return res.status(500).json({ message: "Internal server error" });
  }
});

// @ User Logout
// @ POST /logout
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

// @ Verify Token To Verify Email
// @ GET /users/:id/verify/:token
router.get("/users/:userId/verify/:token", async (req, res) => {
  const { userId, token } = req.params;

  const userToken = await prisma.token.findUnique({
    where: {
      user_id: parseInt(userId),
      token,
    },
  });

  console.log(userToken);

  if (!userToken) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  // Verify user email if the token is valid
  await prisma.user.update({
    where: { id: parseInt(userId) },
    data: { verified: true },
  });

  // Delete token from db
  await prisma.token.delete({
    where: {
      user_id: parseInt(userId),
      token,
    },
  });

  res.status(200).json({ message: "User successfully verified" });
});

export default router;
