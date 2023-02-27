const express = require("express");
const cors = require("cors");
require("./utils/db");
require("dotenv").config({path: "./.env"})
const port = process.env.PORT || 2233;
const app = express();
const router = require("./routers/userRouter")

app.use(express.json());
app.use(cors());
app.disable('x-powered-by');


app.get("/", (req, res) => {
	res.status(200).json({ message: "You are welcome to the Network" });
});

//Api routes
app.use("/api", router)

app.listen(port, () => {
	console.log("Server is now Active...! on port:" + `${port}`);
});