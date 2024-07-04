var randomNumber1=(Math.random()*6);
randomNumber1=Math.floor(randomNumber1+1);
document.querySelector(".dice .img1").setAttribute("src","images/dice"+randomNumber1+".png");
var randomNumber2=(Math.random()*6);
randomNumber2=Math.floor(randomNumber2+1);
document.querySelector(".dice .img2").setAttribute("src","images/dice"+randomNumber2+".png");
var store;
if(randomNumber1>randomNumber2)
store=1;
else if (randomNumber2>randomNumber1)
store=2;
else
store=0;
if(store!=0)
document.querySelector("h1").innerHTML="Player "+store+" Wins";
else
document.querySelector("h1").innerHTML="Draw!";
