const nodemailer = require("nodemailer");
const dotenv = require("dotenv")
dotenv.config({path: './config.env'})

const transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    auth: {
        user: process.env.USER,
		pass: process.env.PASS,
        
    },
  });

module.exports = transporter;