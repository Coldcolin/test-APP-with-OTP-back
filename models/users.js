const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username : {
        type: String,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        unique : false,
    },
    email: {
        type: String,
        required : [true, "Please provide a unique email"],
        unique: true,
    },
    phoneNumber: {
        type: Number,
        required : [true, "Please provide a unique number"],
        unique: true,
    },
    interest: {
        type: String,
    },
    OTP:{
        type: Number
    }
});

const userModel = mongoose.model('User', UserSchema);

module.exports = userModel