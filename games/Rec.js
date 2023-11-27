/*
Recycling Cat by Me :3

Description: 
You're a wandering cat living her best life, until, you look around
and see the people of the world for what they really are; litterbugs.
At that realization, Gatita would make it her life's mission to
recycle all that she can, to the best of her ability.

How to Play:
Pick up litter by moving onto to it, and take it to a recycling bin
You only have 2 slots in your inventory

W to move up, A to move left, S to move down, D to move right
J to select, K to restart, L to xyz, I to xyz

*/

/*
TODO:
*Make background music
*tidy things up
*create other title screens
*fix cardboard bug
*/

/*
THEMES FOR THE GAME:
*Cave
*Lost cat toys?
*/

// game logic

let weight = 0;
let totalObjsInLevel;

let canMove = true;
let inventory = {
  bottles: 0,
  cardboard: 0
};

let row;
let column;
let currentTile;

// objects
const player = "p";
let playerBitmap =  bitmap`
................
................
................
................
.....777777.....
....77777777....
...7777777777...
...7777777777...
...7777777777...
...7777777777...
...7777777777...
....77777777....
.....777777.....
................
................
................`;

const bottle = "b";
const cardboard = "d";
const bottleBin = "c";

const wall = "w";
const environment1 = "e";

// Movement

setLegend(
  [player, playerBitmap],
  [bottle, bitmap`
................
....00000.......
....02120.......
....00000.......
.....070........
....07770.......
...0777270......
...0777270......
....55525.......
...0777770......
...0777770......
....55555.......
...0777770......
...0000000......
................
................`],
  [cardboard, bitmap`
................
................
................
................
................
................
....CCCCCC......
....CCCCCC......
....CCCCCCC.....
....CCCCCCC.....
....CCCCCCC.....
.....CCCCCC.....
.....CCCC.......
................
................
................`],
  [bottleBin, bitmap`
................
................
................
................
................
................
................
...444444444....
...444424444....
....4424244.....
....4242424.....
....4424244.....
.....44244......
.....44444......
................
................`],
  [wall, bitmap`
CCCCCCCCCCCCCCCC
CCCCCCCC11CFCCCC
CCCCCC111CFFCCCC
C33C11CCCFFCCCCC
CCC113FFFFFFCCCC
CCC1FFFF3333C1CC
CC1FCFFCCCC331CC
CC1FFFCCCCC33C1C
CC1FFF3CCCC3CC1C
CC1FCFFCCC3CCC1C
CC1FFF3F3C3CCC1C
C1CCCFFFF33CC1CC
C11CCC11FFF111CC
CC1111CC1111FCCC
CCCCCCCCCCCFFCCC
CCCCCCCCCCCCCCCC`],
  [environment1, bitmap`
2222222222222222
2222222222222222
2222222222222222
2222222222222222
2222222222222222
2222222222222222
2222222222222222
2222222222222222
2222222222222222
2222222222222222
2222222222222222
2222222222222222
2222222222222222
2222222222222222
2222222222222222
2222222222222222`]
);

// sound

const movePause = 175;
const titleSound = tune`
500: C5~500 + E5~500,
500: F5^500 + D5^500,
500: G5^500 + E5^500,
500,
500: A4^500 + B4^500,
500: A4^500,
500,
500: C5~500 + E5~500,
500: D5^500 + F5^500,
500: E5^500 + G5^500,
500,
500: B4^500 + A4^500,
500: A4^500,
9500`;
const moveSound = tune`
500: B4~500,
500: G4~500 + D5~500,
500: F5^500 + E4^500,
14500`;
  
