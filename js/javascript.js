var canvas = document.getElementById("myCanvas");
canvas.width = window.innerWidth * 0.59; // 59vw
canvas.height = window.innerHeight * 0.65; // 65vh

var ctx = canvas.getContext("2d");

// Nastavitve za žogico
var x = canvas.width / 2;
var y = canvas.height - 30; // Začetni položaj žogice bo na drsniku
var dx = 0.5; // Zmanjšana vodoravna hitrost
var dy = -1; // Zmanjšana navpična hitrost (žogica bo padala počasi)
var r = 10; // Polmer žogice

// Naloži slike
var crownImage = new Image();
crownImage.src = "assets/crown.png"; ///Gates-of-Olympus/assets/crown.png

var sandwatchImage = new Image();
sandwatchImage.src = "assets/sandwatch.png"; ///Gates-of-Olympus/assets/sandwatch.png

// Shrani objekte (krone in ure)
var objects = [];

// Drsnik (slider)
var sliderWidth = 100;
var sliderHeight = 15;
var sliderX = (canvas.width - sliderWidth) / 2;
var sliderSpeed = 3; // Zmanjšana hitrost drsnika
var rightPressed = false;
var leftPressed = false;

// Game status flag
var gameStarted = false;
var gameLost = false; // Spremenljivka, ki označuje, če je igra izgubljena

// Počakamo, da se slike naložijo
crownImage.onload = sandwatchImage.onload = function () {
  setupObjects();
  drawElements();
};

// Funkcija za risanje slike (krone ali peščene ure)
function drawImage(image, x, y, width, height) {
  ctx.drawImage(image, x - width / 2, y - height / 2, width, height);
}

// Funkcija za inicializacijo objektov
function setupObjects() {
  var crownScale = 0.2;
  var sandwatchScale = 0.17;

  var padding = 15;

  var crownWidth = crownImage.width * crownScale;
  var crownHeight = crownImage.height * crownScale;

  var sandwatchWidth = sandwatchImage.width * sandwatchScale;
  var sandwatchHeight = sandwatchImage.height * sandwatchScale;

  var cols = 4;
  var rows = 4;
  var totalWidth = cols * crownWidth + (cols - 1) * padding;
  var totalHeight = rows * crownHeight + (rows - 1) * padding;

  // Adjust the startY position to move the objects closer to the top
  var startX = (canvas.width - totalWidth) / 2 + crownWidth / 2;
  var startY = crownHeight / 2 + 20; // Move objects 20px down from the very top

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      var x = startX + i * (crownWidth + padding);
      var y = startY + j * (crownHeight + padding);

      if (i >= 1 && i <= 2 && j >= 1 && j <= 2) {
        objects.push({
          x,
          y,
          width: crownWidth,
          height: crownHeight,
          image: crownImage,
        });
      } else {
        objects.push({
          x,
          y,
          width: sandwatchWidth,
          height: sandwatchHeight,
          image: sandwatchImage,
        });
      }
    }
  }
}

// Funkcija za risanje vseh objektov
function drawElements() {
  objects.forEach((obj) => {
    drawImage(obj.image, obj.x, obj.y, obj.width, obj.height);
  });
}

// Funkcija za preverjanje trka z žogico
function checkCollisions() {
  for (var i = 0; i < objects.length; i++) {
    var obj = objects[i];
    if (
      x + r > obj.x - obj.width / 2 &&
      x - r < obj.x + obj.width / 2 &&
      y + r > obj.y - obj.height / 2 &&
      y - r < obj.y + obj.height / 2
    ) {
      objects.splice(i, 1); // Odstrani objekt iz seznama
      dy = -dy; // Spremeni smer žogice
      break;
    }
  }
}

// Funkcija za posodobitev položaja žogice in risanje elementov
function updateBallPosition() {
  if (gameStarted) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawElements();
    drawBall();
    drawSlider();

    x += dx;
    y += dy;

    checkCollisions();

    // Odboji od sten canvasa
    if (x + dx > canvas.width - r || x + dx < r) dx = -dx;
    if (y + dy < r) dy = -dy;

    // Odbijanje od drsnika (ploščka)
    if (
      y + dy > canvas.height - sliderHeight - r &&
      x > sliderX &&
      x < sliderX + sliderWidth
    ) {
      dy = -dy;

      // Upoštevaj odboj kroglice glede na to, kje se odbija od ploščka, ampak brez spreminjanja hitrosti
      let impactFactor = (x - (sliderX + sliderWidth / 2)) / (sliderWidth / 2);
      dx = (dx > 0 ? 1 : -1) * Math.abs(dx);
    }

    // Premik drsnika
    if (rightPressed && sliderX < canvas.width - sliderWidth) {
      sliderX += sliderSpeed;
    } else if (leftPressed && sliderX > 0) {
      sliderX -= sliderSpeed;
    }

    // Preveri, ali so vsi objekti odstranjeni (zmagal si)
    if (objects.length === 0) {
      gameStarted = false;
      Swal.fire({
        title: "Bravo!",
        icon: "success",
        draggable: true,
      }); // Prikaži alert za zmago
    }
  } else {
    drawStartButton();
  }
}

// Funkcija za risanje žogice
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// Funkcija za risanje drsnika
function drawSlider() {
  ctx.beginPath();
  ctx.rect(sliderX, canvas.height - sliderHeight, sliderWidth, sliderHeight);
  ctx.fillStyle = "#ff5733";
  ctx.fill();
  ctx.closePath();
}

// Funkcija za risanje gumba Start
function drawStartButton() {
  ctx.font = "30px Arial";
  ctx.fillStyle = "#ff5733";
  ctx.fillText("", canvas.width / 2 - 130, canvas.height / 2);
}

// Funkcija za zagon igre
function startGame() {
  if (!gameStarted) {
    gameStarted = true;
    resetGame(); // Začne igro in jo ponastavi
    setInterval(updateBallPosition, 10); // Začne animacijo
  }
}

// Funkcija za ponastavitev igre
function resetGame() {
  // Ponastavi vse spremenljivke na začetne vrednosti
  x = canvas.width / 2;
  y = canvas.height - 30; // Začetni položaj žogice bo na drsniku
  dx = 0.8; // Zmanjšana vodoravna hitrost
  dy = -1.8; // Zmanjšana navpična hitrost

  // Ponastavi objekt in drsnik
  objects = [];
  setupObjects();
  sliderX = (canvas.width - sliderWidth) / 2;
  gameLost = false; // Ponastavi status izgube igre
}

// Event listenerji za premikanje drsnika
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false;
  }
}

// Event listenerji za gumbe Start in Reset
document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("resetBtn").addEventListener("click", function () {
  window.location.reload(); // Osveži stran ob kliku na gumb
});

setInterval(updateBallPosition, 10);
