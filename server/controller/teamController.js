import Team from "../model/teamModel.js";
import Activity from "../model/activityModel.js";
import Notification from "../model/notificationModel.js";

export const fetchAllTeams = async (req, res) => {
    try {
        const teams = await Team.find()
            .populate("members.user", "name email picture")
            .populate("createdBy", "name email picture")
            .sort({ createdAt: -1 });

        res.status(200).json(teams);
    } catch(err) {
        res.status(500).json({ error: err.message })
    }
}

export const fetchMyTeams = async (req, res) => {
    try {
        const teams = await Team.find({ "members.user": req.user.id })
            .populate("members.user", "name email picture")
            .populate("createdBy", "name email picture");

        res.status(200).json(teams);
    } catch(err) {
        res.status(500).json({ error: err.message })
    }
}

export const fetchTeamById = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id)
            .populate("members.user", "name email picture")
            .populate("createdBy", "name email picture")
        
        if (!team) return res.status(404).json({ message: "Team not Found" });

        res.status(200).json(team);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
}

export const createTeam = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) return res.status(400).json({ message: "Team name is required" });

        const team = new Team({
            name,
            description,
            createdBy: req.user.id,
            members: [{ user: req.user.id, role: "owner" }],
        });

        const saved = await team.save();

        await Activity.create({
            action: "Created a Team",
            user: req.user.id,
            team: saved._id,
            meta: { teamName: name }
        });

        res.status(201).json(saved);
    } catch(err) {
        res.status(500).json({ error: err.message })
    }
}

export const updateTeam = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);
        if (!team) return res.status(404).json({ message: "Team not Found" });

        const updated = await Team.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate("members.user", "name email picture");

        res.status(200).json(updated);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
}

export const deleteTeam = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);
        if (!team) return res.status(404).json({ message: "Team not Found" });

        await Team.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Team has been Deleted" });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
}

export const addMember = async (req, res) => {
    try {
        const { userId, role = "member" } = req.body;
        const team = await Team.findById(req.params.id);
        if (!team) return res.status(404).json({ message: "Team Not Found" });

        const alreadyMember = team.members.some(
            (m) => m.user.toString() === userId
        );

        if (alreadyMember) {
            return res.status(400).json({ message: "This User already a member of this team" });
        }

        team.members.push({ user: userId, role })
        await team.save();

        await Notification.create({
            message: `You have been added to team ${team.name}`,
            type: "team",
            user: userId,
            link: `/app/teams/${team._id}`,
        });

        await Activity.create({
            action: "Added a member to Team",
            user: req.user.id,
            team: team._id,
            meta: { userId, teamName: team.name }
        });

        res.status(200).json(team);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
}

export const removeMember = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);
        if (!team) return res.status(404).json({ message: "Team not Found" });

        team.members = team.members.filter(
            (m) => m.user.toString() !== req.params.userId
        );
        await team.save();

        res.status(200).json(team);
    } catch(err) {
        res.status(500).json({ error: err.message })
    }
}