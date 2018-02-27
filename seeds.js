var mongoose = require("mongoose");
var Condo = require("./models/condo");
var Comment = require("./models/comment");

//Array of starter data
var data = [
    {
        name: "Clouds Rest", 
        image: "http://www.photosforclass.com/download/3694766056",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        name: "Desert", 
        image: "http://www.photosforclass.com/download/769733695",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."    
    },
    {
        name: "Moutain", 
        image: "http://www.photosforclass.com/download/3694766056",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    }
];

function seedDB(){
    Condo.remove({}, function(err){
        if(err){
            console.log(err);
        }
            console.log("removed condos!"); 
            data.forEach(function(seed){
            Condo.create(seed, function(err,condo){
                if(err){
                    console.log(err);
                }else{
                    console.log("Added a condo");
                    Comment.create(
                        {
                            text: "This is great, but i want internet",
                            author: "Homer"
                        }, function(err,comment){
                            if(err){
                                console.log(err);
                            }else{
                                condo.comments.push(comment);
                                condo.save();
                                console.log("Created new comment");
                            }
                        });
                }
            });
        });
    }); 
}

module.exports = seedDB;