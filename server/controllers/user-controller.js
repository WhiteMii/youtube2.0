import AuthService from "../service/Auth/auth-service.js";
import UserService from "../service/User/user-service.js";
import VideoService from "../service/Video/video-service.js";

class UserController {
  async update(req, res, next) {
    try {
      const registeredUserId = req.user.id;
      const candidateUserId = req.params.id;
      const userInfo = req.body;
      const updatedUser = await UserService.updateUser(
        registeredUserId,
        candidateUserId,
        userInfo
      );
      res.json(updatedUser);
    } catch (e) {
      next(e);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const registeredUserId = req.user.id;
      const candidateUserId = req.params.id;
      const { refreshToken } = req.cookies;
      const token = await AuthService.logout(refreshToken);
      res.clearCookie("refreshToken");
      await VideoService.deleteAllUserVideos(candidateUserId);
      const deletedUser = await UserService.deleteUser(
        registeredUserId,
        candidateUserId
      );
      res.json(deletedUser);
    } catch (e) {
      next(e);
    }
  }

  async getUser(req, res, next) {
    try {
      const userId = req.params.id;
      const user = await UserService.getUser(userId);
      res.json(user);
    } catch (e) {
      next(e);
    }
  }

  async subscribe(req, res, next) {
    try {
      const userId = req.user.id;
      const userWeWantToSubscribeFor = req.params.id;
      const result = await UserService.subscribe(
        userId,
        userWeWantToSubscribeFor
      );
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async unsubscribe(req, res, next) {
    try {
      const userId = req.user.id;
      const userWeWantToSubscribeFor = req.params.id;
      const result = await UserService.unsubscribe(
        userId,
        userWeWantToSubscribeFor
      );
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async like(req, res, next) {
    try {
      const userId = req.user.id;
      const videoId = req.params.videoId;
      const result = await UserService.likeVideo(userId, videoId);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async dislike(req, res, next) {
    try {
      const userId = req.user.id;
      const videoId = req.params.videoId;
      const result = await UserService.dislikeVideo(userId, videoId);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }
}

export default new UserController();
