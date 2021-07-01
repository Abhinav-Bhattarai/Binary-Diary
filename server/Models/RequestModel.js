import mongoose from "mongoose";

const Schema = new mongoose.Schema({
  UserID: {
    type: String
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

const RequestModel = mongoose.model('RequestModel', Schema)

export default RequestModel;