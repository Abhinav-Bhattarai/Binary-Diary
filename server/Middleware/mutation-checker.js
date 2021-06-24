import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const ByPassChecking = (auth_token, UserID) => {
  const data = jwt.verify(auth_token, process.env.JWT_AUTH_TOKEN);
  if (data) {
    if (data.id === UserID) {
      return true;
    }
    return false;
  }
  return false;
};