// Levels
let level = 0;
const levels = [
  map`
...................
...................
...................
...................
...................
.p.................
...................
...................
...................
...................
...................
...................
...................
...................
...................
...................`, //title screen
  map`
p...........
wwwwwwwwwww.
wwwwwwwwwww.
...b....b...
.wwwwww.....
.w....w.....
.w....w..w..
.w....w..w..
.w....w..c..
.w....w.....
.wwwwww....b
.b..........`, //park
  map`
c.....ee....
............
....w.......
....w....b..
....w....b..
.........bb.
.....ww...b.
......ww....
.......w....
.....ww.....
.p..ww......
....w.......`, //park 2
  map`
...................
...................
...................
...................
...................
.p.................
...................
...................
...................
...................
...................
...................
...................
...................
...................
...................` //park 3
];

// Maps & Environment
setSolids([player, wall]);

setMap(levels[level]);
setBackground(environment1);

// ###############################################
// ############### GAME OBJECTIVES ###############
// ###############################################

function nextLevel(){
  setMap(levels[level]);

  totalObjsInLevel = tilesWith(bottle);
  weight = 0;
};

function timer(){
  let seconds = 300;
  const timerInterval = setInterval(countdown, 1000);
  
  function countdown(){
    seconds -= 1;
    dinglebob(14);
    
    function dinglebob(xPos){
      clearText();
      
      if (10 <= seconds && seconds < 100){
          xPos = 15;
        
      } else if (0 <= seconds && seconds < 10){     
          xPos = 16;
        
      } else if (seconds < 1){
          clearInterval(timerInterval);
          return;
      };
      
      return(
        addText(seconds.toString(), {x: xPos, y: 1, color: color`0`})
      );
      
    };
    
  };

  countdown();

};

function movementControl(direction){
  if (canMove === false){
    return;
  }      
  
  canMove = false;
  
  switch(direction){

    case "up":
      getFirst(player).y -= 1;
    
      if (getFirst(player).y < 5 && level === 0) {
        getFirst(player).y = 7;
      };
      break;
      
    case "down":
      getFirst(player).y += 1;

      if (getFirst(player).y > 7 && level === 0) {
        getFirst(player).y = 5;
      };
      break;
      
    case "left":
      if (level === 0){
        break;
      }
      playerBitmap = bitmap`
................
................
................
................
...0...00.......
...100010.......
.0.0000000..0...
..0600600....0..
.0.0000000...0..
....22222....0..
....22200...0...
....02000000....
...200020000....
................
................
................`;
      getFirst(player).x -= 1;
      break;
      
    case "right":
      if (level === 0){
        break;
      }
      playerBitmap = bitmap`
................
................
................
................
.......00...0...
.......010001...
...0..0000000.0.
..0....0060060..
..0...0000000.0.
..0....22222....
...0...00222....
....00000020....
....000020002...
................
................
................`;
      getFirst(player).x += 1;
      break;
  };

  // If need be revise the below for better performance
  setLegend(
    [player, playerBitmap],
    [bottle, bitmap`
  ................
  ....00000.......
  ....02120.......
  ....00000.......
  .....070........
  ....07770.......
  ...0777270......
  ...0777270......
  ....55525.......
  ...0777770......
  ...0777770......
  ....55555.......
  ...0777770......
  ...0000000......
  ................
  ................`],
    [bottleBin, bitmap`
  ................
  ................
  ................
  ................
  ................
  ................
  ................
  ...444444444....
  ...444424444....
  ....4424244.....
  ....4242424.....
  ....4424244.....
  .....44244......
  .....44444......
  ................
  ................`],
    [wall, bitmap`
  CCCCCCCCCCCCCCCC
  CCCCCCCC11CFCCCC
  CCCCCC111CFFCCCC
  C33C11CCCFFCCCCC
  CCC113FFFFFFCCCC
  CCC1FFFF3333C1CC
  CC1FCFFCCCC331CC
  CC1FFFCCCCC33C1C
  CC1FFF3CCCC3CC1C
  CC1FCFFCCC3CCC1C
  CC1FFF3F3C3CCC1C
  C1CCCFFFF33CC1CC
  C11CCC11FFF111CC
  CC1111CC1111FCCC
  CCCCCCCCCCCFFCCC
  CCCCCCCCCCCCCCCC`],
    [environment1, bitmap`
  2222222222222222
  2222222222222222
  2222222222222222
  2222222222222222
  2222222222222222
  2222222222222222
  2222222222222222
  2222222222222222
  2222222222222222
  2222222222222222
  2222222222222222
  2222222222222222
  2222222222222222
  2222222222222222
  2222222222222222
  2222222222222222`]
  );
  
  // prevents zooming across the map
  setTimeout(() => {
    canMove = true;
  }, movePause);
    
};

