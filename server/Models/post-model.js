import mongoose from "mongoose";

const Schema = new mongoose.Schema(
  {
    Post: {
      type: String,
      data: Buffer,
      required: true,
    },

    Caption: {
      type: String,
      required: false,
      default: "",
    },

    PostDate: {
      type: String,
      default: new Date(parseInt(Date.now())).toLocaleDateString(),
    },

    CreatorID: {
      type: String,
      required: true,
    },

    CreatorUsername: {
      type: String,
      required: true,
    },

    // Likers ID
    Likes: {
      type: [String],
      default: [],
    },

    // Comment ID
    Comments: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const PostModel = new mongoose.model("PostModel", Schema);

export default PostModel;