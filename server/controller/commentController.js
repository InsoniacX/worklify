import Comment from "../model/commentModel.js";
import Activity from "../model/activityModel.js";
import User from "../model/userModel.js";
import Task from "../model/taskModel.js";
import Notification from "../model/notificationModel.js";

export const getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ task: req.params.taskId })
            .populate("user", "name email picture")
            .sort({ createdAt: 1 });
        
        res.status(200).json(comments);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
};

export const postComment = async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) res.status(400).json({ message: "Comment Field is Required" });

        const comment = new Comment({
            content,
            task: req.params.taskId,
            user: req.user.id,
        });

        const populated = await comment.populate("user", "name email picture");

        try {
            await Activity.create({
                action: "commented on Task",
                user: req.user.id,
                task: req.params.taskId,
                meta: { content },
            });
        } catch(err) {
            console.error(err.message);
        }

        const saved = await populated.save();

        res.status(200).json(saved);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
}

export const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        await Comment.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Comment has been Deleted" });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
}