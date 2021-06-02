import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
    Username: {
        type: String,
        required: true
    },

    Password: {
        type: String,
        required: true
    },

    Phone: {
        type: Number,
        required: true
    },

    RegistrationDate: {
        type: String,
        default: new Date(parseInt(Date.now())).toLocaleDateString()
    }
});

export const RegisterModel = mongoose.model('RegisterModel', Schema);