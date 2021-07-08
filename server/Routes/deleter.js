import express from "express";
import PostModel from "../Models/post-model.js";
import RegisterModel from "../Models/register-model.js";
import RequestModel from "../Models/RequestModel.js";

const router = express.Router();

router.delete("/", async (req, res) => {
  await RegisterModel.remove();
  await PostModel.remove();
  await RequestModel.remove();
  return res.json({ deleted: true });
});

export default router;
