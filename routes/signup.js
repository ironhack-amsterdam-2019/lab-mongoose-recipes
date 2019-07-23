const express = require('express');
const router = express.Router();
const User = require("../models/User")

router.get('/signup', (req, res, next) => {
  res.render("signup")
});

router.post('/signup', (req, res, next) => {
  /** @todo verify... no empty names and so on */
  if (req.body.username.trim().length <= 0) {
    next(new Error("Empty username is not allowed"))
  }
  if (req.body.password.trim().length <= 0) {
    next(new Error("Empty password is not allowed"))
  }
  let user = {
    username: req.body.username.trim(),
    password: req.body.password.trim()
  }
  User.findOne({
    username: user.username
  }).then(duplicate => {
    if (duplicate) {
      res.render("message", {
        message: "User already exists. Choose another username...",
        link: {
          adress: "/users/signup",
          text: "Signup"
        }
      })
    } else {
      let newUser = new User(user);
      newUser.save().then(() => {
        res.redirect("/")
      }).catch(error => {
        next(error);
      })
    }
  }).catch(error => {
    next(error);
  })
});

module.exports = router;