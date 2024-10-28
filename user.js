const express = require("express");

const UserModel = require("../models/userModel");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // To generate Token

const authMiddleware = require('../middleware/expenseMiddleWare');

router.post("/SIGN_UP", (req, res, next) => {
  // Log all signup values
  console.log("Signup Values:", req.body);

  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const User = new UserModel({
        name: req.body.name,
        username: req.body.username,
        gmail: req.body.gmail,
        password: hash, // Encrypt password for security
        userFirstSignUp: req.body.userFirstSignUp,
        category: [...req.body.category],
      });
      User.save()
        .then((result) => {
          const token = jwt.sign(
            { gmail: req.gmail },
            process.env.JWT_KEY,
            { expiresIn: '1h' } // 1 hour
          );
          console.log(result);
          res.status(200).json({
            message: "Account Created",
            status: true,
            data: {
              UserSince: result.userFirstSignUp,
              username: result.username,
              name: result.name,
              token: token,
              expiredToken: 3600,
              userId: result._id,
            },
          });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({
            message: 'Failed to create user',
            error: err.message,
          });
        });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
      });
    });
});

// Other routes...

module.exports = router;
