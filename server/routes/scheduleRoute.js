import express from "express";
import {
    fetchMySchedules,
    fetchScheduleById,
    createSchedule,
    updateSchedule,
    deleteSchedule
} from "../controller/scheduleController.js";

const router = express.Router();

router.get("/", fetchMySchedules);
router.post("/", createSchedule);

router.route("/:id")
    .get(fetchScheduleById)
    .patch(updateSchedule)
    .delete(deleteSchedule);

export default router;