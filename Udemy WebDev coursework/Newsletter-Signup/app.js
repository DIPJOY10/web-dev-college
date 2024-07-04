// jshint esversion:6
const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const https=require("https");

const app=express();

app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
  app.use(express.static("public"));
  res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req,res){
const fName=req.body.fName;
const lName=req.body.lName;
const email=req.body.email;
console.log(fName,lName,email);

const data={
  members:[
    {
    email_address: email,
    status:"subscribed",
    merge_fields:{
      FNAME:fName,
      LNAME:lName
    }
  }]
};

const jsonData=JSON.stringify(data);

const url="https://us8.api.mailchimp.com/3.0/lists/99a8b2751c";

const options={
  method:"post",
  auth:"dipjoy10:0946eae2e31887dd66b7734bea52cf89-us8"
};

const request=https.request(url,options,function(response){
response.on("data",function(data){
  console.log(JSON.parse(data));});
  if(response.statusCode===200)
  res.sendFile(__dirname+"/success.html");
  else
  res.sendFile(__dirname+"/failure.html");
});
request.write(jsonData);
request.end();
});

app.post("/failure",function(req,res){
  res.redirect("/");
});


app.listen(process.env.PORT || 3000,function(){
  console.log("Server running on port 3000");
});

//Mailchimp API Key
//0946eae2e31887dd66b7734bea52cf89-us8

//List ID
//99a8b2751c
