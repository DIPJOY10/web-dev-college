//jshint esversion:6
const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const ejs=require('ejs');

app.set("view-engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect('mongodb://localhost:27017/wikiDB',{useNewUrlParser:true,useUnifiedTopology:true});

const articleSchema={
  title:String,
  content:String
};

const Article=mongoose.model("Article",articleSchema);

////////////////////////////////////Targetting all articles//////////
app.route("/articles")
.get(function(req,res){
  Article.find(function(err,foundItems){
    if(!err)
    res.send(foundItems);
    else
    res.send(err);
  });
})
.post(function(req,res){
  const newArticle=new Article({
    title:req.body.title,
    content:req.body.content
  });

  newArticle.save(function(err){
    if(!err)
    res.send("Successfully added the document!");
    else
    res.send(err);
  });
})
.delete(function(req,res){
  Article.deleteMany(function(err){
    if(err)
    res.send(err);
    else
    res.send("Successfully deleted all articles!");
  });
});

////////////////////////////////Targetting a Specific Article//////////////////
app.route("/articles/:articleTitle")
.get(function(req,res){
  Article.findOne({title:req.params.articleTitle},function(err,foundArticle){
    if(!err)
    res.send(foundArticle);
    else
    res.send(err);
  });
})
.put(function(req,res){
  Article.updateOne({title:req.params.articleTitle},
  {title:req.body.title,content:req.body.content},
  {overwrite:true},
  function(err){
    if(!err)
    res.send("Successfully updated the article!");
    else
    res.send(err);
  });
})
.patch(function(req,res){
  Article.updateOne({title:req.params.articleTitle},
  {$set:req.body},
  function(err){
    if(!err)
    res.send("Successfully updated the fields required!");
    else
    res.send(err);
  });
})
.delete(function(req,res){
  Article.deleteOne({title:req.params.articleTitle},function(err){
    if(!err)
    res.send("Successfully deleted the article specified!");
    else
    res.send(err);
  });
});

app.listen(3000,function(){
  console.log("Server started on port 3000");
});
