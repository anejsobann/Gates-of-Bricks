// Pridobimo canvas in nastavimo velikost
var canvas = document.getElementById("myCanvas");
canvas.width = window.innerWidth * 0.59;  // 59vw
canvas.height = window.innerHeight * 0.65;  // 65vh

var ctx = canvas.getContext("2d");

// Nastavitve za žogico
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;
var r = 10;

// Naloži sliko krone
var brickImage = new Image();
brickImage.src = "../assets/crown.png"; // Pot do slike

// Ko se slika naloži, nastavimo pravilne dimenzije
brickImage.onload = function () {
    drawBricks(); // Pokliči risanje "opek" šele po nalaganju slike
};

// Funkcija za risanje žogice
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

// Funkcija za risanje posamezne "opeke" kot slike krone
function drawBrick(x, y) {
    var scale = 0.2; // Delež originalne velikosti
    var width = brickImage.width * scale;
    var height = brickImage.height * scale;

    ctx.drawImage(brickImage, x, y, width, height);
}

// Funkcija za risanje mreže "opek"
function drawBricks() {
    var rows = 3;
    var cols = 5;
    var padding = 15;

    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            var x = i * (brickImage.width * 0.2 + padding);
            var y = j * (brickImage.height * 0.2 + padding);
            drawBrick(x, y);
        }
    }
}

// Posodobitev položaja žogice in risanje elementov
function updateBallPosition() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();

    x += dx;
    y += dy;

    // Odboji od robov
    if (x + dx > canvas.width - r || x + dx < r) dx = -dx;
    if (y + dy > canvas.height - r || y + dy < r) dy = -dy;
}

// Osveževanje animacije vsakih 10ms
setInterval(updateBallPosition, 10);
