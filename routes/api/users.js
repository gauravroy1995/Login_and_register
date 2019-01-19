const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

//Load user model
const User = require("../../models/Users");

//@route Get api/users/test
//@desc to test
//@access public

router.get("/test", (req, res) => res.json({ msg: "users works" }));

//@route Get api/users/register
//@desc to register
//@access public

router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "email already exists" });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", //size
        r: "pg", //rating
        d: "nm" //default
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        avatar: avatar
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) {
            throw err;
          }
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

//@route Get api/users/login
//@desc to login / Returning JWT
//@access public

router.post("/login", (req, res) => {
  let password = req.body.password;
  let email = req.body.email;

  //check in DB by email

  User.findOne({ email: email }).then(user => {
    if (!user) {
      return res.status(404).json({ email: "User not found" });
    }

    //check pwd

    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //user matched

        //create jwt payload
        const payload = {
          id: user.id,
          name: user.name,
          avatar: user.avatar
        };

        //sign token
        jwt.sign(payload, keys.secret, { expiresIn: 3600 }, (err, token) => {
          res.json({
            success: true,
            token: "Bearer " + token
          });
        });
      } else return res.status(400).json({ password: "password incoorect" });
    });
  });
});

//@route Get api/users/current
//@desc return current suer
//@access private

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ id: req.user.id, name: req.user.name, email: req.user.email });
  }
);

module.exports = router;
