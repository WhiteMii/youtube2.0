import { isValidObjectId } from "mongoose";
import ApiError from "../../exceptions/api-error.js";
import UserModel from "../../models/user-model.js";
import VideoModel from "../../models/video-model.js";

class UserService {
  async updateUser(registeredUserId, candidateUserId, userInfo) {
    if (registeredUserId === candidateUserId) {
      const user = await UserModel.findById(registeredUserId);
      if (!user) {
        throw ApiError.BadRequest("User wasn't found", 404);
      }
      const updatedUser = await UserModel.findByIdAndUpdate(
        candidateUserId,
        {
          $set: userInfo,
        },
        { new: true }
      );
      return updatedUser;
    } else {
      return ApiError.BadRequest("You can update only your account!", 403);
    }
  }
  async deleteUser(registeredUserId, candidateUserId) {
    if (registeredUserId === candidateUserId) {
      const user = await UserModel.findById(registeredUserId);
      if (!user) {
        throw ApiError.BadRequest("User wasn't found", 404);
      }
      const deletedUser = await UserModel.findByIdAndDelete(candidateUserId);

      return deletedUser;
    } else {
      return ApiError.BadRequest("You can delete only your account!", 403);
    }
  }
  async getUser(userId) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw ApiError.BadRequest("User wasn't found", 404);
    }
    return user;
  }
  async subscribe(userId, userWeWantToSubscribeFor) {
    // check params
    if (!isValidObjectId(userId)) {
      throw ApiError.BadRequest("Invalid user id", 400);
    }
    if (!isValidObjectId(userWeWantToSubscribeFor)) {
      throw ApiError.BadRequest("Invalid channel id", 400);
    }
    const user = await UserModel.findById(userId);
    if (!user) {
      throw ApiError.BadRequest("User wasn't found", 404);
    }
    const channel = await UserModel.findById(userWeWantToSubscribeFor);
    if (!channel) {
      throw ApiError.BadRequest("Channel wasn't found", 404);
    }
    // main logic
    if (
      user.subscriptions.includes(userWeWantToSubscribeFor) &&
      channel.subscribedUsers.includes(userId)
    ) {
      await UserModel.findByIdAndUpdate(userId, {
        $pull: { subscriptions: userWeWantToSubscribeFor },
      });
      await UserModel.findByIdAndUpdate(userWeWantToSubscribeFor, {
        $pull: { subscribedUsers: userId },
      });
      return "Unsubscription was successful";
    } else {
      await UserModel.findByIdAndUpdate(userId, {
        $addToSet: { subscriptions: userWeWantToSubscribeFor },
      });
      await UserModel.findByIdAndUpdate(userWeWantToSubscribeFor, {
        $addToSet: { subscribedUsers: userId },
      });
      return "Subscription was successfull";
    }
  }
  async unsubscribe(userId, userWeWantToSubscribeFor) {
    // // check params
    // if (!isValidObjectId(userId)) {
    //   throw ApiError.BadRequest("Invalid user id", 400);
    // }
    // if (!isValidObjectId(userWeWantToSubscribeFor)) {
    //   throw ApiError.BadRequest("Invalid channel id", 400);
    // }
    // const user = await UserModel.findById(userId);
    // if (!user) {
    //   throw ApiError.BadRequest("User wasn't found", 404);
    // }
    // const channel = await UserModel.findById(userWeWantToSubscribeFor);
    // if (!channel) {
    //   throw ApiError.BadRequest("Channel wasn't found", 404);
    // }
    // // main logic
    // if (
    //   !user.subscriptions.includes(userWeWantToSubscribeFor) &&
    //   !channel.subscribedUsers.includes(userId)
    // ) {
    //   return "User is already unsubscribed from this channel";
    // } else {
    //   await UserModel.findByIdAndUpdate(userId, {
    //     $pull: { subscriptions: userWeWantToSubscribeFor },
    //   });
    //   await UserModel.findByIdAndUpdate(userWeWantToSubscribeFor, {
    //     $pull: { subscribedUsers: userId },
    //   });
    //   return "Unsubscription was successful";
    // }
  }
  async likeVideo(userId, videoId) {
    // check params
    if (!isValidObjectId(userId)) {
      throw ApiError.BadRequest("Invalid user id", 400);
    }
    if (!isValidObjectId(videoId)) {
      throw ApiError.BadRequest("Invalid video id", 400);
    }
    const user = await UserModel.findById(userId);
    if (!user) {
      throw ApiError.BadRequest("User wasn't found", 404);
    }
    const video = await VideoModel.findById(videoId);
    if (!video) {
      throw ApiError.BadRequest("Video wasn't found", 404);
    }
    // main logic
    if (video.likes.includes(userId)) {
      await VideoModel.findByIdAndUpdate(videoId, {
        $pull: { likes: userId },
      });
      return "The video was unliked";
    } else {
      await VideoModel.findByIdAndUpdate(videoId, {
        $addToSet: { likes: userId },
        $pull: { dislikes: userId },
      });
      return "The video has been liked.";
    }
  }
  async dislikeVideo(userId, videoId) {
    // check params
    if (!isValidObjectId(userId)) {
      throw ApiError.BadRequest("Invalid user id", 400);
    }
    if (!isValidObjectId(videoId)) {
      throw ApiError.BadRequest("Invalid video id", 400);
    }
    const user = await UserModel.findById(userId);
    if (!user) {
      throw ApiError.BadRequest("User wasn't found", 404);
    }
    const video = await VideoModel.findById(videoId);
    if (!video) {
      throw ApiError.BadRequest("Video wasn't found", 404);
    }
    // main logic
    if (video.dislikes.includes(userId)) {
      await VideoModel.findByIdAndUpdate(videoId, {
        $pull: { dislikes: userId },
      });
      return "The video was unDisliked";
    } else {
      await VideoModel.findByIdAndUpdate(videoId, {
        $addToSet: { dislikes: userId },
        $pull: { likes: userId },
      });
      return "The video has been disliked.";
    }
  }
}
export default new UserService();
