import express from 'express';
import { RegisterModel } from '../Models/register-model.js';

const router = express.Router();

router.delete('/', async(req, res) => {
    await RegisterModel.remove();
    return res.json({deleted: true});
})

export default router;