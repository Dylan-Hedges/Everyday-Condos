var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//ROOT ROUTE
router.get("/", function(req, res){
   res.render("landing"); 
});

//---------------AUTHENTICATION ROUTES--------------------
//REGISTER FORM ROUTE
router.get("/register", function(req, res){
    res.render("register");
});

//SIGN UP LOGIC ROUTE
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome " + user.username + ".");
            res.redirect("/condos");
        });
    });
});

//LOGIN FORM ROUTE
router.get("/login", function(req, res){
   res.render("login"); 
});

//LOGIN LOGIC ROUTE
router.post("/login",  passport.authenticate("local", 
    {
        successRedirect: "/condos",
        failureRedirect: "/login"
    }), function(req, res){
});

//LOGOUT ROUTE
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Log out successful.");
   res.redirect("/condos");
});

//Exports the code to app.js
module.exports = router;