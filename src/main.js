const game = document.getElementById("app");
const ctx = game.getContext("2d");

//import Enemy from "./src/mobs/enemy.js"

game.width = 500;
game.height = 500;

var isPause = false;

const TILE_LENGTH = 50;
const USER_SPEED = 10;
const ATACK_SPEED = 10;
const lookHelperWidth = 5;
const ARROW_SPEED = 2;
const ENEMY_SPAWNING_RATE = 1000;

// map and draw map
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
				ctx.drawImage(colors[colorCode], (col * TILE_LENGTH), (rows * TILE_LENGTH))
			} else {
			ctx.fillStyle = colors[colorCode];
			ctx.fillRect((col * TILE_LENGTH), (rows * TILE_LENGTH), TILE_LENGTH, TILE_LENGTH);
			}
		}
	}
}

function Arrow(x, y, direction) {
	this.x = (x - (TILE_LENGTH / 4));
	this.y = (y - (TILE_LENGTH / 4));
	this.direction = direction;
	this.sx = 0;
	this.arrowSize = (TILE_LENGTH / 2)
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
				this.y -= ARROW_SPEED;
				break;
			case 1:
				this.y += ARROW_SPEED;
				break;
			case 2:
				this.x -= ARROW_SPEED;
				break;
			case 3:
				this.x += ARROW_SPEED;
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
			ctx.drawImage(playerSprite, (this.lookingAt * 50), 0, TILE_LENGTH, TILE_LENGTH, this.x, this.y, TILE_LENGTH, TILE_LENGTH);
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
			ctx.drawImage(playerSprite, (this.lookingAt * 50), 50, TILE_LENGTH, TILE_LENGTH, this.x, this.y, TILE_LENGTH, TILE_LENGTH);
		} else {
			ctx.drawImage(playerSprite, (this.lookingAt * 50), 100, TILE_LENGTH, TILE_LENGTH, this.x, this.y, TILE_LENGTH, TILE_LENGTH);	
		}
	}

	this.drawLookHelp = () => {
			ctx.fillStyle = "black";
		if(this.lookingAt === 0){
			ctx.fillRect(this.x, this.y, TILE_LENGTH, lookHelperWidth)
			return;
		}
		if(this.lookingAt === 1){
			ctx.fillRect(this.x, this.y + (TILE_LENGTH - lookHelperWidth), TILE_LENGTH, lookHelperWidth)
			return;
		}
		if(this.lookingAt === 2){
			ctx.fillRect(this.x, this.y, lookHelperWidth, TILE_LENGTH)
			return;
		}
		if(this.lookingAt === 3){
			ctx.fillRect(this.x + (TILE_LENGTH - lookHelperWidth), this.y, lookHelperWidth, TILE_LENGTH)
			return;
		}
	}

	this.atack = () => {
		this.atackDelay = ATACK_SPEED;
	}

	this.shot = () => {
		let arrow = new Arrow(this.x + (TILE_LENGTH / 2), this.y + (TILE_LENGTH/2), this.lookingAt);
		arrowsThrowed.push(arrow);
	}

	this.drawAtack = () => {
		ctx.fillStyle = "blue";
		let atackX = this.x;
		let atackY = this.y;
		if(this.lookingAt === 0){
			atackY = (this.y - TILE_LENGTH);
		}
		if(this.lookingAt === 1){
			atackY = (this.y + TILE_LENGTH);	
		}
		if(this.lookingAt === 2){
			atackX = (this.x - TILE_LENGTH);	
		}
		if(this.lookingAt === 3){
			atackX = (this.x + TILE_LENGTH);	
		}
		ctx.fillRect(atackX, atackY, TILE_LENGTH, TILE_LENGTH);
	} 
}

function Enemy(x, y) {
	this.x = x;
	this.y = y;
	this.shotCoolDown = 100;
	this.userDirectionRel = 0;
	this.draw = () => {
		ctx.fillStyle = "red";
		ctx.fillRect(this.x, this.y, TILE_LENGTH, TILE_LENGTH)
	}
	this.update = () => {
		this.handleUserPosition();
		this.handleShot();
		this.draw();
	}
	this.handleUserPosition = () => {
		if(position.x > this.x){
			this.x++;
			this.userDirectionRel = 3;
		} else if( position.y > this.y){
			this.y++;
			this.userDirectionRel = 1;
		}
		if(position.x < this.x){
			this.x--;
			this.userDirectionRel = 2;
		} else if(position.y < this.y){
			this.y--;
			this.userDirectionRel = 0;
		}
	}
	this.handleShot = () => {
		if(this.canShot()){
			this.shot()
		}	
	}
	this.canShot = () => {
		let isCoolDownOver = this.handleCoolDown();
		let isProperToShot = (isCoolDownOver);
		return isProperToShot;
	}
	this.handleCoolDown = () => {
		let isOnPosition = (this.x == position.x || this.y == position.y);
		if(this.shotCoolDown <= 0 && isOnPosition){
			this.shotCoolDown = 100;
			return true;
		}
		this.shotCoolDown--;
		return false;
	}
	this.shot = () => {	
		let arrow = new Arrow(this.x + (TILE_LENGTH / 2), this.y + (TILE_LENGTH/2), this.userDirectionRel);
		arrowsThrowed.push(arrow);
	}
}

var position = {
	x: 200,
	y: 200
};

var p1 = new Player(200, 200);
var mob1 = new Enemy(200, 200);

var arrowsThrowed = [];

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

var mobs_on_game = [];
var mob_spawn_counter = 0;
var last_mob_spawn = 0;
const handle_mob_spawning = () => {
	if(mob_spawn_counter == ENEMY_SPAWNING_RATE){
		spawn_new_enemy();
		mob_spawn_counter = 0;
	}
	mob_spawn_counter++;
	for(let i = 0; i < mobs_on_game.length; i++){
		mobs_on_game[i].update();
	}
}

const spawn_new_enemy = () => {
	let x = 100;
	let y = 100;
	let new_enemy = new Enemy(x, y);
	mobs_on_game.push(new_enemy);
}

function animate() {
	clearScreen();
	drawMap();
	handle_mob_spawning();
	p1.update();
	updateFlyingElements();
	if(!isPause){
		requestAnimationFrame(animate)	
	}
}

const moveUp = () => {
	position.y -= USER_SPEED; 
	p1.lookingAt = 0;
	p1.isMoving = true;
	p1.movingDelay+= 5;
}
const moveDown = () => {
	position.y += USER_SPEED; 
	p1.lookingAt = 1;
	p1.isMoving = true;
	p1.movingDelay+= 5;
}
const moveLeft = () => {
	position.x -= USER_SPEED; 
	p1.lookingAt = 2;
	p1.isMoving = true;
	p1.movingDelay+= 5;
}
const moveRight = () => {
	position.x += USER_SPEED; 
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
