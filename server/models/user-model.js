import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isActivated: {
      type: Boolean,
      default: false,
    },
    activationLink: {
      type: String,
    },
    img: {
      type: String,
    },
    subscribedUsers: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
    subscriptions: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
    fromGoogle: {
      type: Boolean,
      default: false,
    },
    videos: {
      type: [Schema.Types.ObjectId],
      ref: "Video",
    },
  },
  { timestamps: true }
);

export default model("User", UserSchema);
