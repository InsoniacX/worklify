import express from "express";
import { 
    getComments, 
    postComment, 
    deleteComment 
} from "../controller/commentController.js";

const router = express.Router({ mergeParams: true });

router.get("/", getComments);
router.post("/", postComment);
router.delete("/:id", deleteComment);

export default router;