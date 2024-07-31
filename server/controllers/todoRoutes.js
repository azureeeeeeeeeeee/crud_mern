import express from "express";
import db from "../db/db.js";
import authenticateUser from "../middleware/authenticateUser.js";
import prisma from "../db/prismaClient.js";

const router = express.Router();

router.post("/", authenticateUser, async (req, res) => {
  const todo = req.body.todo;
  const userId = req.user.userId;

  await prisma.tasks.create({
    data: {
      name: todo,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });

  return res.status(201).json({ message: "Todo Created" });
});

router.get("/", authenticateUser, async (req, res) => {
  const userId = req.user.userId;

  const allTodos = await prisma.tasks.findMany({
    where: {
      user_id: userId,
    },
  });

  console.log(allTodos);

  res.status(200).json(allTodos);
});

router.delete("/:id", authenticateUser, async (req, res) => {
  const userId = req.user.userId;
  const taskId = parseInt(req.params.id);

  const task = await prisma.tasks.findUnique({
    where: {
      id: taskId,
    },
  });

  console.log(task);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  if (task.user_id !== userId) {
    return res.status(401).json({ message: "User Unauthorized" });
  }

  await prisma.tasks.delete({
    where: { id: taskId },
  });

  //   db.query(
  //     "SELECT user_id FROM tasks WHERE id = ?",
  //     [taskId],
  //     (err, result) => {
  //       if (err) {
  //         console.log("Error fetching data : ", err);
  //         return res.status(500).json({ message: "error fetching data from db" });
  //       }

  //       if (result[0].user_id !== userId) {
  //         return res.status(401).json({ message: "Unauthorized" });
  //       }
  //     }
  //   );

  //   db.query("DELETE FROM tasks WHERE id = ?", [taskId], (err, result) => {
  //     if (err) {
  //       console.log("Database Error : ", err);
  //       return res.status(500).json({ message: "Failed to delete task" });
  //     }
  //     res.status(200).json({ message: "Task deleted successfully" });
  //   });
});

export default router;
