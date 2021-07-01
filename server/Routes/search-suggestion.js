import express from "express";
import { RegisterModel } from "../Models/register-model.js";
import redis from "async-redis";
const cache = redis.createClient();
const router = express.Router();

router.get("/:search", async (req, res) => {
  const { search } = req.params;
  const response = await RegisterModel.find(
    { Username: { $regex: search } },
    {
      _id: 1,
      Username: 1,
    }
  ).limit(10);
  console.log(response);
  if (response.length > 0) {
    const SerializedData = [];
    for (let data of response) {
      const ProfilePicture = await cache.get(`ProfilePicture/${data._id}`);
      SerializedData.push({
        ProfilePicture: ProfilePicture ? ProfilePicture : '',
        Username: data.Username,
        id: data._id
      });
    }
    return res.json(SerializedData);
  }
  return res.json([]);
});

export default router;