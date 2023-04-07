import CommentModel from "../models/comment-model.js";
import CommentService from "../service/Comments/comment-service.js";

class CommentController {
  async addComment(req, res, next) {
    try {
      const { text } = req.body;
      const videoId = req.params.id;
      const userId = req.user.id;
      const savedComment = await CommentService.addComment(
        videoId,
        userId,
        text
      );
      return res.json(savedComment);
    } catch (e) {
      next(e);
    }
  }
  async deleteComment(req, res, next) {
    try {
      const userId = req.user.id;
      const videoId = req.params.videoId;
      const commentId = req.params.commentId;
      const deletedComment = await CommentService.deleteComment(
        userId,
        videoId,
        commentId
      );
      return res.json(deletedComment);
    } catch (e) {
      next(e);
    }
  }
  async updateComment(req, res, next) {
    try {
      const userId = req.user.id;
      const videoId = req.params.videoId;
      const commentId = req.params.commentId;
      const commentInfo = req.body;
      const updatedComment = await CommentService.updateComment(
        userId,
        videoId,
        commentId,
        commentInfo
      );
      return res.json(updatedComment);
    } catch (e) {
      next(e);
    }
  }
  async getComments(req, res, next) {
    console.log("get comments controller");
    const videoId = req.params.videoId;
    try {
      const comments = await CommentService.getAllComments(videoId);
      return res.json(comments);
    } catch (e) {
      next(e);
    }
  }
}

export default new CommentController();
