import CommentModel from "../../models/comment-model.js";
import VideoModel from "../../models/video-model.js";
import ApiError from "../../exceptions/api-error.js";
import UserModel from "../../models/user-model.js";

class CommentService {
  async addComment(videoId, userId, text) {
    const video = await VideoModel.findById(videoId);
    if (!video) {
      throw ApiError.BadRequest("Video wasn't found", 404);
    }
    const user = await UserModel.findById(userId);
    if (!user) {
      throw ApiError.BadRequest("User wasn't found", 404);
    }
    const comment = await CommentModel.create({
      userId,
      videoId,
      text,
    });
    comment.save();
    await VideoModel.findByIdAndUpdate(videoId, {
      $push: { comments: comment._id },
    });
    return comment;
  }
  async updateComment(userId, videoId, commentId, commentInfo) {
    const video = await VideoModel.findById(videoId);
    if (!video) {
      throw ApiError.BadRequest("Video wasn't found", 404);
    }
    const user = await UserModel.findById(userId);
    if (!user) {
      throw ApiError.BadRequest("User wasn't found", 404);
    }
    const comment = await CommentModel.findById(commentId);
    if (!comment) {
      throw ApiError.BadRequest("Comment wasn't found", 404);
    }

    if (video.comments.includes(commentId)) {
      if (comment.userId.toString() === userId) {
        delete commentInfo.updatedAt;
        const updatedComment = await CommentModel.findByIdAndUpdate(
          commentId,
          {
            $set: commentInfo,
          },
          { new: true }
        );

        return updatedComment;
      } else {
        throw ApiError.BadRequest(
          "You must be the author of the comment to update it",
          403
        );
      }
    } else {
      throw ApiError.BadRequest("Video doesn't contain this comment", 404);
    }
  }
  async deleteComment(userId, videoId, commentId) {
    const video = await VideoModel.findById(videoId);
    if (!video) {
      throw ApiError.BadRequest("Video wasn't found", 404);
    }
    const user = await UserModel.findById(userId);
    if (!user) {
      throw ApiError.BadRequest("User wasn't found", 404);
    }
    const comment = await CommentModel.findById(commentId);
    if (!comment) {
      throw ApiError.BadRequest("Comment wasn't found", 404);
    }
    if (video.comments.includes(commentId)) {
      if (comment.userId.toString() === userId) {
        const deletedComment = await CommentModel.findByIdAndDelete(commentId);
        await VideoModel.findByIdAndUpdate(videoId, {
          $pull: { comments: commentId },
        });
        return deletedComment;
      } else {
        throw ApiError.BadRequest(
          "You must be the author of the comment to delete it",
          403
        );
      }
    } else {
      throw ApiError.BadRequest("Video doesn't contain this comment", 404);
    }
  }
  async getAllComments(videoId) {
    const video = await VideoModel.findById(videoId);
    if (!video) {
      throw ApiError.BadRequest("Video wasn't found");
    }
    const comments = CommentModel.find({ _id: { $in: video.comments } });
    return comments;
  }
  async deleteAllComments(videoId) {
    const video = await VideoModel.findById(videoId);
    if (!video) {
      throw ApiError.BadRequest("Video wasn't found");
    }
    const comments = await CommentModel.find({ _id: { $in: video.comments } });
    if (comments.length !== 0) {
      for (const comment of comments) {
        await CommentModel.deleteOne({ _id: comment._id });
      }
    }
    return comments;
  }
}

export default new CommentService();
