import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js";
import commentRoutes from "./routes/comments.js";
import videoRoutes from "./routes/videos.js";
import authRoutes from "./routes/auth.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import errorHandler from "./middlewares/error-middleware.js";

dotenv.config();

const PORT = process.env.PORT || 8800;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/auth", authRoutes);
app.use(errorHandler);

const start = async () => {
  try {
    app.listen(PORT, () => {
      connect();
      console.log(`Server started on Port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

const connect = async () => {
  await mongoose.connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

start();
