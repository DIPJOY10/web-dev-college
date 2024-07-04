//jshint esversion:6
const express=require('express');
const app=express();

app.get("/",function(req,res){
  res.send("HI");
});

app.get("/about",function(req,res){
  res.send("hi I am learning back end.");
});

app.listen("5000",function(){
  console.log("server started on port 5000");
});
