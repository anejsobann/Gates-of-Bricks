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

// Naloži slike
var crownImage = new Image();
crownImage.src = "../assets/crown.png"; // Pot do slike krone

var sandwatchImage = new Image();
sandwatchImage.src = "../assets/sandwatch.png"; // Pot do slike peščene ure

// Shrani objekte (krone in ure)
var objects = [];

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
    var crownScale = 0.2; // Velikost krone
    var sandwatchScale = 0.17; // Velikost peščene ure (malo manjša)

    var padding = 15; // Razmik med slikami

    // Velikost kron
    var crownWidth = crownImage.width * crownScale;
    var crownHeight = crownImage.height * crownScale;

    // Velikost peščenih ur
    var sandwatchWidth = sandwatchImage.width * sandwatchScale;
    var sandwatchHeight = sandwatchImage.height * sandwatchScale;

    // **Postavitev mreže 4x4**
    var cols = 4;
    var rows = 4;
    var totalWidth = cols * crownWidth + (cols - 1) * padding;
    var totalHeight = rows * crownHeight + (rows - 1) * padding;

    // Centriranje začetne točke mreže
    var startX = (canvas.width - totalWidth) / 2 + crownWidth / 2;
    var startY = (canvas.height - totalHeight) / 2 + crownHeight / 2;

    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            var x = startX + i * (crownWidth + padding);
            var y = startY + j * (crownHeight + padding);

            // Če je srednji del (2x2), nariši krone, drugače peščene ure
            if (i >= 1 && i <= 2 && j >= 1 && j <= 2) {
                objects.push({ x, y, width: crownWidth, height: crownHeight, image: crownImage });
            } else {
                objects.push({ x, y, width: sandwatchWidth, height: sandwatchHeight, image: sandwatchImage });
            }
        }
    }
}

// Funkcija za risanje vseh objektov
function drawElements() {
    objects.forEach(obj => {
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
            objects.splice(i, 1); // Odstrani objekt iz tabele
            dy = -dy; // Obrni smer žogice
            break; // Prekini zanko (da ne izbriše več slik naenkrat)
        }
    }
}

// Posodobitev položaja žogice in risanje elementov
function updateBallPosition() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawElements();
    drawBall();

    x += dx;
    y += dy;

    // Preveri trke z objekti
    checkCollisions();

    // Odboji od robov canvasa
    if (x + dx > canvas.width - r || x + dx < r) dx = -dx;
    if (y + dy > canvas.height - r || y + dy < r) dy = -dy;
}

// Funkcija za risanje žogice
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

// Osveževanje animacije vsakih 10ms
setInterval(updateBallPosition, 10);
