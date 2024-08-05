// define the sprites in our game
const player = "p";
const box = "b";
const goal = "g";
const wall = "w";

// assign bitmap art to each sprite
setLegend(
  [ player, bitmap`
................
................
................
.........3......
.........3......
........444.....
........404.....
........443.....
..D....444......
..4...444.......
..4..444........
..44444.........
................
................
................
................`],
  [ goal, bitmap`
................
................
................
................
................
................
................
........C.......
.......CCC......
......CCCCC.....
................
................
................
................
................
................`],
  [ wall, bitmap`
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000`]
);

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

setSolids([ player, box, wall ]); // other sprites cannot go inside of these sprites

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

const createRandomSprites = () => {
  const numSprites = Math.floor(Math.random() * 5) + 1; // Generate a random number of sprites between 1 and 5
  for (let i = 0; i < numSprites; i++) {
    const randomX = Math.floor(Math.random() * width()); // Generate a random x position
    const randomY = Math.floor(Math.random() * height()); // Generate a random y position
    addSprite(randomX, randomY, goal);
  }
}

createRandomSprites();

const moveRandomSprites = () => {
  const playerSprite = getFirst(player);
  const randomSprites = getAll(goal);

  randomSprites.forEach(sprite => {
    if (sprite.x > playerSprite.x) {
      sprite.x -= 1;
    } else if (sprite.x === playerSprite.x) {
      sprite.remove();
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
