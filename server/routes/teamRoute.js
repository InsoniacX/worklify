import express from "express";
import {
    fetchAllTeams, 
    fetchMyTeams,
    fetchTeamById,
    createTeam,
    updateTeam,
    deleteTeam,
    addMember,
    removeMember,
    updateMemberRole,
} from "../controller/teamController.js";

const router = express.Router();

router.get("/", fetchAllTeams);
router.get("/my", fetchMyTeams);
router.post("/", createTeam);

router.route("/:id")
    .get(fetchTeamById)
    .patch(updateTeam)
    .delete(deleteTeam);

router.post("/:id/members", addMember);
router.delete("/:id/members/:userId", removeMember);

router.patch("/:id/members/:userId/role", updateMemberRole);

export default router;