import express from "express";
import { authHandler } from "../middlewares/auth-middleware.js";
import CommentController from "../controllers/comment-controller.js";

const router = express.Router();
// ADD COMMENT
router.post("/:id", authHandler, CommentController.addComment);
// UPDATE COMMENT
router.put(
  "/:videoId/:commentId",
  authHandler,
  CommentController.updateComment
);
// DELETE COMMENT
router.delete(
  "/:videoId/:commentId",
  authHandler,
  CommentController.deleteComment
);
// GET ALL COMMENTS
router.get("/:videoId", CommentController.getComments);

export default router;
