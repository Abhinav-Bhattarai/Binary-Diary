export const SignupMiddleware = (req, res, next) => {
    const { Username, Password, Confirm, Phone } = req.body;
    if (Username.length > 4 && Password === Confirm && Password.length > 7 && Phone.length >= 10) {
        next();
    }else {
        return res.json({client_config_change: true});
    }
};