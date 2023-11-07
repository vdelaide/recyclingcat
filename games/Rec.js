/*

Recycling Cat by @vdelaide on Github and Discord

Description: 
You're a wandering cat living her best life, until, you look around
and see the people of the world for what they really are; litterbugs.
At that realization, Gatita would make it her life's mission to
recycle all that she can, to the best of her ability.

How to Play:
Pick up litter by moving close to it, and take it to a recycling bin
You only have 2 slots in your inventory

W to move up, A to move left, S to move down, D to move right
J to select, K to restart, L to xyz, I to xyz

*/

// game logic

let canMove = true;
let inventory = {
  bottles: 0,
  cardboard: 0
};

const winConditions = {
  // levels in order
  park: {
    bottles: 3,
    cardboard: 0
  },
  
  highway: {
    bottles: 10,
    cardboard: 0
  },

  campsite: {
    bottles: 15,
    cardboard: 0
  }
  
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
const cardboard = "y";
const bottleBin = "c";

const wall = "w";
const environment1 = "e";
const environment2 = "f";

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

const movePause = 175;
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
............
p.......w.b.
......www...
....w.w.....
.ww.b....b..
.w....bb....
.ww...b.ww..
w.w.b....w..
w.ww..ww....
....w.w.....
.b....w.wc..
....wwwwww..`, //park, room 1
  map`
............
............
............
............
............
............
............
............
............
............
............
............`, //park, room 2
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
...................` //end screen
];

// Maps & Environment
setSolids([player, wall]);

setMap(levels[level]);
setBackground(environment1);

setPushables({
  [ player ]: []
});

// ###############################################
// ############### GAME OBJECTIVES ###############
// ###############################################

function bottlePickup(){

  // as long as gatita has less than 3 items in her inventory
  if ((inventory.bottles + inventory.cardboard) < 2){

    //needs to be specified
    getFirst(bottle).remove();
    inventory.bottles += 1;
    
    addText("Bottle picked up!", {y: 4, color: color`5`});
    
    /*
    setTimeout(() => {
      clearText();
    }, 1000);
    */
    
  };
    
};

function recycle(){
  /*
  either keep track of bottles and cardboard in a variable, 
  or only keep track of it in inventory?
  probably the first one
  */
  
  // if the player's inventory is not the same as the winconditions of the level
  // and the player has bottles, then add bottles to inventory
  // keep doing this until the inventory does match up to winconditions
  if (inventory != winConditions[(level + 1)]){
    if (inventory.bottles != 0){
      console.log("BOTTLE(S) RECYCLED: " + inventory.bottles);
      inventory.bottles -= inventory.bottles;           
    };
  } else{
    console.log("YAYYY U WIN");
  };
  
};

function nextRoom(y){
  setMap(levels[y])
};

function nextLevel(currentLevel){
  setMap(levels[x])
};

function timer(){
  let seconds = 180;
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

// #########################################
// ############### GAME LOOP ###############
// #########################################

function displayTitle(){
  clearText();
  
  addText("RECYCLING CAT", {x: 3, y:2, color: color`0`});
  addText("by me :3", {x: 3, y: 3, color: color`0`});
  
  addText("START", {x: 3, y: 5, color: color`0`});
  addText("MISC", {x: 3, y: 6, color: color`0`});
  addText("MISC", {x: 3, y: 7, color: color`0`});
  addText("CREDITS", {x: 3, y: 8, color: color`0`});

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
    
    getFirst(player).y -= 1;
    
    if (getFirst(player).y < 5 && level === 0) {
      getFirst(player).y = 8;
    }
    
  })

  onInput("s", () => {
  
    getFirst(player).y += 1;
    
    if (getFirst(player).y > 8 && level === 0) {
      getFirst(player).y = 5;
    };

    if (getFirst(player).y > 6 && level === 4){
      getFirst(player).y = 5;
    };
    
  })
  
  onInput("j", () => {

    if (level === 0){
      
      switch (getFirst(player).y){
        
        case 5: //start game
          startGame();
          break;
          
        case 6: //misc
          break;
          
        case 7: //misc
          break;
          
        case 8: //credits
          break;
          
      };
      
    };
    
  })
  
};

function startGame(){
  clearText();
  level = 1;
  setMap(levels[level]); //park
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

  /*
  I deeply and genuinely apologize to all on god's green and blue earth
  that must witness this abomination
  
  for those wondering how the movement works:
  *the player sprite is both the cursor and the kitty cat
  *at the start, the player is just the cursor and can only move up, down,
  and press J to select
  *when starting, the player is then given the ability to move left and right,
  and finally turned into the cat sprite
  *all W, S, and J presses will, after the start screen, have to check
  what level it's on each time, even if it's not on the start screen
  **To sum it all up: movement is fragmented in 2 functions, and 6 conditional
  statements, all in different parts of the game that'll never ever interact
  with each other again
  ***i tried :)
  */
  
  function movementControl(direction){
    
    if (canMove === true){
      
      canMove = false;
      
      switch(direction){
          
        case "up":
          getFirst(player).y -= 1;
          break;
          
        case "down":
          getFirst(player).y += 1;
          break;
          
        case "left":
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
      
    }
  }
  
  
  onInput("a", () => {
    movementControl("left");
  });
  
  onInput("d", () => {
    movementControl("right");
  });
  
  afterInput(() => {
    row = getFirst(player).x;
    column = getFirst(player).y;
  
    //checks everything gatita is on
    currentTile = getTile(row, column);
  
    if (currentTile[1]){
      
      switch (currentTile[1].type){
          
        // waterbottle
        case "b":
          bottlePickup();
          break;
          
        // recycling bin
        case "c":
          recycle();
          break;
  
        case "o":
          nextRoom();
          break;
          
      }
      
    };
    
  });
  
};

// potentially an unnecessary function
function initiate(){
  displayTitle();
  
};

initiate();
