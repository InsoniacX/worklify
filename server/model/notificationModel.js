import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["task", "team", "schedule", "system"],
        default: "system",
    },
    read: {
        type: Boolean,
        default: false,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    link: {
        type: String,
        default: null,
    },
}, { timestamp: true });

export default mongoose.model("Notification", notificationSchema);