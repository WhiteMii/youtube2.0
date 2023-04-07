import User from "../models/user-model.js";
import VideoModel from "../models/video-model.js";
import VideoService from "../service/Video/video-service.js";
import ApiError from "../exceptions/api-error.js";
import CommentService from "../service/Comments/comment-service.js";

class VideoController {
  async addVideo(req, res, next) {
    console.log("add Video");
    try {
      const newVideo = req.body;
      const userId = req.user.id;
      const savedVideo = await VideoService.addVideo(newVideo, userId);
      return res.json(savedVideo);
    } catch (e) {
      next(e);
    }
  }
  async updateVideo(req, res, next) {
    try {
      const videoId = req.params.id;
      const userId = req.user.id;
      const newVideoInfo = req.body;
      const updatedVideo = await VideoService.updateVideo(
        videoId,
        userId,
        newVideoInfo
      );
      res.json(updatedVideo);
    } catch (e) {
      next(e);
    }
  }
  async deleteVideo(req, res, next) {
    try {
      const videoId = req.params.id;
      const userId = req.user.id;
      await CommentService.deleteAllComments(videoId);
      const deletedVideo = await VideoService.deleteVideo(userId, videoId);
      res.json(deletedVideo);
    } catch (e) {
      next(e);
    }
  }
  async getVideo(req, res, next) {
    try {
      const videoId = req.params.id;
      const video = await VideoModel.findById(videoId);
      res.json(video);
    } catch (e) {
      next(e);
    }
  }

  async addView(req, res, next) {
    try {
      const videoId = req.params.id;
      await VideoModel.findByIdAndUpdate(videoId, {
        $inc: { views: 1 },
      });
      res.json("The view has been increased.");
    } catch (e) {
      next(e);
    }
  }

  async random(req, res, next) {
    try {
      const videos = await VideoModel.aggregate([{ $sample: { size: 20 } }]);
      res.json(videos);
    } catch (e) {
      next(e);
    }
  }

  async trend(req, res, next) {
    try {
      const videos = await VideoModel.find().sort({ views: -1 }).limit(20);
      res.json(videos);
    } catch (e) {
      next(e);
    }
  }

  async getVideosFromSubscribeChannels(req, res, next) {
    try {
      const userId = req.user.id;
      const list = VideoService.getVideosFromSubscribeChannels(userId);
      res.json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
    } catch (e) {
      next(e);
    }
  }

  async getByTag(req, res, next) {
    const tags = req.query.tags.split(",");
    try {
      const videos = await VideoModel.find({ tags: { $in: tags } }).limit(20);
      res.json(videos);
    } catch (err) {
      next(err);
    }
  }

  async search(req, res, next) {
    const query = req.query.q;
    try {
      const videos = await VideoModel.find({
        title: { $regex: query, $options: "i" },
      }).limit(40);
      res.json(videos);
    } catch (e) {
      next(e);
    }
  }
}

export default new VideoController();
