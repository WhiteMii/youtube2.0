import { Schema, model } from "mongoose";

const CommentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    videoId: {
      type: Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default model("Comment", CommentSchema);
