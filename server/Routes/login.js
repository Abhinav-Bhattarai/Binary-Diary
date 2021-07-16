import express from "express";
import { LoginMiddleware } from "../Middleware/login-middleware.js";
import RegisterModel from "../Models/register-model.js";
import { GenerateAuthToken } from "./register.js";
import bcrypt from "bcrypt";
import { Encrypt } from "../GraphQL/helper.js";

const router = express.Router();

const CheckPasswordHashing = async (LoginPassword, Hash) => {
  const condition = await bcrypt.compare(LoginPassword, Hash);
  return condition;
};

router.post("/", LoginMiddleware, async (req, res) => {
  try {
    const { Username, Password } = req.body;
    const response = await RegisterModel.findOne({ Username });
    if (response !== null) {
      const password_check = await CheckPasswordHashing(
        Password,
        response.Password
      );
      if (password_check) {
        const token = GenerateAuthToken({
          Username,
          Password,
          Phone: response.Phone,
          id: response._id,
          uid: response.UniqueID,
        });
        const response_data = {
          auth_token: token,
          username: Username,
          id: response._id,
          UniqueID: response.UniqueID,
        };
        const EncryptedString = Encrypt(response_data);
        return res.json({ EncryptedData: EncryptedString, error: false });
      } else {
        return res.json({ error: true, type: "login" });
      }
    } else {
      return res.json({ error: true, type: "login" });
    }
  } catch {
    return res.json({ error: true, type: "login" });
  }
});

export default router;
