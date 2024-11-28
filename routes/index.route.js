const express = require("express");
const route = express.Router({ mergeParams: true });
const Admin = require("../models/admin.model");
const passport = require("passport");
const isLoggedIn = require("../Middlewares/isLoggedIn"); //whether the user exists in the current session or not
const saveRedirectUrl = require("../Middlewares/saveRedirectUrl");

route.get("/", (req, res) => {
  res.render("index/index.ejs");
});
route.get("/aboutus", (req, res) => {
  res.render("index/aboutus.ejs");
});
route.get("/contactus", (req, res) => {
  res.render("index/contactus");
});
route.get("/signup", (req, res) => {
  res.render("index/signup");
});

route.post("/signup", async (req, res, next) => {
  try {
    let { username, password, email, seats, fees } = req.body;
    let admin = new Admin({ username, email, seats, fees });
    let registeredAdmin = await Admin.register(admin, password);
    console.log(registeredAdmin);
    //log user imitiately after the registerations
    req.login(registeredAdmin, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/admin");
    });
  } catch (error) {
    next(error);
  }
});

route.get("/login", (req, res) => {
  res.render("index/login");
});

route.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/admin"
  }),
  async (req, res) => {
    res.redirect(res.locals.redirectUrl);
  }
);

route.get("/logout", isLoggedIn, async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((sessionErr) => {
      if (sessionErr) {
        return next(sessionErr);
      }
      res.clearCookie("connect.sid");
      res.redirect("/");
    });
  });
});


module.exports = route;
