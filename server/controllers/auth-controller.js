import bcrypt from "bcryptjs";
import User from "../models/user-model.js";
import jwt from "jsonwebtoken";
import AuthService from "../service/Auth/auth-service.js";
import { validationResult } from "express-validator";
import ApiError from "../exceptions/api-error.js";

class AuthController {
  async signup(req, res, next) {
    console.log("signup controller");
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Error in Validation", errors.array()));
      }
      const { name, email, password } = req.body;
      const userData = await AuthService.signup(name, email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }
  async login(req, res, next) {
    console.log("Login Controller");
    try {
      const { email, password } = req.body;
      const userData = await AuthService.login(email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }
  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await AuthService.logout(refreshToken);
      res.clearCookie("refreshToken");
      return res.json(token);
    } catch (error) {
      next(error);
    }
  }
  async activate(req, res, next) {
    console.log("activate controller");
    try {
      const activationLink = req.params.link;
      await AuthService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await AuthService.refresh(refreshToken);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (error) {
      next(err);
    }
  }
  async googleAuth(req, res, next) {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        const token = jwt.sign({ id: user._id }, process.env.JWT);
        res
          .cookie("access_token", token, {
            httpOnly: true,
          })
          .status(200)
          .json(user._doc);
      } else {
        const newUser = new User({
          ...req.body,
          fromGoogle: true,
        });
        const savedUser = await newUser.save();
        const token = jwt.sign({ id: savedUser._id }, process.env.JWT);
        res
          .cookie("access_token", token, {
            httpOnly: true,
          })
          .status(200)
          .json(savedUser._doc);
      }
    } catch (err) {
      next(err);
    }
  }
  async getUsers(req, res, next) {
    console.log("get users controller");
    try {
      const users = await AuthService.getAllUsers();
      return res.json(users);
    } catch (e) {
      next(e);
    }
  }
}

export default new AuthController();
