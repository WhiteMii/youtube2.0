import express from "express";
import UserController from "../controllers/user-controller.js";
import { authHandler } from "../middlewares/auth-middleware.js";

const router = express.Router();

//UPDATE USER
router.put("/:id", authHandler, UserController.update);
//DELETE USER
router.delete("/:id", authHandler, UserController.deleteUser);
//GET USER
router.get("/find/:id", UserController.getUser);
//SUBSCRIBE TO CHANNEL
router.put("/sub/:id", authHandler, UserController.subscribe);
//UNSUBSCRIBE TO CHANNEL
router.put("/unsub/:id", authHandler, UserController.unsubscribe);
//LIKE A VIDEO
router.put("/like/:videoId", authHandler, UserController.like);
//DISLIKE A VIDEO
router.put("/dislike/:videoId", authHandler, UserController.dislike);

export default router;
