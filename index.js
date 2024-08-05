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
  [ box, bitmap`
................
................
................
................
................
.....L..........
....LL..........
...LLL..........
....LL..........
.....L111.......
......111.......
......111.......
......111.......
......111.......
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
p..g.
..g.g
.bg..
g.g.g
.g.g.`,
  map`
p....
gggg.
gggg.
.b...
g.g..`,
  map`
p.gg.
.b...
gg..g
g.g..
.g.g.`,
  map`
p....
p.gg.
p.g.g
p.g.g
p...b`,
  map`
ggg
gpg
ggb`,
  map`
p..g
..wg
gg..
.gbg`
];

// set the map displayed to the current level
const currentLevel = levels[level];
setMap(currentLevel);

setSolids([ player, box, wall ]); // other sprites cannot go inside of these sprites

// allow certain sprites to push certain other sprites
setPushables({
  [player]: []
});

// inputs for player movement control
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


// input to reset level
onInput("j", () => {
  const currentLevel = levels[level]; // get the original map of the level

  // make sure the level exists before we load it
  if (currentLevel !== undefined) {
    clearText("");
    setMap(currentLevel);
  }
});

// these get run after every input
afterInput(() => {
  // count the number of tiles with goals
  const targetNumber = tilesWith(goal).length;
  
  // count the number of tiles with goals and boxes
  const numberCovered = tilesWith(goal, box).length;

  // if the number of goals is the same as the number of goals covered
  // all goals are covered and we can go to the next level
  if (numberCovered === targetNumber) {
    // increase the current level number
    level = level + 1;

    const currentLevel = levels[level];

    // make sure the level exists and if so set the map
    // otherwise, we have finished the last level, there is no level
    // after the last level
    if (currentLevel !== undefined) {
      setMap(currentLevel);
    } else {
      addText("you win!", { y: 4, color: color`3` });
    }
  }
  // Player movement controls
onInput("w", () => movePlayer("up"));
onInput("a", () => movePlayer("left"));
onInput("s", () => movePlayer("down"));
onInput("d", () => movePlayer("right"));

// Function to handle player movement and box pushing
const movePlayer = (direction) => {
  const playerSprite = getFirst(player);
  const playerX = playerSprite.x;
  const playerY = playerSprite.y;

  // Calculate the next coordinates based on the direction
  const nextX = direction === "left" ? playerX - 1 : direction === "right" ? playerX + 1 : playerX;
  const nextY = direction === "up" ? playerY - 1 : direction === "down" ? playerY + 1 : playerY;

  // Find the sprites in the next tile
  const spritesInNextTile = getTile(nextX, nextY);

  // Check if there is a box in the next tile to push
  const boxToPush = spritesInNextTile.find(sprite => sprite.type === box);

  if (boxToPush) {
    // Calculate the next coordinates for the box
    const nextBoxX = direction === "left" ? nextX - 1 : direction === "right" ? nextX + 1 : nextX;
    const nextBoxY = direction === "up" ? nextY - 1 : direction === "down" ? nextY + 1 : nextY;

    // Check if the next tile is empty or has a goal
    if (!getTile(nextBoxX, nextBoxY).some(sprite => sprite.type === wall)) {
      // Move both the player and the box one block
      playerSprite.x = nextX;
      playerSprite.y = nextY;
      boxToPush.x = nextBoxX;
      boxToPush.y = nextBoxY;
    }
  } else {
    // Check if the next tile is empty
    if (!spritesInNextTile.some(sprite => sprite.type === wall)) {
      // Move only the player by one block in the specified direction
      playerSprite.x = nextX;
      playerSprite.y = nextY;
    }
  }
}
});
