import express from "express";
import { 
    fetchAllTask, 
    fetchTaskById, 
    fetchMyTasks, 
    createTask, 
    updateTask,
    deleteTask, 
} from "../controller/taskController.js";

const router = express.Router();

router.get("/", fetchAllTask);
router.get("/my", fetchMyTasks);
router.post("/", createTask);

router.route("/:id")
    .get(fetchTaskById)
    .patch(updateTask)
    .delete(deleteTask)

export default router;