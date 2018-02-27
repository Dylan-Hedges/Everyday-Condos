var express = require("express");
var router = express.Router();
var Condo = require("../models/condo");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//NEW COMMENT FORM
router.get("/condos/:id/comments/new", middleware.isLoggedIn, function(req, res){
   Condo.findById(req.params.id, function(err, condo){
       if(err){
           console.log(err);
       }else{
           res.render("comments/new", {condo: condo});
       }
   })
});

//CREATE COMMENT 
router.post("/condos/:id/comments", middleware.isLoggedIn, function(req, res){
   Condo.findById(req.params.id, function(err, condo){
       if(err){
           console.log(err);
           res.redirect("/condos");
       }else{
            Comment.create(req.body.comment, function(err,comment){
                if (err){
                    req.flash("error", "Something went wrong.");
                    console.log(err);
                }else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    condo.comments.push(comment);
                    condo.save();
                    req.flash("success", "Successfully added comment.");
                    res.redirect('/condos/' + condo._id);
                }
            });
       }
   })    
});

//EDIT COMMENT
router.get("/condos/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Condo.findById(req.params.id, function(err, foundCondo){
        if(err || !foundCondo){
            req.flash("error", "No condo found.");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               res.redirect("back");
           }else{
               res.render("comments/edit", {condo_id: req.params.id, comment: foundComment});
           } 
        });
    });
});

//UPDATE COMMENT
router.put("/condos/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/condos/" + req.params.id );
        }
    });
});

//DESTROY COMMENT
router.delete("/condos/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
      if(err){
          res.redirect("back");
      }else{
          req.flash("success", "Comment deleted.");
         res.redirect("/condos/" + req.params.id);
      } 
   });
});

//Exports the code to app.js
module.exports = router;