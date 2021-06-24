import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

import { SignupMiddleware } from "../Middleware/signup-middleware.js";
import { RegisterModel } from "../Models/register-model.js";
import { Encrypt } from "../GraphQL/helper.js";

const router = express.Router();

const HashPassword = async (Password) => {
  const HashedPassword = await bcrypt.hash(Password, 10);
  return HashedPassword;
};

export const GenerateAuthToken = (data) => {
  const token = jwt.sign(data, process.env.JWT_AUTH_TOKEN);
  return token;
};

const GenerateUniqueID = () => {
  return Math.floor(Math.random() * 100000000);
};

router.post("/", SignupMiddleware, async (req, res) => {
  const { Username, Password, Phone } = req.body;
  const response = await RegisterModel.find({ Username });
  if (response.length === 0) {
    const HashedPassword = await HashPassword(Password);
    const UniqueID = GenerateUniqueID();
    const data = {
      Username,
      Password: HashedPassword,
      Phone: parseInt(Phone),
      UniqueID,
    };
    const RegisterData = new RegisterModel(data);
    const registered_data = await RegisterData.save();
    const token = GenerateAuthToken({
      ...data,
      id: registered_data._id,
      uid: UniqueID,
    });
    const response_data = {
      auth_token: token,
      id: registered_data._id,
      username: Username,
      UniqueID,
    };
    const EncryptedString = Encrypt(response_data);
    return res.json({ EncryptedData: EncryptedString, error: false });
  } else {
    return res.json({ error: true, type: "signup" });
  }
});

export default router;