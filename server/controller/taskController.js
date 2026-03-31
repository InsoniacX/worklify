import Activity from "../model/activityModel.js";
import Task from "../model/taskModel.js";

export const fetchAllTask = async (req, res) => {
    try {
        const { status, priority, page = 1, limit = 10 } = req.query;
        
        const query = {};
        if (status) query.status = status;
        if (priority) query.priority = priority;

        const skip = (Number(page) - 1) * Number(limit);
        const total = await Task.countDocuments(query);
        const data = await Task.find(query)
            .populate("assignedTo", "name email picture")
            .populate("createdBy", "name email picture")
            .populate("team", "name")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))

        res.status(200).json({
            data,
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / Number(limit))
        })
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
}

export const fetchTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate("assignedTo", "name email picture")
            .populate("createdBy", "name email picture")
            .populate("team", "name")

        if (!task) return res.status(404).json({ message: "Task Not Found" })
        res.status(200).json(task)
    } catch(err) {
        res.status(500).json({ error: err.message })
    }
}

export const fetchMyTasks = async (req, res) => {
    try {
        const { status, priority } = req.query;
        const query = { assignedTo: req.user.id };

        if (status) query.status = status;
        if (priority) query.priority = priority;

        const data = await Task.find(query)
            .populate("createdBy", "name email picture")
            .populate("team", "name")
            .sort({ createdAt: -1 })
    } catch(err) {

    }
}

export const createTask = async (req, res) => {
    try {
        const { title, description, status, priority, dueDate, assignedTo, team } = req.body;

        if (!title) return res.status(400).json({ message: "Title is Required" })
        
        const task = new Task({
            title,
            description,
            status,
            priority,
            dueDate,
            assignedTo,
            team,
            createdBy: req.user.id,
        });

        const saved = await task.save();

        await Activity.create({
            action: "Created a Task",
            user: req.user.id,
            task: saved._id,
            team: team || null,
            meta: { taskTitle: title },
        });

        res.status(201).json(saved);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
}

export const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not Found" });

        const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("assignedTo", "name email picture").populate("createdBy", "name email picture");

        await Activity.create({
            action: "Updated a Task",
            user: req.user.id,
            task: updated._id,
            meta: { taskTitle: updated.title },
        })

        res.status(200).json(updated);
    } catch(err) {
        res.status(500).json({ error: err.message })
    }
}

export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not Found" });

        await Task.findByIdAndDelete(req.params.id);

        await Activity.create({
            action: "Deleted a Task",
            user: req.user.id,
            meta: { taskTitle: task.title },
        });

        res.status(200).json({ message: "Task deleted" });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
}