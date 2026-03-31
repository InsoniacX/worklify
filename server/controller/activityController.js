import Activity from "../model/activityModel.js";

export const fetchAllActivities = async (req, res) => {
    try {
        const activities = await Activity.find()
            .populate("user", "name email picture")
            .populate("team", "name")
            .populate("task", "title")
            .sort({ createdAt: -1 })
            .limit(20);
        
        res.status(200).json(activities);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
}

export const fetchMyActivities = async (req, res) => {
    try {
        const activities = await Activity.find({ user: req.user.id })
            .populate("team", "name")
            .populate("task", "title")
            .sort({ createdAt: -1 })
            .limit(20);

        res.status(200).json(activities);
    } catch(err) {
        res.status(500).json({ error: err.message })
    }
} 

export const fetchTeamActivities = async (req, res) => {
    try {
        const activities = await Activity.find({ team: req.params.teamId })
            .populate("user", "name email picture")
            .populate("task", "title")
            .sort({ createdAt: -1 })
            .limit(20)
        res.status(200).json(activities);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
}