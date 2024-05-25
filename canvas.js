const canvas = document.getElementById("canvas")
let grid;
let framePerSecond = 350;
let isDraw = false;
let mouseUp = false;
let lastEvent;
let simulating = true;
let hue = 0;
document.addEventListener("DOMContentLoaded", function (event) {
  canvas.width = 500;
  canvas.height = 500;
  let gridWidthHeight = 125;
  grid = makeGrid(gridWidthHeight, gridWidthHeight);
  for (let i = 0; i < grid.length; i++){
    for (let x = 0; x < grid[i].length; x++){
      grid[i][x] = [0,0];
    }
  }
  draw();
  canvas.onmousedown = mouseDown;
  mouseUp = true;
});
document.getElementById("startstop").addEventListener("click", function () {
  if (isDraw) {
    isDraw = false;
    document.getElementById("state").innerText = "Stopped"
  } else {
    isDraw = true;
    document.getElementById("state").innerText = "Running";
    draw();
  }
})
document.getElementById("simulate").addEventListener("change", function () {
  if (document.getElementById("simulate").checked) {
    simulating=true
  } else {
    simulating=false
  }
})
canvas.addEventListener("mousedown", function (event) {
  lastEvent = event;
  mouseUp = false;
  mouseDown(event);
});
canvas.addEventListener("mouseup", function (event) {
  mouseUp = true;
});
canvas.addEventListener("mouseleave", function (event) {
  mouseUp = true;
});
canvas.addEventListener("mousemove", function (event) {
  if (mouseUp == false) {
    lastEvent = event
    mouseDown(event)
  }
})

function mouseDown(event) {
  
  function onMouseMove(event) {
    x = parseInt(event.offsetX / 4);
    y = parseInt(event.offsetY / 4);
    grid[y][x] = [1, hue];
    const randomNumber = Math.floor(Math.random() * 4) + 1;
    const randomNumber1 = Math.floor(Math.random() * 4) + 1;
    if (y != grid.length-1 && (randomNumber==1||randomNumber1==1)) { grid[y + 1][x] = [1, hue]; }
    if (x != grid[y].length && (randomNumber==2||randomNumber1==2)) { grid[y][x + 1] = [1, hue]; }
    if (x != 0 && (randomNumber==3||randomNumber1==3)) { grid[y][x - 1] = [1, hue]; }
    if (y != 0 && (randomNumber==4||randomNumber1==4)) { grid[y - 1][x] = [1, hue]; }
    if (isDraw == false) {
      isDraw = true;
      draw();
    }
  }
  if (mouseUp == false) {
    onMouseMove(event);
    hue += 0.5;
    if (hue == 360) {
      hue = 0;
    }
  }

  canvas.onmouseup = (event) => {
  mouseUp = true;
  };
}


function makeGrid(rows, cols) {
  let arr = new Array(cols)
  for (let i = 0; i < arr.length; i++){
    arr[i] = new Array(rows);
  }
  return arr
}
async function simulate() {
  const newGrid = JSON.parse(JSON.stringify(Array.from([...grid])));
  for (let y = 0; y < grid.length-1; y++){
    for (let x = 0; x < grid[y].length; x++) {
      try {
        if (grid[y][x][0] == 1 && grid[y + 1][x][0] == 0) {
          newGrid[y][x] = [0,0];
          newGrid[y + 1][x] = [1, grid[y][x][1]];
        } else if (grid[y][x][0] == 1 && x != grid[y].length && (grid[y + 1][x + 1][0] == 0 || grid[y + 1][x - 1][0] == 0)) {
          newGrid[y][x] = [0,0]
          if (grid[y + 1][x + 1][0] == 0 && grid[y + 1][x - 1][0] == 1) {
            newGrid[y + 1][x + 1] = [1, grid[y][x][1]];
          } else if (grid[y + 1][x + 1][0] == 1 && grid[y + 1][x - 1][0] == 0) {
            newGrid[y + 1][x - 1] = [1, grid[y][x][1]];
          } else {
            const randomNumber = Math.floor(Math.random() * 2) + 1;
            if (randomNumber==1) {
              newGrid[y + 1][x - 1] = [1, grid[y][x][1]];
            }
            else {
              newGrid[y + 1][x + 1] = [1, grid[y][x][1]];
            }
          }
        }
      } catch (error) {
      }
    }
  }
  grid = newGrid;
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms | 0));
}
async function draw(){
    return new Promise(async (resolve) => {
      const delay = 1000 / framePerSecond;
      while (isDraw) {
        if (mouseUp == false) {
          mouseDown(lastEvent)
        }
        if (simulating) { await simulate(); }
        await render();
        await sleep(delay);
      }
      resolve();
    });
}

async function render() {
  let ctx = canvas.getContext("2d")
  for (let y = 0; y < grid.length; y++){
    for (let x = 0; x < grid[y].length; x++){
      if (grid[y][x][0] == 1) {
        ctx.fillStyle = `HSL(${grid[y][x][1]},100%,50%)`
      } else {
        ctx.fillStyle = "black";
      }
        ctx.fillRect(
          4 * x,
          4 * y,
          10,
          10
        );
    }
  }
}