const mongoose = require("mongoose");
const url = "mongodb://localhost/someTest";

mongoose.set('strictQuery', false);
mongoose.connect(url).then(() => {
	console.log("database is now connected...!");
});

module.exports = mongoose;