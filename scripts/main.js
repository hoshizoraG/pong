const canvas = document.getElementById("demo");
const ctx = canvas.getContext("2d");
let xRaqu = (canvas.width - 100) / 2;
const yRaqu = canvas.height - 40;
let xBall = canvas.width / 2;
let yBall = canvas.height / 2;
let dx = 0;
let dy = 0;
let speed = 4;
let isPlaying = false;
let startTime = null;
let elapsedTime = 0;
let bestScore = 0;
let nbLoose = 0;
let keys = {
    left: false,
    right: false
};
let paddleSpeed = 6;

function formatTime(ms) {
    let totalSeconds = Math.floor(ms / 1000);
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    return minutes > 0 ? `${minutes} min ${seconds}s` : `${seconds}s`;
}

function drawBall() {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(xBall, yBall, 15, 0, Math.PI * 2);
    ctx.fill();
}

function drawRaquette() {
    ctx.fillStyle = "white";
    ctx.fillRect(xRaqu, yRaqu, 100, 10);
}

function update() {
    if (isPlaying) {
        xBall += dx;
        yBall += dy;
        elapsedTime = Date.now() - startTime;

        if (xBall < 15 || xBall > canvas.width - 15) dx = -dx;
        if (yBall < 15) dy = -dy;

        if (
            yBall + 15 >= yRaqu &&
            yBall + 15 <= yRaqu + 10 &&
            xBall >= xRaqu &&
            xBall <= xRaqu + 100
        ) {
            let hit = (xBall - (xRaqu + 50)) / 50;
            let angle = hit * (Math.PI / 3);
            dx = speed * Math.sin(angle);
            dy = -speed * Math.cos(angle);
            yBall = yRaqu - 15;
        }

        if (yBall > canvas.height - 15) {
            looser();
        }
    }

    if (keys.left && xRaqu > 0) xRaqu -= paddleSpeed;
    if (keys.right && xRaqu < canvas.width - 100) xRaqu += paddleSpeed;
}

function looser() {
    if (elapsedTime > bestScore) bestScore = elapsedTime;
    nbLoose++;
    resetBall();
    isPlaying = false;
}

function resetBall() {
    xBall = canvas.width / 2;
    yBall = canvas.height / 2;
    dx = 0;
    dy = 0;
}

function resetGame() {
    elapsedTime = 0;
    resetBall();
    isPlaying = false;
}

function launchBall() {
    if (!isPlaying) {
        let angle = Math.random() * Math.PI * 2;
        dx = speed * Math.cos(angle);
        dy = -Math.abs(speed * Math.sin(angle));
        isPlaying = true;
        startTime = Date.now();
        elapsedTime = 0;
    }
}

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") keys.left = true;
    if (e.key === "ArrowRight") keys.right = true;
    if (!isPlaying && (e.key === "ArrowLeft" || e.key === "ArrowRight")) launchBall();
});

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft") keys.left = false;
    if (e.key === "ArrowRight") keys.right = false;
});

const btnLeft = document.getElementById("btn-left");
const btnRight = document.getElementById("btn-right");

btnLeft.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keys.left = true;
});
btnLeft.addEventListener("touchend", (e) => {
    e.preventDefault();
    keys.left = false;
});

btnRight.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keys.right = true;
});
btnRight.addEventListener("touchend", (e) => {
    e.preventDefault();
    keys.right = false;
});

btnLeft.addEventListener("mousedown", () => keys.left = true);
btnLeft.addEventListener("mouseup", () => keys.left = false);
btnRight.addEventListener("mousedown", () => keys.right = true);
btnRight.addEventListener("mouseup", () => keys.right = false);

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    update();
    drawBall();
    drawRaquette();
    document.getElementById("score").textContent = "Temps : " + formatTime(elapsedTime);
    document.getElementById("loose").textContent = "Nombre de défaites : " + nbLoose;
    document.getElementById("bestScore").textContent = "Meilleur temps : " + formatTime(bestScore);
    requestAnimationFrame(loop);
}

loop();