const mongoose = require('mongoose');
//require('./models/user');
//require('./models/project');

const dbname = "taskmgr";
const url = `mongodb://localhost:27017/${dbname}`;

// establish connection 
mongoose.connect(url, {useNewUrlParser: true}, (err) => {
    if (err) throw err;
    console.log("Succesfully connected to MongoDB");
});