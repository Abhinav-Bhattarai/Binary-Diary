import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const router = express();

router.post("/", (req, res) => {
  const { token, username } = req.body;
  if (token && username) {
    const data = jwt.verify(token, process.env.JWT_AUTH_TOKEN);
    if (data) {
      if (data.Username === username) {
        return res.json({ auth_status: true });
      } else {
        return res.json({ auth_status: false });
      }
    } else {
      return res.json({ auth_status: false });
    }
  } else {
    return res.json({ auth_status: false });
  }
});

export default router;