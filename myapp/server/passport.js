const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../server/models/user');

module.exports = function (passport) {
    passport.use(new LocalStrategy((username, password, done) => {
        User.findOne({ username: username })
            .then(user => {
                if (!user)
                    return done(null, false, { message: "Username not found" });
                user.comparePassword(password, (err, isMatch) => {
                    if (err) throw err;
                    if (!isMatch) return done(null, false, { message: "Incorrect password" });
                    return done(null, user);
                })
            })
            .catch(err => {
                console.log(err);
            });
    }));

    passport.serializeUser(function (user, done) {
        done(null, {
            id: user.id,
            isAdmin : user.is_admin
        });
    });

    passport.deserializeUser(function (user, done) {
        User.findById(user.id, function (err,user){
            done(err,user);
        });
    });
}