import ApiError from "../../exceptions/api-error.js";
import UserModel from "../../models/user-model.js";
import VideoModel from "../../models/video-model.js";

class VideoService {
  async addVideo(video, userId) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw ApiError.BadRequest("User wasn't found");
    }
    const { title, desc, imgUrl, videoUrl, tags } = video;
    const newVideo = await VideoModel.create({
      userId,
      title,
      desc,
      imgUrl,
      videoUrl,
      tags,
    });
    newVideo.save();
    return newVideo;
  }
  async updateVideo(videoId, userId, newVideoInfo) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw ApiError.BadRequest("User wasn't found");
    }
    const video = await VideoModel.findById(videoId);
    if (!video) {
      return ApiError.BadRequest(404, "Video wasn't found");
    }
    if (video.userId.toString() === userId) {
      const updatedUser = await VideoModel.findByIdAndUpdate(
        videoId,
        {
          $set: newVideoInfo,
        },
        { new: true }
      );
      return updatedUser;
    } else {
      return ApiError.BadRequest(403, "You can't update not your video");
    }
  }
  async deleteVideo(userId, videoId) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw ApiError.BadRequest("User wasn't found");
    }
    const video = await VideoModel.findById(videoId);
    if (!video) {
      return ApiError.BadRequest(404, "Video wasn't found");
    }
    if (video.userId.toString() === userId) {
      const deletedVideo = await VideoModel.findByIdAndDelete(videoId);
      return deletedVideo;
    } else {
      return ApiError.BadRequest(403, "You can't delete not your video");
    }
  }
  async deleteAllUserVideos(userId) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw ApiError.BadRequest("User wasn't found");
    }
    const videoList = await VideoModel.find({ _id: { $in: user.videos } });
    if (videoList.length !== 0) {
      for (const video of videoList) {
        await VideoModel.deleteOne({ _id: video._id });
      }
    }
  }

  async getVideosFromSubscribeChannels(userId) {
    // To do better
    const user = await UserModel.findById(userId);
    if (!user) {
      throw ApiError.BadRequest("User wasn't found");
    }
    const subscribedChannels = user.subscriptions;
    const list = await Promise.all(
      subscribedChannels.map(async (channelId) => {
        return await Video.find({ userId: channelId });
      })
    );
    return list;
  }
}
export default new VideoService();
