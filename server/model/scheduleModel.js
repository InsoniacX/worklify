import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    date: {
        type: Date,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["meeting", "deadline", "reminder", "event"],
        default: "event",
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
    }
}, { timestamps: true });

export default mongoose.model("Schedule", scheduleSchema);