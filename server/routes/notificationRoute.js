import express from "express";
import {
    fetchMyNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
} from "../controller/notificationController.js";

const router = express.Router();

router.get("/", fetchMyNotifications);
router.patch("/read-all", markAllAsRead);

router.route("/:id")
    .patch(deleteNotification)
    .delete(deleteNotification)

router.patch("/:id/read", markAsRead);

export default router;