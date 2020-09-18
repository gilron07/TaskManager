var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../server/models/user');
var { removeEmpty } = require('../server/utils');
var { isAdmin } = require('../server/middlewares');


/* GET users listing. */
router.get('/', isAdmin, (req, res) => {
  console.log(req.session.passport);
  User.find({}).then((result) => {
    res.status(200).json({
      count: result.length,
      users: result
    });
  });
});

/* Signup for new user */
router.post('/signup', (req, res) => {
  User.find({ username: req.body.username })
    .then(user => {
      if (user.length > 0) {
        return res.status(409).json({
          message: "This username already exists"
        });
      }
      else {
        var { username, firstname, lastname, password } = req.body;
        const user = new User({
          username, firstname, lastname, password
        });
        return user.save();
      }
    })
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



/* user delete */
router.delete('/:userId', isAdmin, (req, res) => {
  // not the best practice, doesn't go through middleware
  User.findByIdAndRemove(req.params.userId)
    .then(result => {
      if (!result) {
        return res.status(404).json({
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
router.put('/:userId', isAdmin, (req, res) => {
  User.findById(req.params.userId)
    .then(user => {
      if (!user)
        return res.status(400).json({
          message: "User not found"
        });
      
      //remove empty fields
      removeEmpty(req.body);
      delete req.body.is_admin;
      Object.assign(user, req.body);
      return user.save();
    })
    .then(() => {
      return res.status(200).json({
        message: "User was successfully updated"
      });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({
        message: err
      });
    })
});

module.exports = router;
