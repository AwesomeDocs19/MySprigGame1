// Define the sprites in our game
const player = "p";
const box = "b";

const goal = "z";
const goal2 = "y";
const goal3 = "x";

const bgst = "f";

const POINTS_FOR_SHIELD = 50;

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
....0.0.........`;
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
....0.0......0..`;

let CURRENT_PLAYER_SPRITE = PLAYER_SPRITE;
let POINTS = 0;
let SHIELD = 0;
let level = 0;
let elapsed = 0;
let newSpawnInterval;
let moveInterval;

const goalSprites = [goal, goal2, goal3];

const levels = [
  map`
p....
.....
.....
.....
.....`,
];

// Function to update the legend
const updateLegend = () => {
  setLegend(
    [player, CURRENT_PLAYER_SPRITE],
    
    [goal, bitmap`
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
    [goal2, bitmap`
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
    [goal3, bitmap`
................
................
...000000.......
..00CCCC0.......
..0CCCCC00000...
..0C0CCCCCCD0...
..0CCCCCCCCD00..
..000CCC3CDCC00.
....0CDCCCDCCC0.
...D0C0CCCDD.C0.
....0CCDCC0CCC0.
....0CCDCCCCC00.
....00000CCCC0..
........0CC000..
........0000....
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
................`],
  );
};

// Function to update the text
const updateText = () => {
  addText(`Points:${POINTS}`, {
    x: 2,
    y: 15,
    color: color`3`
  });

  addText(`S\n${SHIELD}`, {
    x: 17,
    y: 14,
    color: color`5`
  });
};

// Function to update the shield
const updateShield = () => {
  CURRENT_PLAYER_SPRITE = SHIELD > 0 ? PLAYER_SHIELD_SPRITE : PLAYER_SPRITE;
  updateLegend();
};

// Function to add shield
const addShield = (amount = 1) => {
  SHIELD += amount;
  updateShield();
};

// Function to add points
const addPoints = () => {
  POINTS += Math.floor((Math.random() * 4) + 1);
  if (POINTS >= POINTS_FOR_SHIELD) {
    POINTS -= POINTS_FOR_SHIELD;
    addShield();
  }
  updateText();
};

// Function to create random sprites
const createRandomSprites = (numSprites = -1) => {
  numSprites = numSprites === -1 ? Math.floor(Math.random() * 5) + 1 : numSprites;
  for (let i = 0; i < numSprites; i++) {
    const randomX = width() - 1;
    const randomY = Math.floor(Math.random() * height());
    const goalSprite = goalSprites[Math.floor(Math.random() * goalSprites.length)];
    addSprite(randomX, randomY, goalSprite);
  }
};

// Function to move random sprites
const moveRandomSprites = () => {
  const playerSprite = getFirst(player);
  if (!playerSprite) return;
  
  const randomSprites = goalSprites.map(g => getAll(g)).flat()
  randomSprites.forEach(sprite => {
    if (sprite.x === playerSprite.x && sprite.y === playerSprite.y) {
      if (SHIELD > 0) {
        addShield(-1);
      } else {
        playerSprite.remove();
        addText(`You died!\nTime:${elapsed}`, {
          x: 3,
          y: 3,
          color: color`1`
        });
      }
    }
    
    if (sprite.x === 0) {
      sprite.remove();
      addPoints();

      if (!newSpawnInterval) {
        newSpawnInterval = setTimeout(() => {
          createRandomSprites();
          newSpawnInterval = undefined;
        }, 500);
      }
    } else {
      sprite.x -= 1;
    }
  });
};

// Function to handle player movement
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
};

// Function to reset move interval
const resetMoveInterval = (ms = 500) => {
  if (moveInterval) {
    clearInterval(moveInterval);
  }
  
  moveInterval = setInterval(moveRandomSprites, ms);
};

// Initialize the game
const initGame = () => {
  updateLegend();
  setBackground(bgst);
  setMap(levels[level]);
  setSolids([player, box]);
  setPushables({ [player]: [] });
  updateText();
  createRandomSprites();
  resetMoveInterval();
};

initGame();

// Input handlers
onInput("s", () => handlePlayerMovement("down"));
onInput("d", () => handlePlayerMovement("right"));
onInput("w", () => handlePlayerMovement("up"));
onInput("a", () => handlePlayerMovement("left"));

// Interval to update elapsed time and adjust move interval
setInterval(() => {
  elapsed += 1;
  let ms = -1;

  switch (elapsed) {
    case 30:
      ms = 450;
      break;
    case 60:
      ms = 400;
      break;
    case 120:
      ms = 350;
      break;
    case 300:
      ms = 300;
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
  if (ms !== -1) resetMoveInterval(ms);

}, 1000);
