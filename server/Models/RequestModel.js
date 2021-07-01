import mongoose from "mongoose";

const Schema = new mongoose.Schema({
  UserID: {
    type: String,
    required: true,
  },

  Requests: {
    type: [
      {
        extenderID: String,
        Username: String,
      },
    ],
    default: [],
  },
});

export default Schema;