var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
// require('../server/db');

var users = mongoose.model('users');

/* GET users listing. */
router.get('/:id', (req, res) => {
  users.find().then((result) => {
    res.send(result);
  });
});

module.exports = router;
