var express = require("express");
var router = express.Router();
var Condo = require("../models/condo");
var middleware = require("../middleware");

//--------------------ROUTES--------------------
//INDEX ROUTE
router.get("/condos", function(req, res){
    Condo.find({}, function(err, allCondos){
        if(err){
            console.log(err);
        }else{
            res.render("condos/index",{condos:allCondos});
        }
    });
});

//CREATE CONDO
router.post("/condos", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCondo = {name:name, price:price, image:image, description:desc, author:author};
    Condo.create(newCondo, function(err, newlyCreated){
        if(err){
            console.log(err);
        }else{
            res.redirect("/condos");
        }
    });
});

//NEW ROUTE 
router.get("/condos/new", middleware.isLoggedIn, function(req, res){
    res.render("condos/new");
});

//SHOW ROUTE
router.get("/condos/:id", function(req,res){
   Condo.findById(req.params.id).populate("comments").exec(function(err, foundCondo){
       if(err || !foundCondo){
            req.flash("error", "Condo not found.");
            res.redirect("back");
       }else{
           console.log(foundCondo);
           res.render("condos/show", {condo: foundCondo}); 
       }
   });
   
})

//EDIT CONDO ROUTE
router.get("/condos/:id/edit", middleware.checkCondoOwnership, function(req, res){
        Condo.findById(req.params.id, function(err, foundCondo){
            res.render("condos/edit", {condo: foundCondo});
        });
});

//UPDATE CONDO
router.put("/condos/:id", middleware.checkCondoOwnership, function(req, res){
    Condo.findByIdAndUpdate(req.params.id, req.body.condo, function(err, updatedCondo){
        if(err){
            res.redirect("/condos");
        }else{
            res.redirect("/condos/" + req.params.id);
        }
    });
});

//DESTROY CONDO
router.delete("/condos/:id", middleware.checkCondoOwnership,  function(req, res){
    Condo.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/condos");
        }else{
            res.redirect("/condos");
        }
    }); 
});

//Exports the code to app.js
module.exports = router;