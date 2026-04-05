import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    }, 
    description: {
        type: String,
        default: "",
    },
    status: {
        type: String,
        enum: ["todo", "in progress", "review", "done"],
        default: "todo",
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium",
    },
    dueDate: {
        type: Date,
        default: null,
    },
    assignedTo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        default: null,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, {timestamps: true});

export default mongoose.model("Task", taskSchema);