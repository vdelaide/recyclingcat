// game logic
let inventory = {
  bottles: 0,
  cardboard: 0
};
let canMove = true;
let currentLevel;

const winConditions = {
  // levels in order
  park: {
    bottles: 3,
    cardboard: 0
  }
  
};

let row;
let column;
let currentTile;


// objects
const player = "p";

const bottle = "b";
const cardboard = "y";
const bottleBin = "c";

const wall = "w";
const environment1 = "e";
const environment2 = "f";

// player Sprites, Environment
setLegend(
  [player, bitmap`
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
................
................`],
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

// Movement
const movePause = 175;
const moveSound = tune`
500: B4~500,
500: G4~500 + D5~500,
500: F5^500 + E4^500,
14500`;

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
        getFirst(player).x -= 1;
        break;
      case "right":
        getFirst(player).x += 1;
        break;
        
    };
    
    // prevents zooming across the map
    setTimeout(() => {
      canMove = true;
    }, movePause);
    
  }
}

// Levels
let level = 0;
const levels = [
  map`
p...........
..........w.
........www.
......w.w...
...ww.b.....
...w........
...ww.....ww
..w.w......w
.bw.ww..ww..
bw....w.w...
.w......w.wc
ww....wwwwww`
];

// Maps & Environment
setSolids([player, wall]);

setMap(levels[level]);
setBackground(environment1);

setPushables({
  [ player ]: []
});

// Player input

onInput("w", () => {
  movementControl("up");
});

onInput("a", () => {
  movementControl("left");
});

onInput("s", () => {
  movementControl("down");
});

onInput("d", () => {
  movementControl("right");
});

afterInput(() => {
  row = getFirst(player).x;
  column = getFirst(player).y;

  //checks everything gatito is on
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
        
    }
    
  }
  
});

// recycling and game objectives
function bottlePickup(){

  // as long as gatito has less than 3 items in her inventory
  if ((inventory.bottles + inventory.cardboard) < 2){
    
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
  
  if (inventory.bottles != 0){
    console.log("BOTTLE RECYCLED");
    inventory.bottles = inventory.bottles - inventory.bottles;           
  }
  
};

function fail(){
  console.log("hi")
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
          fail();
          return;
      };
      
      return(
        addText(seconds.toString(), {x: xPos, y: 1, color: color`0`})
      );
      
    };
    
  };

  countdown();

};

// game loop

function initiate(){
  timer();
};

initiate();
