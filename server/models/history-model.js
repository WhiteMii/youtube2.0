import { Schema, model } from "mongoose";

const HistorySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  videos: {
    type: [Schema.Types.ObjectId],
    ref: "Video",
  },
});

export default model("History", HistorySchema);
