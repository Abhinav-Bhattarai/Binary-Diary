export const SignupMiddleware = (req, res, next) => {
    const { Username, Password, Confirm, Phone } = req.body;
    if (Username.length > 4 && Password === Confirm && Password.length > 7 && Phone.length >= 10) {
        const number_regex = /[0-9]/;
        if (number_regex.exec(Password)) {
            next()
        }else {
            return res.json({client_config_change: true, error: true});
        }
    }else {
        return res.json({client_config_change: true, error: true});
    }
};