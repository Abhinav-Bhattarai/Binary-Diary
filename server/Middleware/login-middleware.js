import { Decrypt } from "../GraphQL/helper.js";

export const LoginMiddleware = (req, res, next) => {
    const { ContextData } = req.body;
    const { Username, Password } = Decrypt(ContextData);
    if (Username.length > 4 && Password.length > 7) {
        req.body.Username = Username;
        req.body.Password = Password;
        next();
    } else {
        return res.json({client_config_change: true, error: true});
    }
};