import { Decrypt } from "../GraphQL/helper.js";

export const SignupMiddleware = (req, res, next) => {
  const { ContextData } = req.body;
  const { Username, Password, Confirm, Phone } = Decrypt(ContextData);
  if (
    Username.length > 4 &&
    Password === Confirm &&
    Password.length > 7 &&
    Phone.length >= 10
  ) {
    const number_regex = /[0-9]/;
    if (number_regex.exec(Password)) {
      req.body.Username = Username;
      req.body.Password = Password;
      req.body.Confirm = Confirm;
      req.body.Phone = Phone;
      next();
    } else {
      return res.json({ client_config_change: true, error: true });
    }
  } else {
    return res.json({ client_config_change: true, error: true });
  }
};
