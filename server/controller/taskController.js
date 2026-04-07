import Activity from "../model/activityModel.js";
import Task from "../model/taskModel.js";
import Notification from "../model/notificationModel.js";
import User from "../model/userModel.js";

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
    const query = {
      $or: [
        { assignedTo: req.user.id },
        { createdBy:  req.user.id },
      ]
    };

    if (status)   query.status   = status;
    if (priority) query.priority = priority;

    const data = await Task.find(query)
      .populate("assignedTo", "name email picture") // ← add this
      .populate("createdBy",  "name email picture")
      .populate("team",       "name")
      .sort({ createdAt: -1 });

    res.status(200).json(data);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
};

export const createTask = async (req, res) => {

    try {
        const { title, description, status, priority, dueDate, assignedTo, team } = req.body;

        const task = new Task({
          title,
          description,
          status,
          priority,
          dueDate: dueDate || null,
          assignedTo: assignedTo || [req.user.id],
          team: team || null,
          createdBy:  req.user.id,
        });
        
        const saved = await task.save();

        if (saved.assignedTo && saved.assignedTo.length > 0) {
        const notifications = saved.assignedTo
            .filter((userId) => userId.toString() !== req.user.id)
            .map((userId) => ({
              message: `You have been assigned to task "${title}"`,
              type:    "task",
              user:    userId,
              link:    `/app/tasks`,
            }));

          if (notifications.length > 0) {
            await Notification.insertMany(notifications);
          }
        }

        try {
            await Activity.create({
                action: "created a task",
                user:   req.user.id,
                task:   saved._id,
                team:   team || null,
                meta:   { taskTitle: title },
            });
        } catch (err) {
            console.log("Activity error:", err.message);
        }
        

        res.status(201).json(saved);
    } catch(err) {
        console.log("ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
}

export const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not Found" });

        const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("assignedTo", "name email picture").populate("createdBy", "name email picture");

        if (req.body.assignedTo) {
        const newMembers = req.body.assignedTo.filter(
            (userId) => !task.assignedTo.map((id) => id.toString()).includes(userId)
        );

        if (newMembers.length > 0) {
            const notifications = newMembers
              .filter((userId) => userId.toString() !== req.user.id)
              .map((userId) => ({
                message: `You have been assigned to task "${updated.title}"`,
                type:    "task",
                user:    userId,
                link:    `/app/tasks`,
              }));

            if (notifications.length > 0) {
              await Notification.insertMany(notifications);
            }
          }
        }

        await Activity.create({
            action: "updated a task",
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
            action: "deleted a task",
            user: req.user.id,
            meta: { taskTitle: task.title },
        });

        res.status(200).json({ message: "Task deleted" });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
}