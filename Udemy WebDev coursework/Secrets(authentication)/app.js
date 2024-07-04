//jshint esversion:6
require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const encrypt=require('mongoose-encryption');
//const md5=require('md5');
// const bcrypt=require('bcrypt');
// const saltRounds=10;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
//setting up session
app.use(session({
  secret: "This a secret for the website",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
//setting up mongoose for db
mongoose.connect("mongodb://localhost:27017/secretDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set("useCreateIndex", true);

const accountSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId:String,
  secret:String
});
//level 2 security
//encryption using mongoose-encryption package
// accountSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});
accountSchema.plugin(passportLocalMongoose);
accountSchema.plugin(findOrCreate);

const User = new mongoose.model("User", accountSchema);

passport.use(User.createStrategy());
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
//creating new google strategy for oauth 2.0 authentication
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL:"https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    //console.log(profile);
    User.findOrCreate({
      googleId: profile.id
    }, function(err, user) {
      return cb(err, user);
    });
  }
));

app.get("/", function(req, res) {
  res.render("home");
});
//sign in route
app.get("/auth/google",
    passport.authenticate("google", { scope: ["profile"]})
);
//get request for redirect url
app.get("/auth/google/secrets",
  passport.authenticate('google', {prompt: 'select_account',
    failureRedirect: '/login'
  }),
  function(req, res) {
    // Successful authentication, redirect secrets.
    res.redirect('/secrets');
  });
//anonymous secrets route
app.get("/secrets", function(req, res) {
  User.find({secret:{$ne:null}},function(err,foundUsers){
    if(err)
    console.log(err);
    else{
      if(foundUsers)
      res.render("secrets",{foundUsers:foundUsers});
    }
  });
});
//get requests for register and login,submit and logout routes
app.get("/register", function(req, res) {
  res.render("register");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/submit",function(req,res){
  if (req.isAuthenticated())
    res.render("submit");
  else
    res.redirect("/login");
});

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

//post requests for submit,register and login routes

app.post("/submit",function(req,res){
  const submittedSecret=req.body.secret;
  User.findById(req.user.id,function(err,foundUser){
    if(err)
    console.log(err);
    else{
      foundUser.secret=submittedSecret;
      foundUser.save(function(){
        res.redirect("/secrets");
      });
    }
  })
});

//level 1 security using basic registration
app.post("/register", function(req, res) {
  User.register({
    username: req.body.username
  }, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/secrets");
      });
    }
  });
  //level 4 through salting with saltrounds
  // bcrypt.hash(req.body.password,saltRounds,function(err,hash){
  //   const user=new User({
  //     username:req.body.username,
  //     password:hash //level 3 with md5 converted to level 4 security using salting with bcrypt through hashing using md5
  //   });
  //   user.save(function(err){
  //     if(err)
  //     console.log(err);
  //     else
  //     res.render("secrets");
  //   });
  // });
});

app.post("/login", function(req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });
  req.login(user, function(err) {
    if (err)
      console.log(err);
    else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/secrets");
      });
    }
  });
  // User.findOne({username:req.body.username},function(err,foundUser){
  //   if(foundUser){
  //     bcrypt.compare(req.body.password,foundUser.password,function(err,result){
  //       if(result===true)
  //       res.render("secrets");
  //       else
  //       res.send("wrong password");
  //     });
  //   }
  //   else
  //   res.send("no matching email found");
  // });
});

app.listen(3000, function() {
  console.log("Server running on port 3000");
});
