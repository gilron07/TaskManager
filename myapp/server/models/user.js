const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    username : {type: String, required: true},
    firstname: {type: String, required: false, trim: true},
    lastname : {type: String, required: false, trim: true},
    password : {type: String, required: true},
    is_admin : {type: Boolean, required: false},
});


mongoose.model('users', userSchema);
