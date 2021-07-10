import mongoose from "mongoose";

const Schema = new mongoose.Schema({
  PostID: {
    type: String,
    required: true,
  },

  Comment: {
    type: String,
    required: true,
  },

  CommenterID: {
    type: String,
    required: true,
  },

  CommenterUsername: {
    type: String,
    required: true,
  },
});

export const CommentModel = mongoose.model("CommentModel", Schema);
