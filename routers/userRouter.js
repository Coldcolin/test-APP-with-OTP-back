const express = require("express")
const router = express.Router();
const {createUser, verify,login, getUser} = require("../controller/users.js");


/** POST Methods */
router.post("/register", createUser)//create a new user
router.post("/login", login)//login a user
router.post("/verify", verify)//verify user with OTP
router.get("/user/userId", getUser)//get single user


module.exports = router