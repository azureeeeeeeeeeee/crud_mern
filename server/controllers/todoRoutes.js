import express from "express";
import db from "../db/db.js";
import authenticateUser from "../middleware/authenticateUser.js";

const router = express.Router();

router.post("/", authenticateUser, (req, res) => {
  const todo = req.body.todo;
  const userId = req.user.userId;

  db.query(
    "INSERT INTO tasks (user_id, task) VALUES (?, ?)",
    [userId, todo],
    (err, result) => {
      if (err) {
        console.log("Database error : ", err);
        return res.status(500).json({ message: "Failed to add todo task" });
      }
      res.status(201).json({ message: "Task added successfully" });
    }
  );
});

router.get("/", authenticateUser, (req, res) => {
  const userId = req.user.userId;

  db.query("SELECT * FROM tasks WHERE user_id = ?", [userId], (err, result) => {
    if (err) {
      console.log("Database error : ", err);
      return res.status(500).json({ message: "Failed to add todo task" });
    }
    res.status(201).json(result);
  });
});

router.delete("/:id", authenticateUser, (req, res) => {
  const userId = req.user.userId;
  const taskId = parseInt(req.params.id);

  db.query(
    "SELECT user_id FROM tasks WHERE id = ?",
    [taskId],
    (err, result) => {
      if (err) {
        console.log("Error fetching data : ", err);
        return res.status(500).json({ message: "error fetching data from db" });
      }

      if (result[0].user_id !== userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
    }
  );

  db.query("DELETE FROM tasks WHERE id = ?", [taskId], (err, result) => {
    if (err) {
      console.log("Database Error : ", err);
      return res.status(500).json({ message: "Failed to delete task" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  });
});

export default router;
