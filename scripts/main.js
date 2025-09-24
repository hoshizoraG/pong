const canvas = document.getElementById("demo");
const ctx = canvas.getContext("2d");

let xRaqu = (canvas.width - 100) / 2;
const yRaqu = canvas.height - 40;

let xBall = canvas.width / 2;
let yBall = canvas.height / 2;;
let dx = 2;
let dy = 2;
let isPlaying = false;
let nbscore = 0;
let nbLoose = 0;
let bestScore = 0;
let speed = 2;

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

function update(){
    if(isPlaying){
        xBall += dx;
        yBall += dy;

        if(xBall < 15 || xBall > canvas.width - 15){
            dx = -dx;
        }

        if (yBall < 15){
            dy = -dy;
        }

        if( yBall + 15 >= yRaqu && yBall + 15 <= yRaqu + 10 && xBall >= xRaqu && xBall <= xRaqu + 100 ){
            let hit = (xBall - (xRaqu + 50)) / 50;
            let angle = hit * (Math.PI / 3); 
            dx = speed * Math.sin(angle);
            dy = -speed * Math.cos(angle); 
            yBall = yRaqu - 15;
            nbscore++;
        }
        if(yBall > canvas.height - 15) {
            looser();
        }
    }

}

function looser(){
    if (nbscore > bestScore){
                bestScore = nbscore;
            }
            nbscore =0;
            nbLoose++;
            alert("perdu");
            yBall = canvas.height / 2;
            xBall = canvas.width / 2;
            dx = 2;
            dy = 2;
            isPlaying = false;
}

function launchBall() {
    let angles = [
        Math.random() * (Math.PI / 3) + Math.PI / 6,         
        Math.random() * (Math.PI / 3) + (5 * Math.PI) / 6  
    ];
    let angle = angles[Math.floor(Math.random() * 2)];
    dx = speed * Math.cos(angle);
    dy = speed * Math.sin(angle);
    if (dy > 0) dy = -dy;
}

function moveBar(event){
    let direction = event.key;
    if(direction === "ArrowLeft" && xRaqu > 0){
        xRaqu -=20;
    }
    if(direction === "ArrowRight" && xRaqu < canvas.width -100){
        xRaqu += 20;
    }
    if(!isPlaying){
        isPlaying = true;
        launchBall();
    }
}

function score(){
    score += 1;
}

    document.addEventListener("keydown", moveBar);


function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    update();
    drawBall();
    drawRaquette();
    document.getElementById("score").textContent = "Score : " + nbscore;
    document.getElementById("loose").textContent = "Nombre de défaite : " + nbLoose;
     document.getElementById("bestScore").textContent = "Meilleur score : " + bestScore;
    requestAnimationFrame(loop);
}

function modefacile(){
    selectButton("facile")
    speed = 2;
    dx = Math.sign(dx) * speed;
    dy = Math.sign(dy) * speed;
}

function modeMoyen(){
    selectButton("moyen")
    speed = 4;
    dx = Math.sign(dx) * speed;
    dy = Math.sign(dy) * speed;
}

function modeDur(){
    selectButton("dur")
    speed = 6;
    dx = Math.sign(dx) * speed;
    dy = Math.sign(dy) * speed;
}

function selectButton(id) {
    document.querySelectorAll("button").forEach(btn => btn.classList.remove("selected"));
    document.getElementById(id).classList.add("selected");
}

loop();
