import express from 'express';
import { LoginMiddleware } from '../Middleware/login-middleware.js';
import { RegisterModel } from '../Models/register-model.js';
import { GenerateAuthToken } from './register.js'
import bcrypt from 'bcrypt';

const router = express.Router();

const CheckPasswordHashing = async(LoginPassword, Hash) => {
    const condition = await bcrypt.compare(LoginPassword, Hash);
    return condition;
}

router.post('/', LoginMiddleware, async(req, res) => {
    const { Username, Password } = req.body;
    const response = RegisterModel.findOne({Username});
    if (response) {
        const password_check = CheckPasswordHashing(Password, response.Password);
        if (password_check) {
            const token = GenerateAuthToken({Username, Password, Phone: response.Phone});
            return res.json({auth_token: token});
        }else {
            return res.json({invalid_credential: true});
        }
    }
})

export default router;