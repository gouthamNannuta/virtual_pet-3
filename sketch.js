//Create variables here
var dog,happyDog,database,foodS,foodStock;
var feedThePet,addFood;
var fedTime,lastFed;
var foodObj;
var FoodStock;
var gameState=0,readState;
var bedroomimg,gardenimg,washroomimg;

function preload()
{
  //load images here
  bedroomimg=loadImage("virtual pet images/Bed Room.png");
  gardenimg=loadImage("virtual pet images/Garden.png");
  washroomimg=loadImage("virtual pet images/Wash Room.png");
  dogimg=loadImage("images/dogImg.png");
  happyDogimg=loadImage("images/dogImg1.png");
  sadDog=loadImage("virtual pet images/Lazy.png")
  getTime();
}

function setup() {
  database = firebase.database();
  createCanvas(700, 700);

  dog=createSprite(550,250,40,40);
  dog.addImage(dogimg);
  dog.scale=0.25;

  foodObj=new Food(10,10,50,50);

  foodStock=database.ref('Foods');
  foodStock.on("value",readStock);
  
  feed=createButton("Feed the dog ");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
 
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });
}


function draw() {  
background(46,139,87)

fedTime=database.ref('FeedTime');
fedTime.on("value",function(data){
  lastFed=data.val();
})
currentTime=hour();
if(currentTime==(lastFed+1)){
  update("playing");
  foodObj.garden();
  }else if(currentTime==(lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();
  } else if(currentTime>(lastFed+2)&&currentTime<=(lastFed+4)){
     update("Bathing");
     foodObj.washroom();
  }else{
    update("Hungry")
    foodObj.display();
  }

if(gameState !="Hungry"){
  feed.hide();
  addFood.hide();
  dog.remove();
}else{
  feed.show();
  addFood.show();
  dog.addImage(sadDog);
}

drawSprites();
textSize(30);
fill(0);
stroke(255);
text("food remaining :   "   +foodS,250,130);

  //add styles here
  fill(255,255,254);
  noStroke();
  textSize(15);
  if(lastFed>=12){
    text("last Fed:"+lastFed%12+"PM",350,30);
  }else if(lastFed===0){
  text("last Fed:12 AM",350,30);
  }else{
    text("last Fed:"+lastFed+"AM",350,30);
  }
}
function update(state){
  database.ref('/').update({
    gameState:state
  });
  
}

function writeStock(x){

  if(x<=0){
    x=0;
  }else{
    x=x-1;
  }

  database.ref('/').update({
    Foods:x
  })
}


function readStock(data){
  foodS=data.val();
}
async function getTime(){
  var response = await fetch("http://worldtimeapi.org/api/timezone/Asia/Kolkata");
  var responseJSON = await response.json();
  var datetime = responseJSON.datetime;
  var hour = datetime.slice(11,13);
  //console.log(hour);
  
}
function feedDog(){
  dog.addImage(happyDogimg);

  if(foodS>0){
    foodS=foodS-1;
    }
    
 database.ref('/').update({
 Food:foodS,
 FeedTime:hour()
})

}

function addFoods(){
  dog.addImage(dogimg);
  foodS++
  database.ref('/').update({
    Foods:foodS
  })
}