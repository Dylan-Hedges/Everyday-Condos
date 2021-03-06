var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    Condo           = require("./models/condo"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds");
    
var commentRoutes  = require("./routes/comments"),
    condoRoutes = require("./routes/condos"),
    indexRoutes      = require("./routes/index")

//-----MongoDb Connection-----------------

if (process.env.NODE_ENV === 'production') {
    //Production DB (mlab)
    mongoose.connect(process.env.MLAB_CONNECTION, {useMongoClient: true});
} else {
    //Local DB
    mongoose.connect("mongodb://localhost/everyday_condos", {useMongoClient: true});
}

mongoose.Promise = global.Promise;



app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// seedDB();

//-----PASSPORT CONFIG-----
app.use(require("express-session")({
    secret: "THIS IS USED TO ENCODE",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
app.use(indexRoutes);
app.use(condoRoutes);
app.use(commentRoutes);

//--------------------LISTENER--------------------
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Every Condos Server has started") 
});