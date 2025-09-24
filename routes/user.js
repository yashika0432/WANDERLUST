const express = require("express");
const req = require("express/lib/request");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const usercontroller = require("../controller/users.js");

router
  .route("/signup")
  .get(usercontroller.rendersignup)
  .post(usercontroller.signup);

router
  .route("/login")
  .get(usercontroller.renderloginform)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    usercontroller.login
  );

router.get("/logout", usercontroller.logout);

module.exports = router;
