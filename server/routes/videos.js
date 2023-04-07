import express from "express";
import VideoController from "../controllers/video-controller.js";
import { authHandler } from "../middlewares/auth-middleware.js";
const router = express.Router();

//  CREATE VIDEO
router.post("/", authHandler, VideoController.addVideo);
//  UPDATE VIDEO
router.put("/:id", authHandler, VideoController.updateVideo);
//  DELETE VIDEO
router.delete("/:id", authHandler, VideoController.deleteVideo);
//  GET VIDEO
router.get("/find/:id", VideoController.getVideo);
//  ADD VIEW VIDEO
router.put("/view/:id", VideoController.addView);
//  GET MOST POPULAR VIDEOS
router.get("/trend", VideoController.trend);
//  GET RANDOM VIDEOS
router.get("/random", VideoController.random);
//  SUBSCRIBE VIDEO
router.get("/sub", authHandler, VideoController.getVideosFromSubscribeChannels);
//  GET VIDEOS BY TAGS
router.get("/tags", VideoController.getByTag);
//  SEARCH VIDEOS
router.get("/search", VideoController.search);
export default router;
