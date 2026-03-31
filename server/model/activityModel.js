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
        type: Object,
        default: {},
    },
}, { timestamp: true })

export default mongoose.model("Activity", activitySchema);