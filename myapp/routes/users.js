var express = require('express');
var router = express.Router();
var passport = require('passport');
require('../server/db');

var User = require('../server/models/user');

// check user logged in middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();

  console.log("No premission");
  res.redirect('/login');
}
// check if user is   admin middleware
function isAdmin(req, res, next){
  console.log()
  if (req.user && req.user.is_admin)
    return next();
  res.redirect('/login');
}

/* GET users listing. */
router.get('/',isAdmin, (req, res) => {
  console.log(req.session.passport);
  User.find({}).then((result) => {
    res.send(result);
  });
});

/* Signup for new user*
 and passport authentication*/
router.post('/signup', (req, res) => {
  User.find({ username: req.body.username })
    .then(user => {
      if (user.length != 0) {
        return res.status(409).json({
          message: "This username already exists"
        });
      }
      else {
        const user = new User({
          username: req.body.username,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          password: req.body.password,
          is_admin: req.body.is_admin
        });
        user.save()
          .then(result => {
            console.log(result);
            return res.status(201).json({
              message: "User successfully created"
            });
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({
              error: err
            });
          });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});


/* user login */
router.post('/login', passport.authenticate('local'), (req, res) => {
  User.find({ username: req.body.username })
    .then(user => {
      if (user.lenth < 1) {
        return res.status(401).json({
          message: "Authentication failed"
        });
      }
      else {
        user[0].comparePassword(req.body.password, (err, isSame) => {
          if (err || !isSame)
            return res.status(401).json({
              message: "Authentication failed"
            });
          else {
            return res.status(200).json({
              message: "User logged in"
            });
          }
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(401).json({
        message: "Authentication failed"
      });
    });
});

// router.post('/login', passport.authenticate('local', {
//   successRedirect: '/',
//   failureRedirect: '/login'
// }));



/* user delete */
router.delete('/:userId', (req, res) => {
  // not the best practice, doesn't go through middleware
  User.findByIdAndRemove(req.params.userId)
    .then(result => {
      if (!result) {
        return res.status(501).json({
          message: "User not found"
        });
      }
      console.log(result);
      return res.status(204).json({
        message: "User deleted"
      });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({
        error: err
      });
    });
});

/* update user data */
router.put('/:userId', (req, res) => {
  User.findById(req.params.userId)
    .then(user => {
      if (!user)
        return res.status(400).json({
          message : "User not found"
        });

      user.username = req.body.username ? req.body.username : user.name;
      user.firstname = req.body.firstname ? req.body.firstname : user.firstname;
      user.lastname = req.body.lastname ? req.body.lastname : user.lastname;
      user.is_admin = req.body.is_admin ? req.body.is_admin : user.is_admin;

      return user.save();
    })
    .then(() => {
        return res.status(204).send();
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({
        message: err.message
      });
    })
});

module.exports = router;
