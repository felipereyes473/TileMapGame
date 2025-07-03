const game = document.getElementById("app");
const ctx = game.getContext("2d");
game.width = 500;
game.height = 500;

const tileLen = 50;
const userSpeed = 10;
const atackSpeed = 10;
const lookHelperWidth = 5;

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

const colors = [
	"rgb(26, 101, 55)",
	"rgb(242, 249, 205)",
	"rgb(102, 157, 245)"
];

const drawMap = () => {
	for(let rows = 0; rows < 10; rows++){
		for(let col = 0; col < 10; col++){
			let currentPos = (rows * 10) + col;
			let colorCode = map[currentPos];
			ctx.fillStyle = colors[colorCode];
			ctx.fillRect((col * tileLen), (rows * tileLen), tileLen, tileLen);
		}
	}
}

function Player(x, y) {
	this.x = x;
	this.y = y;
	this.atackDelay = 0;

	/*
	 * lookingAt
	 * up: 0
	 * down: 1
	 * left: 2
	 * right: 3
	 * */
	this.lookingAt = 0;

	this.draw = () => {
		ctx.fillStyle = "red";
		ctx.fillRect(this.x, this.y, tileLen, tileLen);
		this.drawLookHelp()
		if(this.atackDelay > 1)
		{
			this.atackDelay--;
			this.drawAtack();
		}
	}
	this.update = () => {
		this.x = position.x;
		this.y = position.y;
		this.draw();
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
	x: 10,
	y: 10
};

var p1 = new Player(10, 10);

function clearScreen() {
	ctx.clearRect(0, 0, game.width, game.height);
}

//function animate() {
	clearScreen();
	drawMap();
	p1.update();
//	requestAnimationFrame(animate)
//}

window.addEventListener("keydown", (event) => {
	switch(event.key){
		case "ArrowUp":
			position.y -= userSpeed; 
			p1.lookingAt = 0;
			event.preventDefault();
			break;
		case "ArrowDown":
			position.y += userSpeed; 
			p1.lookingAt = 1;
			p1.update();
			event.preventDefault();
			break;
		case "ArrowLeft":
			position.x -= userSpeed; 
			p1.lookingAt = 2;
			event.preventDefault();
			break;
		case "ArrowRight":
			position.x += userSpeed; 
			p1.lookingAt = 3;
			event.preventDefault();
			break;
		case "q":
			p1.atack();
			break;
	}
})

animate();
