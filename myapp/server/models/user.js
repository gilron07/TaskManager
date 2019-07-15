const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const SaltRounds = 10;

//use bcryptjs to hash password     

const SavedSearchSchema = new Schema({
    userQuery: String
});

const UserSchema = new Schema({
    username: { type: String, required: true },
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    is_admin: { type: Boolean, required: false ,default: false },
    savedSearches: [SavedSearchSchema]
});

UserSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) return next();

    bcrypt.hash(user.password, SaltRounds, (err, hash) => {
        if(err) return next(err);
        user.password = hash;
        console.log(hash);
        next();
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);
