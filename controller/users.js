const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/users");
const transporter  = require("../utils/email");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_AUTH_VERIFY;
const client = require("twilio")(accountSid, authToken);

//Controller to create user
const createUser = async (req, res, next) => {
	try {
		//get inputs from body
		const { password, email, username,phoneNumber,  interest} = req.body;

		//encrypt password
		const salt = await bcrypt.genSalt(10);
		const hashed = await bcrypt.hash(password, salt);

		//generate random 5 digit number between 1-9
		let randomN = Math.floor(Math.random() * 90000) + 10000;

		//add user to database
		const user = await userModel.create({
			email,
			password: hashed,
			username,
			phoneNumber,
			interest,
			OTP: randomN
		});

		//send random number to user's number (twilio)
		client.messages
		.create({body: randomN, from: '+12764099614', to:'+234' + `${phoneNumber}`})
		.then(message => console.log(message.sid));

		const mailOptions ={
            from: process.env.USER,
			to: email,
			subject: "Account verification",
			html: `
            <h3>
            Thanks for sign up with us ${user.username}, Please click the link below and use the token that will be sent to you to complete the sign up process <a
            href="http://localhost:3000/verify"
            >Link to complete your sign up</a>
            </h3>
            `,
        }

        transporter.sendMail(mailOptions,(err, info)=>{
            if(err){
                console.log(err.message);
            }else{
                console.log("Email has been sent to your inbox", info.response);
            }
        })


		res.status(200).json({
			message: "check you email",
			data: user,
		});
	} catch (error) {
		res.status(404).json({ message: error.message });
		next(error)
	}
};

//verify controller
const verify= async(req, res, next)=>{
	try{
		//get input from body
		const code = req.body.code;

		//matching database with users input
		const userOTP = await userModel.findOne({OTP: code})
		if(userOTP){
			userOTP.OTP = null;
			userOTP.save()
			res.status(200).json({message: "OTP verified"})
		}else {
			res.status(400).json({message: "error occurred"})
		}
	}catch(err){
		next(err)
	}
}

/** POST: http://localhost:8080/api/login 
 * @param: {
"email" : "example@gmail.com",
"password" : "admin123"
}
*/
const login = async(req, res, next)=>{
	try {
		const { email, password } = req.body;

		const user = await userModel.findOne({ email });
		if (user) {
			const check = await bcrypt.compare(password, user.password);
			if (check) {
				if ( user.OTP === null) {
					const { password, ...info } = user._doc;
					const myToken = jwt.sign(
						{
							_id: user._id,
							username: user.username
						},
						"someThinGsiLLy",
						{ expiresIn: "2d" }
					);

					res
						.status(201)
						.json({ message: "welcome back", data: { myToken, ...info } });
				} else {
					res.status(400).json({message: "user not verified"})
				}
			} else {
				res.status(404).json({ message: "Password isn't correct" });
			}
		} else {
			res.status(404).json({ message: "no user found" });
		}
	} catch (error) {
		next(error)
		res.status(404).json({ message: error.message });
	}
}

//Get single user
const getUser = async(req, res, next)=>{
	try{
		const id = req.params.userId;
		const user = await userModel.findById(id);

		res.status(200).json({data: user})

	}catch(err){
		next(err)
	}
}

module.exports ={
	createUser,
	verify,
	login,
	getUser
}