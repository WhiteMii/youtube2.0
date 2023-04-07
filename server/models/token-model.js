import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default model("Token", UserSchema);
