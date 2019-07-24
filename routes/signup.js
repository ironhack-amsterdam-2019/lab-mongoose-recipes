const express = require('express');
const router = express.Router();
const User = require("../models/User")

const bcrypt = require('bcrypt');
const saltRounds = 12;

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
    username: req.body.username.trim()
  }
  let userPromise = User.findOne({
    username: user.username
  })
  let hashPromise = new Promise((resolve, reject) => {
    bcrypt.hash(req.body.password.trim(), saltRounds, function (err, hash) {
      if (err) reject(err)
      resolve(hash)
    });
  });
  Promise.all([hashPromise, userPromise]).then(([hash, duplicate]) => {
    if (duplicate) {
      res.render("message", {
        message: "User already exists. Choose another username...",
        link: {
          adress: "/users/signup",
          text: "Signup"
        }
      })
    } else {
      user.password = hash;
      let newUser = new User(user);
      newUser.save().then(() => {
        req.session.user = user.username.trim();
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