// #########################################
// ############### GAME LOOP ###############
// #########################################

function displayTitle(){
  clearText();
  
  addText("RECYCLING CAT", {x: 3, y:2, color: color`0`});
  addText("by me :3", {x: 3, y: 3, color: color`0`});
  
  addText("START", {x: 3, y: 5, color: color`0`});
  addText("HOW TO PLAY", {x: 3, y: 6, color: color`0`});
  addText("OPTIONS", {x: 3, y: 7, color: color`0`});

  getFirst(player).bitmap = bitmap`
................
................
................
................
.....777777.....
....77777777....
...7777777777...
...7777777777...
...7777777777...
...7777777777...
...7777777777...
....77777777....
.....777777.....
................
................
................`;

  onInput("w", () => {
    movementControl("up");
  })

  onInput("a", () => {
    movementControl("left");
  });

  onInput("s", () => {
    movementControl("down");
  })

  onInput("d", () => {
    movementControl("right");
  });
  
  onInput("j", () => {

    if (level === 0){
      
      switch (getFirst(player).y){
        
        case 5: //start game
          startGame();
          break;
          
        case 6: //how to play
          clearText();
          addText("KEYS: ", {x: 1, y: 2, color: color`0`});
          addText("------", {x: 1, y: 3, color: color`0`});
          addText("WASD to move", {x: 1, y: 4, color: color`0`});
          
          addText("OBJECTIVE:", {x: 1, y: 6, color: color`0`});
          addText("-----------", {x: 1, y: 7, color: color`0`});
          addText("Collect all trash", {x: 1, y: 8, color: color`0`});
          addText("within all levels,", {x: 1, y: 9, color: color`0`});
          addText("and put them in", {x: 1, y: 10, color: color`0`});
          addText("the correct bins", {x: 1, y: 10, color: color`0`});
          break;
          
        case 7: //options
          break;
          
      };
      
    };
    
  })
  
};

function startGame(){
  clearText();
  level = 1;
  setMap(levels[level]); //park
  totalObjsInLevel = tilesWith(bottle);
  console.log("sofaslkdfj" + totalObjsInLevel);
  timer();

  playerBitmap = bitmap`
................
................
................
................
.......00...0...
.......010001...
...0..0000000.0.
..0....0060060..
..0...0000000.0.
..0....22222....
...0...00222....
....00000020....
....000020002...
................
................
................`;
  setLegend([player, playerBitmap]);
  
  afterInput(() => {
    //checks everything gatita is on
    row = getFirst(player).x;
    column = getFirst(player).y;
  
    currentTile = getTile(row, column);
  
    if (!currentTile[1]){
      return;
    };
        
    switch (currentTile[1].type){
      // waterbottle
      case "b":
        if (weight > 3){
          return;
        };
        
        currentTile[1].remove();
        weight += 1;
        inventory.bottles += 1;
        break;
        
      // recycling bin
      case "c":
        totalObjsInLevel = tilesWith(bottle);
        inventory.bottles = 0;
        
        weight = 0;
        console.log(totalObjsInLevel);
        
        // Moves player to next level if the necessary objects are collected
        // (by weight)
        if (totalObjsInLevel.length === 0){
          level += 1;
          nextLevel();
          return;
        };
        break
      
    };
    
  });
  
};

displayTitle();
