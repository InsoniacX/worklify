import Notification from "../model/notificationModel.js";

export const fetchMyNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .limit(20);
        res.status(200).json(notification);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
} 

export const markAsRead = async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(
            req.params.id,
            { read: true },
            { new: true },
        );
        res.status(200).json({ message: "Notification marked as Read" });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
}

export const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { user: req.user.id, read: false },
            { read: true },
        )
        res.status(200).json({ message: "All Notification marked as Read" })
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
}

export const deleteNotification = async (req, res) => {
    try {
        await Notification.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Notification has been deleted" });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
}