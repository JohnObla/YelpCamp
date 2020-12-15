const express = require("express");
const router = express.Router();
const passport = require("passport");

const users = require("../controllers/users");
const catchAsync = require("../utils/catchAsync");

// Routes
router
  .route("/register")
  .get(users.renderRegister)
  .post(catchAsync(users.register));

router
  .route("/login")
  .get(users.renderLogin)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.login
  );

router.route("/logout").get(users.renderLogout).post(users.logout);

module.exports = router;
