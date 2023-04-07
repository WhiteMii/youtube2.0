import express from "express";
import { body } from "express-validator";
import AuthController from "../controllers/auth-controller.js";

const router = express.Router();

// CREATE A USER
router.post(
  "/signup",
  body("email").isEmail(),
  body("password").isLength({ min: 3, max: 32 }),
  AuthController.signup
);
// SIGN IN
router.post("/login", AuthController.login);
//LOG OUT
router.post("/logout", AuthController.logout);
// GOOGLE AUTH
router.post("/google", AuthController.googleAuth);
//  ACTIVATE LINK
router.get("/activate/:link", AuthController.activate);
// REFRESH TOKEN
router.get("/refresh", AuthController.refresh);

export default router;
