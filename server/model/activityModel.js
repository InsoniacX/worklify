import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        default: null,
    },
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        default: null,
    },
    meta: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },
}, { timestamps: true })

activitySchema.index({ user: 1 });
activitySchema.index({ createdAt: -1 });

export default mongoose.model("Activity", activitySchema);