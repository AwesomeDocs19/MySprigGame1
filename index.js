// define the sprites in our game
const player = "p";
const box = "b";
const goal = "g";
const goal2 = "w";
const bgst = "f";


///\\\
const POINTS_FOR_SHIELD = 50
///\\\

const PLAYER_SPRITE = bitmap`
................
................
.........0......
........030.....
........030.....
.......04440....
.......04040....
..0....04430....
.0D0..04440.....
.040.04440......
.04004440.......
.0444440........
..00000.........
....0.0.........
....0.0.........
....0.0.........`
const PLAYER_SHIELD_SPRITE = bitmap`
............00..
.............0..
.........0.L.00.
........030.L.0.
........030..L00
.......04440.L.0
.......04040.L.0
..0....04430.L.0
.0D0..04440..L.0
.040.04440...L.0
.04004440...LL00
.0444440....L.0.
..00000....LL.0.
....0.0....L..0.
....0.0...LL.00.
....0.0......0..`

let CURRENT_PLAYER_SPRITE = PLAYER_SPRITE

const updateLegend = () => {
  
// assign bitmap art to each sprite
setLegend(
  [ player, CURRENT_PLAYER_SPRITE],
  [ goal, bitmap`
................
................
................
................
................
................
........0.......
.......0C0......
......0CCC0.....
.....0CCCCC0....
.....0000000....
................
................
................
................
................`],
  [ goal2, bitmap`
................
................
................
................
.......0........
......0C00......
......0CCC00....
.....0CC6CCC0...
....0CCCCCCC0...
...0C6CCCCC6C0..
...0CCCC3CCCCC0.
...000000000000.
................
................
................
................`],
  [bgst, bitmap`
................
................
..............3.
..L.............
................
................
................
......9.........
................
................
................
................
................
...............0
....L...........
................`]
);
}

updateLegend()
setBackground(bgst)

// create game levels
let level = 0; // this tracks the level we are on
const levels = [
  map`
p....
.....
.....
.....
.....`,
];

// set the map displayed to the current level
const currentLevel = levels[level];
setMap(currentLevel);

setSolids([ player, box ]); // other sprites cannot go inside of these sprites

// allow certain sprites to push certain other sprites
setPushables({
  [player]: []
});

onInput("s", () => {
  getFirst(player).y += 1; // positive y is downwards
});

onInput("d", () => {
  getFirst(player).x += 1;
});

onInput("w", () => {
  getFirst(player).y += -1; // positive y is upwards
});

onInput("a", () => {
  getFirst(player).x += -1;
});

let POINTS = 0
let SHIELD = 0

const updateText = () => {
  addText(`Points:${POINTS}`, {
    x: 2,
    y: 15,
    color: color`3`
  })

   addText(`S\n${SHIELD}`, {
    x: 17,
    y: 14,
    color: color`5`
  })
}

const updateShield = () => {
  if (SHIELD > 0) {
    CURRENT_PLAYER_SPRITE = PLAYER_SHIELD_SPRITE
  } else {
    CURRENT_PLAYER_SPRITE = PLAYER_SPRITE
  }

  updateLegend()
}

const addShield = (amount = 1) => {
  SHIELD += amount
  updateShield()
}

const addPoints = () => {
  POINTS += Math.floor((Math.random() * 4) + 1)
  if (POINTS >= POINTS_FOR_SHIELD) {
    POINTS -= POINTS_FOR_SHIELD
    addShield()
  }
  
  updateText()
}

updateText()

const createRandomSprites = (numSprites = -1) => {
  numSprites = numSprites === -1 ? Math.floor(Math.random() * 5) + 1 : numSprites;  
  for (let i = 0; i < numSprites; i++) {
    const randomX = width()-1; // Generate a random x position
    const randomY = Math.floor(Math.random() * height()); // Generate a random y position

    const isCorn = Math.random() <= 0.2
    addSprite(randomX, randomY, isCorn ? goal2 : goal);
  }
}

createRandomSprites();

let newSpawnInterval
let elapsed = 0

const moveRandomSprites = () => {
  const playerSprite = getFirst(player);
  if (!player){
    return
  }
  const randomSprites = [...getAll(goal2),...getAll(goal)];

  randomSprites.forEach(sprite => {
    if (sprite.x === playerSprite.x && sprite.y === playerSprite.y) {
      if (SHIELD > 0) {
        addShield(-1)
      } else {
        playerSprite.remove()
        addText(`You died!\nTime:${elapsed}`, {
          x: 3,
          y: 3,
          color: color`1`
        }) 
      }
    }
    
    if (sprite.x === 0) {
      sprite.remove();
      addPoints()

      if (!newSpawnInterval) {
        newSpawnInterval = setTimeout(() => {
          createRandomSprites()
          newSpawnInterval = undefined
        }, 500)
      }
    } else {
      sprite.x -=1
    }
  });
}

const handlePlayerMovement = (direction) => {
  const playerSprite = getFirst(player);
  const playerX = playerSprite.x;
  const playerY = playerSprite.y;

  const nextX = direction === "left" ? playerX - 1 : direction === "right" ? playerX + 1 : playerX;
  const nextY = direction === "up" ? playerY - 1 : direction === "down" ? playerY + 1 : playerY;

  const spritesInNextTile = getTile(nextX, nextY);
  const randomSpriteCollision = spritesInNextTile.some(sprite => sprite.type === "randomSprite");

  if (!randomSpriteCollision) {
    playerSprite.x = nextX;
    playerSprite.y = nextY;
  }
}

afterInput(handlePlayerMovement)


let moveInterval
const resetMoveInterval = (ms = 500) => {
  if (moveInterval) {
    clearInterval(moveInterval)
  }
  
  moveInterval = setInterval(moveRandomSprites, ms)
}
resetMoveInterval()

setInterval(() => {
  elapsed += 1
  ms = -1
  
  switch (elapsed) {
    case 30:
      ms = 450;
      break;
    case 60:
      ms = 400;
      break;
    case 120:
      ms = 350
      break;
    case 300:
      ms = 300
      break;
    case 600:
      ms = 150;
      break;
    case 800:
      ms = 100;
      break;
    case 2000:
      ms = 50;
      break;
    default:
      break;
  }
  if (ms === -1) {return}
  resetMoveInterval(ms)
  
}, 1000)
