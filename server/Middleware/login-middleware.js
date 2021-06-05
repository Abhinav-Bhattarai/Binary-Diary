export const LoginMiddleware = (req, res, next) => {
    const { Username, Password } = req.body;
    if (Username.length > 4 && Password.length > 7) {
        next();
    } else {
        return res.json({client_config_change: true, error: true});
    }
};