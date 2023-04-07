import { Schema, model } from "mongoose";

const VideoSchema = Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    imgUrl: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    preview: {
      type: String,
    },
    views: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
    likes: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    dislikes: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    comments: {
      type: [Schema.Types.ObjectId],
      ref: "Comment",
    },
  },
  { timestamps: true }
);

export default model("Video", VideoSchema);
