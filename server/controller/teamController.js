import Team from "../model/teamModel.js";
import Activity from "../model/activityModel.js";
import Notification from "../model/notificationModel.js";
import User from "../model/userModel.js";

/**
 * Fetch All Teams in the Database
 * METHOD: GET
 * URL: http://localhost:8080/api/team
 */
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

/**
 * Fetch Users Team
 * METHOD: GET
 * URL: http://localhost:8080/api/team/my
 */
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

/**
 * Fetch Team By ID
 * METHOD: GET
 * URL: http://localhost:8080/api/team/:id
 */
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

/**
 * Create a Team
 * METHOD: POST
 * URL: http://localhost:8080/api/team
 */
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

/**
 * Update Team Information
 * METHOD: PATCH
 * URL: http://localhost:8080/api/team/:id
 */
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

/**
 * DELETE Team
 * METHOD: DELETE
 * URL: http://localhost:8080/api/team/:id
 */
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

/**
 * Add Member to the Team
 * METHOD: POST
 * URL: http://localhost:8080/api/:id/members
 */
export const addMember = async (req, res) => {
    try {
        console.log("step 1 - Initialazing Form");
        const { email, userId, role = "member" } = req.body;

        console.log("email received:", email);
        const userToAdd = await User.findOne({ email });
        if (!userToAdd) {
            res.status(404).json({ message: "User not Found" })
        }

        const team = await Team.findById(req.params.id);
        if (!team) return res.status(404).json({ message: "Team Not Found" });
        console.log("Finish");

        console.log("step 2 - Check if user is already member");
        const alreadyMember = team.members.some(
            (m) => m.user.toString() === userId
        );
        
        if (alreadyMember) {
            return res.status(400).json({ message: "This User already a member of this team" });
        }
        console.log("Finish");

        console.log("step 3 - Push new Member to an members array");
        team.members.push({ user: userToAdd._id, role })
        await team.save();
        console.log("Finish")

        console.log("step 4 - Push new Notification to added Member")
        await Notification.create({
            message: `You have been added to team ${team.name}`,
            type: "team",
            user: userId,
            link: `/app/teams/${team._id}`,
        });
        console.log("finish");

        console.log("step 4 - Create a new Activity")
        await Activity.create({
            action: "Added a member to Team",
            user: req.user.id,
            team: team._id,
            meta: { userId, teamName: team.name }
        });
        console.log("Finish");

        res.status(200).json(team);
    } catch(err) {
        // res.status(500).json({ error: err.message });
        console.error(err);
    }
}

/**
 * Remove member from the Team
 * METHOD: DELETE
 * URL: http://localhost:8080/api/team/:id/members/:userId
 */
export const removeMember = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);
        const member = await Team.findById(req.params.userId);
        if (!team) return res.status(404).json({ message: "Team not Found" });

        team.members = team.members.filter(
            (m) => m.user.toString() !== req.params.userId
        );
        await team.save();

        await Activity.create({
            action: "Remove a member from Team",
            user: req.user.id,
            team: team._id,
            meta: { member, teamName: team.name }
        });

        res.status(200).json(team);
    } catch(err) {
        res.status(500).json({ error: err.message })
    }
}

/**
 * Update Member Role
 * METHOD: PATCH
 * URL: http://localhost:8080/api/team/:id/members/:userId/role
 */
export const updateMemberRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["admin", "member"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: "Team not found" });

    // Check if requester is owner
    const requester = team.members.find(
      (m) => m.user.toString() === req.user.id
    );
    if (!requester || requester.role !== "owner") {
      return res.status(403).json({ message: "Only the owner can change roles" });
    }

    const member = team.members.find(
      (m) => m.user.toString() === req.params.userId
    );
    if (!member) return res.status(404).json({ message: "Member not found" });

    const oldRole = member.role;
    member.role   = role;
    await team.save();

    await Notification.create({
      message: `Your role in team "${team.name}" has been changed from ${oldRole} to ${role}`,
      type:    "team",
      user:    req.params.userId,
      link:    `/app/teams`,
    });

    await Activity.create({
      action: "updated member role",
      user:   req.user.id,
      team:   team._id,
      meta:   { userId: req.params.userId, oldRole, newRole: role, teamName: team.name },
    });

    res.status(200).json(team);
  } catch (error) {
    console.log("updateMemberRole error:", error.message);
    res.status(500).json({ error: error.message });
  }
};