import express from "express";
import {
    fetchAllActivities,
    fetchMyActivities,
    fetchTeamActivities,
} from "../controller/activityController.js"

const router = express.Router();

router.get("/", fetchAllActivities);
router.get("/my", fetchMyActivities);
router.get("/team/:teamId", fetchTeamActivities);

export default router;