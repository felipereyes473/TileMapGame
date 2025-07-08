const game = document.getElementById("app");
const ctx = game.getContext("2d");
game.width = 500;
game.height = 500;

var isPause = false;

const tileLen = 50;
const userSpeed = 10;
const atackSpeed = 10;
const lookHelperWidth = 5;
const arrowSpeed = 2;

const map = [
	0, 0, 0, 0, 0, 1, 1, 2, 2, 2,
	0, 0, 0, 0, 0, 0, 1, 1, 2, 2,
	0, 0, 0, 0, 0, 0, 0, 1, 2, 2,
	0, 0, 0, 0, 0, 0, 0, 1, 2, 2,
	0, 0, 0, 0, 0, 0, 0, 1, 1, 1,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
	2, 1, 0, 0, 0, 0, 0, 0, 0, 0,
	2, 1, 0, 0, 0, 0, 0, 0, 0, 0,
];

let grassTile = new Image();
let sandTile = new Image();
let seaTile = new Image();
let arrowSprite = new Image();
let playerSprite = new Image();

grassTile.src = "./assets/grass.png"
sandTile.src = "./assets/sand.png"
seaTile.src = "./assets/sea.png"
arrowSprite.src = "./assets/arrow.png"
playerSprite.src = "./assets/player.png"

const colors = [
	grassTile,
	sandTile,
	seaTile
];

const drawMap = () => {
	for(let rows = 0; rows < 10; rows++){
		for(let col = 0; col < 10; col++){
			let currentPos = (rows * 10) + col;
			let colorCode = map[currentPos];
			if(typeof colors[colorCode] == "object") {
				ctx.drawImage(colors[colorCode], (col * tileLen), (rows * tileLen))
			} else {
			ctx.fillStyle = colors[colorCode];
			ctx.fillRect((col * tileLen), (rows * tileLen), tileLen, tileLen);
			}
		}
	}
}

function Arrow(x, y, direction) {
	this.x = (x - (tileLen / 4));
	this.y = (y - (tileLen / 4));
	this.direction = direction;
	this.sx = 0;
	this.arrowSize = (tileLen / 2)
	this.sy = 0;
	/*	the arrow sprite is a square of 50x50
	 */
	if(direction == 1 || direction == 3){
		this.sx = this.arrowSize; 
	}
	if(direction == 2 || direction == 3) {
		this.sy = this.arrowSize;
	}
	this.isOffLimits = () => {
		if(this.x <= 0) {return true}
		if(this.x >= game.width) {return true}
		if(this.y <= 0) {return true}
		if(this.y >= game.width) {return true}		
		return false;
	}

	this.draw = () => {
		ctx.drawImage(arrowSprite, this.sx, this.sy, this.arrowSize, this.arrowSize, this.x, this.y, this.arrowSize, this.arrowSize);
	}

	this.update = () => {
		switch(this.direction){
			case 0:
				this.y -= arrowSpeed;
				break;
			case 1:
				this.y += arrowSpeed;
				break;
			case 2:
				this.x -= arrowSpeed;
				break;
			case 3:
				this.x += arrowSpeed;
				break;
		}
		this.draw();
	}
}

