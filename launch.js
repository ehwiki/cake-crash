window.onload = function(){
var canvas = document.getElementById("game");
console.log("c has been created");
var c = canvas.getContext("2d");
var game = new game();
var cmTID;


//updates the position and redraws everything on the screen
function updateEverything(){
	game.moveEverything();
	game.updateAll();

	//move everything again
	clearTimeout(cmTID);
	if(!game.gameOver){
		cmTID = setTimeout(updateEverything, game.timeStep);
	}
}



function cake (height, width, x, y){
	this.h = height;				//height of the cake's hitbox
	this.w = width;					//width of the cake's hitbox
	this.x = x + (this.h / 2);		//cake's x position
	this.y = y + (this.w / 2);		//cake's y position
	this.dx = 0;					//amount cake moves in x direction
	this.dy = 0;					//amount cake moves in y direction
	this.currentHeight = 0;			//the height that the cake is. Used to say how high up it is without
									//drawing the cake on the screen
	this.g = 0.98;					//gravity. when moving, this.dy += this.g
	this.groundLevel = y;			//

	//sets initial speed of the cake and an initial rotation
	this.launch = function(power, angle){
		var initialDx = power * Math.cos(angle);
		var initialDy = power * Math.sin(angle);
		this.dx = initialDx;
		this.dy = initialDy;
	};

	//gets the horizontal speed to know how quickly to scroll everything
	this.getHorizontalSpeed(){
		return this.dx;
	}

	this.draw = function(){
		console.log("Drawing a rectangle at " + this.x + " and " + this.y);
		c.strokeStyle = "#000000";
		c.strokeRect(this.x - (this.h/2), this.y - (this.w/2), this.w, this.h);
	};

	//moves the cake
	this.move = function(){
		//change its vertical velocity by gravity
		this.dy += this.gravity;
		//change its y position by vertical velocity
		this.y += this.dy;
		//change its height by vertical velocity
		//Since negative means up on a canvas and positive means down, we subtract dy
		//	so going up means height gets more positive
		this.currentHeight -= this.dy;

		//in the very beginning, the cake is not in the center of the screen
		//	this lets it move there. Once there, it stays there. It will only
		//	change heights
		if(this.x < c.width / 2){
			this.x += this.dx;
			if(this.x > c.width / 2){
				this.x = c.width / 2;
			}
		}
		if(this.y < this.groundLevel){
			this.y = this.groundLevel;
			if(this.isGreased())
				this.bounce(1);
			else
				this.bounce(0.7)
		}
	};

	//sets the cake at a new location. Used when initializing
	this.setLocation = function(newX, newY){
		this.x = newX;
		this.y = newY;
	};

	//the cake has hit a surface and is bouncing.
	//	The amount of energy lost by the bounce depends on surface
	this.bounce = function(energyLost){
		this.dy *= energyLost;
		this.dx *= energyLost;
	}

};

function launcher(){
	this.maxAngle = 90;		//maximum angle can be launched
	this.minAngle = 0;		//minimum angle cake can be launched
	this.maxPower = 100;	//maximum power cake can be launched at
	this.minPower = 0;		//minimum power cake can be launched at
	this.angleRate = 1;		//change in angle on launcher
	this.powerRate = 1;		//change in power on launcher
	this.currentAngle = 0;
	this.currentPower = 0;
	this.phase = 0;			//state changing variable. 0 represents finding angle.
							//	1 is finding power. 2 is nothing.

	//reverse the rate the angle and power changes. Used to change direction.
	this.changeAngleRate = function(){
		this.angleRate *= -1;
	};

	this.changePowerRate = function(){
		this.powerRate *= -1;
	};

	//changes the angle of the launcher
	this.adjustAngle = function(){
		if(this.currentAngle >== this.maxAngle || this.currentAngle <== this.minAngle)
			this.changeAngleRate();
		this.currentAngle += this.angleRate;
	};

	//changes the power in the launcher
	this.adjustPower = function(){
		if(this.currentPower ==> this.maxPower || this.minPower <== this.minPower)
			this.changePowerRate();
		this.currentPower += this.powerRate;
	};

	//changes which phase the launcher is in
	this.setPhase = function(newPhase){
		if(newPhase >== 0 && newPhase <== 2){
			this.phase = newPhase;
			console.log("Phase changed to " + this.phase);
		}
	};

	//changes the angle or power based on which phase it's in
	this.move = function(){
		if (this.phase === 0)
			this.adjustAngle();
		else if (this.phase === 1)
			this.adjustPower();
	};

	this.getAngle = function(){
		return this.angle;
	};

	this.getPower = function(){
		return this.power;
	};

	//an onclick event on the canvas for the location of the launcher. 
	//	Shifts the phase and gets the angle and power
};

function game(){

	this.cake = new cake(150, 120, 50, canvas.height - 200);
	this.launch = new launcher();
	this.fps = 60;
	this.timeStep = 1000 / 60;
	this.gameOver = false;

	//clears the screen and redraws every element
	this.updateAll = function(can, ctx){
		//TODO: PUT ALL THE DRAWS IN HERE
		ctx.clearRect(0, 0, can.width, can.height);
		cake.draw();
		//launch.draw();
	}

	this.initialize = function(){
		//TODO: set the launcher to phase 0
		//place the cake at the initial start point. 
		//After launch, the x of the cake should be in the center of the screen
	}

	//updates the position of every onscreen element
	this.moveEverything = function(){
		//moves everything that needs to be moved.
		cake.move();
		//launcher.move();
	}
}

};