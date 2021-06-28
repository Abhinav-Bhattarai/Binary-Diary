import express from "express";
import { RegisterModel } from "../Models/register-model.js";
import { createClient } from "async-redis";
const cache = createClient();
const router = express.Router();

router.get("/", async (req, res) => {
  const { search } = req.body;
  const response = await RegisterModel.find(
    { Username: { $regex: search } },
    {
      _id: 1,
      Username: 1,
    }
  );
  if (response.length > 0) {
    const SerializedData = [];
    response.forEach((data) => {
      const ProfilePicture = await cache.get(`ProfilePicture/${data._id}`);
      SerializedData.push({
        ProfilePicture: ProfilePicture ? ProfilePicture : '',
        Username: data.Username,
      });
    });
    return res.json(SerializedData);
  }
});

export default router;