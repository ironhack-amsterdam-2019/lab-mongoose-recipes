const express = require('express');
const router = express.Router();
const User = require("../models/User")
const bcrypt = require('bcrypt');

router.get('/login', (req, res, next) => {
  if (req.session.user) {
    res.render("message", {
      message: "You are already loggin in... You should logout first ;)",
      link: {
        adress: "/users/logout",
        text: "Logout"
      }
    })
    return;
  }
  res.render("login", {
    destination: req.query.destination
  })
});

router.post('/login', (req, res, next) => {
  if (req.session.user) {
    res.render("message", {
      message: "You are already loggin in... You should logout first ;)",
      link: {
        adress: "/users/logout",
        text: "Logout"
      }
    })
    return;
  }
  User.findOne({
      username: req.body.username.trim()
    })
    .then(user => {
      if (!user) {
        res.render("message", {
          message: "Invalid credetials",
          link: {
            adress: "/users/login",
            text: "Back to login"
          }
        })
        return;
      }
      bcrypt.compare(req.body.password.trim(), user.password, function (err, match) {
        if(err) {
          next(error);
          return;
        }
        if(match) {
          req.session.user = user.username.trim();
          if (req.query.destination) {
            res.redirect(req.query.destination);
            return;
          }
          res.redirect("/");
        } else {
          res.render("message", {
            message: "Invalid credetials",
            link: {
              adress: "/users/login",
              text: "Back to login"
            }
          })
        }
      });
    })
    .catch(error => {
      next(error);
    })
});

router.get('/login/forgotpwd', (req, res, next) => {
  if (req.session.user) {
    res.render("message", {
      message: "You are already loggin in... You should logout first ;)",
      link: {
        adress: "/users/logout",
        text: "Logout"
      }
    })
    return;
  }
  res.render("message", {
    message: "You got a problem mate... There is no recovery or password reset here :P",
    link: {
      adress: "/users/signup",
      text: "Go get a new account"
    }
  })
});

module.exports = router;