function Player(x, y) {
	this.x = x;
	this.y = y;
	this.atackDelay = 0;
	this.movingDelay = 0;
	this.isMoving = false;
	this.isMovingDelay = 0;
	this.animationIndex = false;

	/*
	 * lookingAt
	 * up: 0
	 * down: 1
	 * left: 2
	 * right: 3
	 * */
	this.lookingAt = 0;

	this.draw = () => {
		if(this.isMoving){
			this.handleSpriteMove();
		} else {
			ctx.drawImage(playerSprite, (this.lookingAt * 50), 0, tileLen, tileLen, this.x, this.y, tileLen, tileLen);
		}
		this.handleAtack();
	}

	this.update = () => {
		this.x = position.x;
		this.y = position.y;
		this.draw();
	}

	this.handleSpriteMove = () => {
		this.drawMovingCharacter();
			this.movingDelay--;
			if(this.movingDelay <= 0){
				this.isMoving = false;
			}
	}

	this.handleAtack = () => {
		if(this.atackDelay > 1){
			this.atackDelay--;
			this.drawAtack();
		}
	}

	this.drawMovingCharacter = () => {
		if (this.isMovingDelay > 10){
			this.isMovingDelay = 0;
			this.animationIndex = !this.animationIndex;
		}
		this.isMovingDelay++;
		if(this.animationIndex){
			ctx.drawImage(playerSprite, (this.lookingAt * 50), 50, tileLen, tileLen, this.x, this.y, tileLen, tileLen);
		} else {
			ctx.drawImage(playerSprite, (this.lookingAt * 50), 100, tileLen, tileLen, this.x, this.y, tileLen, tileLen);	
		}
	}

	this.drawLookHelp = () => {
			ctx.fillStyle = "black";
		if(this.lookingAt === 0){
			ctx.fillRect(this.x, this.y, tileLen, lookHelperWidth)
			return;
		}
		if(this.lookingAt === 1){
			ctx.fillRect(this.x, this.y + (tileLen - lookHelperWidth), tileLen, lookHelperWidth)
			return;
		}
		if(this.lookingAt === 2){
			ctx.fillRect(this.x, this.y, lookHelperWidth, tileLen)
			return;
		}
		if(this.lookingAt === 3){
			ctx.fillRect(this.x + (tileLen - lookHelperWidth), this.y, lookHelperWidth, tileLen)
			return;
		}
	}

	this.atack = () => {
		this.atackDelay = atackSpeed;
	}

	this.shot = () => {
		let arrow = new Arrow(this.x + (tileLen / 2), this.y + (tileLen/2), this.lookingAt);
		arrowsThrowed.push(arrow);
	}

	this.drawAtack = () => {
		ctx.fillStyle = "blue";
		let atackX = this.x;
		let atackY = this.y;
		if(this.lookingAt === 0){
			atackY = (this.y - tileLen);
		}
		if(this.lookingAt === 1){
			atackY = (this.y + tileLen);	
		}
		if(this.lookingAt === 2){
			atackX = (this.x - tileLen);	
		}
		if(this.lookingAt === 3){
			atackX = (this.x + tileLen);	
		}
		ctx.fillRect(atackX, atackY, tileLen, tileLen);
	} 
}

var position = {
	x: 200,
	y: 200
};

var p1 = new Player(200, 200);

var arrowsThrowed = [];
var arrowsOffLimit = [];

const updateFlyingElements = () => {
	for(let i = 0; i < arrowsThrowed.length; i++)
	{
		if(arrowsThrowed[i]){
			arrowsThrowed[i].update();
			if(arrowsThrowed[i].isOffLimits()){
			arrowsThrowed[i] = null;
			}
		}
	}
}

function clearScreen() {
	ctx.clearRect(0, 0, game.width, game.height);
}

function animate() {
	clearScreen();
	drawMap();
	p1.update();
	updateFlyingElements();
	if(!isPause){
		requestAnimationFrame(animate)	
	}
}

const moveUp = () => {
	position.y -= userSpeed; 
	p1.lookingAt = 0;
	p1.isMoving = true;
	p1.movingDelay+= 5;
}
const moveDown = () => {
	position.y += userSpeed; 
	p1.lookingAt = 1;
	p1.isMoving = true;
	p1.movingDelay+= 5;
}
const moveLeft = () => {
	position.x -= userSpeed; 
	p1.lookingAt = 2;
	p1.isMoving = true;
	p1.movingDelay+= 5;
}
const moveRight = () => {
	position.x += userSpeed; 
	p1.lookingAt = 3;
	p1.isMoving = true;
	p1.movingDelay+= 5;
}

window.addEventListener("keydown", (event) => {
	switch(event.key){
		case "ArrowUp":
			moveUp()
			event.preventDefault();
			break;
		case "ArrowDown":
			moveDown()
			event.preventDefault();
			break;
		case "ArrowLeft":
			moveLeft()
			event.preventDefault();
			break;
		case "ArrowRight":
			moveRight();
			event.preventDefault();
			break;
		case "w":
			moveUp();
			break;
		case "a":
			moveLeft();
			break;
		case "s":
			moveDown();
			break;
		case "d":
			moveRight();
			break;
		case "q":
			p1.atack();
			break;
		case "e": 
			p1.shot();
			break;
	}
})

left_arrow.addEventListener("click", moveLeft);
up_arrow.addEventListener("click", moveUp);
down_arrow.addEventListener("click", moveDown);
right_arrow.addEventListener("click", moveRight);

atack_btn.addEventListener("click", p1.atack)
shot_btn.addEventListener("click", p1.shot)

animate();
