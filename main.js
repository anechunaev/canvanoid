var Brick = function(options){

	var main = {};
		
	if(!isset(options.health)){options.health = 1}
	if(!isset(options.isMetal)){options.isMetal = false}
	if(!isset(options.isBonus)){options.isBonus = true}
	if(!isset(options.bonusType)){options.bonusType = 0}
	if(!isset(options.bonusChance)){options.bonusChance = 0.3}
	if(!isset(options.brickSize)){options.brickSize = 2}
	if(!isset(options.color)){options.color = "red"}
	if(!isset(options.dice)){options.dice = false}
	if(!isset(options.delta)){
		options.delta = {x:0, y:0};
		switch(options.color){
		case "red":
			options.delta.y = 0;
			break;
		case "orange":
			options.delta.y = 124;
			break;
		case "yellow":
			options.delta.y = 93;
			break;
		case "green":
			options.delta.y = 62;
			break;
		case "blue":
			options.delta.y = 31;
			break;
		case "violet":
			options.delta.y = 155;
			break;
		case "grey":
			options.delta.y = 186;
			break;
		}
		if(options.brickSize == 1){
			options.delta.x = 264;
		}
	}
	if(!isset(options.size)){options.size = {x:options.brickSize*24, y:30}}
	if(!isset(options.z)){options.z = 2}
	if(!isset(options.isBomb)){options.isBomb = false}
	if(!isset(options.isBonusBrick)){options.isBonusBrick = false}
	
	if(options.dice){
		options.health = 3;
		if(options.brickSize == 2){
			options.delta.x = 504;
			options.delta.y = 31;
		} else {
			options.delta.x = 528;
			options.delta.y = 0;
		}
	}
	if(options.isBomb){
		options.delta = {x:456, y:0};
		options.size = {x:24, y:30};
	}
	if(options.isBonusBrick){
		options.isBonus = true;
		options.isMetal = true;
		options.bonusChance = 1;
		options.brickSize = 1;
		options.size = {x:24, y:30};
		options.delta = {x:408, y:0};
	}
	if(options.isMetal && !options.isBonusBrick){
		options.size.x = 48;
		options.size.y = 30;
		options.delta.x = 408;
		options.delta.y = 62;
		if(!options.isBonusBrick){
			options.bonusChance = 0;
		}
	}
	
	var sprite = {image:options.image, position:options.position, z:options.z, size:options.size, delta:options.delta, hidden:false};
	
	sprite.name = "brick";
	sprite.frame = 0;
	sprite.startTime = Date.now();
	sprite.animateBlink = false;
	sprite.touch = false;
	sprite.health = options.health;
	sprite.isMetal = options.isMetal;
	sprite.isBonus = options.isBonus;
	sprite.isBomb = options.isBomb;
	sprite.bonus = options.bonusType;
	sprite.bonusChance = options.bonusChance;
	sprite.brickSize = options.brickSize;
	sprite.dice = options.dice;
	sprite.isBonusBrick = options.isBonusBrick;
	
	sprite.Blink = function(){
		this.animateBlink = true;
	};
	sprite.Update = function(){
		var now = Date.now();
		if(!this.isMetal && !this.dice && !this.isBomb){
			if(now - this.startTime > 60 && this.animateBlink){
				if(this.frame > 4){
					this.frame = 0;
					this.animateBlink = false;
				}
				if(this.brickSize == 2){
					this.delta = {x: 48*this.frame, y: this.delta.y};
				} else {
					this.delta = {x: 264+24*this.frame, y: this.delta.y};
				}
				this.frame++;
				this.startTime = now;
			}
		}
		if(this.isBonusBrick){
			if(Date.now() - this.startTime > Game.time.fps*5){
				if(this.frame > 1){this.frame = 0}
				this.delta = {x:408+this.frame*24, y:this.delta.y};
				this.frame++;
				this.startTime = now;
			}
		}
		
		if(this.touch){
			if(this.isBomb){
				this.health = 0;
				for(var i in Game.scene.objects){
					var a = Game.scene.objects[i];
					if(a.name == "brick" && !a.hidden && !a.isMetal && a.position.x > this.position.x - 96 && a.position.x < this.position.x + 96 && a.position.y > this.position.y - 96 && a.position.y < this.position.y + 96){
						a.touch = true;
					}
				}
			}
			if(!this.isMetal){
				this.health--;
				main.points += 100;
				if(this.dice){
					if(this.brickSize == 2){
						this.delta = {x: 408+48*(this.health-1), y: this.delta.y};
					} else {
						this.delta = {x: 480+24*(this.health-1), y: this.delta.y};
					}
				}
				if(this.health <= 0){
					var burst = new Burst({position:{x:this.position.x+this.size.x/2,y:this.position.y+this.size.y/2},z:3});
					burst.burst = true;
					Game.scene.objects.push(burst);
					this.hidden = true;
				}
			}
			if(this.isBonus){
				var chance = Math.random();
				if(chance >= 1 - this.bonusChance){
					var type = this.bonus;
					if(type == 0){
						type = Math.round(Math.random()*15+1);
					}
					var bonus = new Bonus({image:tileset, position:{x:this.position.x+24,y:this.position.y+12}, type:type});
					Game.scene.objects.push(bonus);
				}
			}
			if(this.health == 0 && !this.isMetal && !this.isBonusBrick){
				main.bricks--;
			}
			this.touch = false;
		}
	};
	
	sprite.Draw = function(ctx){
		if(!this.hidden){
			ctx.drawImage(this.image, this.delta.x, this.delta.y, this.size.x, this.size.y, this.position.x, this.position.y, this.size.x, this.size.y);
		}
	}
	
	sprite.Start = function(){
		for(var i in Game.scene.objects){
			if(Game.scene.objects[i].name == "main"){
				main = Game.scene.objects[i];
				break;
			}
		}
	}
	return sprite;
}


var Racket = function(options){
	
	var main = {};
	
	this.name = "racket";
	this.hidden = false;
	this.position = options.position;
	this.z = options.z;
	this.guns = false;
	this.magnets = false;
	this.lives = 3;
	this.image = options.image;
	this.size = {x:options.width, y:16};
	this.lb = 0;
	this.animWidth = this.size.x;
	this.resize = true;
	this.death = false;
	
	this.Draw = function(ctx){
		if(!this.hidden){
			ctx.beginPath();
			ctx.rect(this.position - this.size.x/2, 680, this.size.x, 16);
			ctx.fillStyle = "#00a2ff";
			ctx.fill();
			ctx.closePath();
			ctx.beginPath();
			ctx.fillStyle = "#004267";
			ctx.rect(this.position - this.size.x/2, 696, this.size.x, 6);
			ctx.fill();
			ctx.closePath();
			ctx.drawImage(this.image, 483, 101, 14, 22, this.position - this.size.x/2 - 14, 680, 14, 22);
			ctx.drawImage(this.image, 517, 101, 14, 22, this.position + this.size.x/2, 680, 14, 22);
			if(this.guns){
				ctx.drawImage(this.image, 488, 78, 3, 14, this.position - this.size.x/2 - 9, 668, 3, 14);
				ctx.drawImage(this.image, 523, 78, 3, 14, this.position + this.size.x/2 + 6, 668, 3, 14);
			}
			if(this.magnets){
				ctx.drawImage(this.image, 487, 93, 5, 5, this.position - this.size.x/2 - 10, 675, 5, 5);
				ctx.drawImage(this.image, 522, 93, 5, 5, this.position + this.size.x/2 + 5, 675, 5, 5);
				if(!Game.mouse.up && !Game.mouse.down){
					ctx.beginPath();
					ctx.moveTo(this.position - this.size.x/2 - 5, 675.5);
					ctx.lineTo(this.position - this.size.x/4, 675.5 + (Math.round(Math.random()) * 2 - 1)*(Math.floor(Math.random() * 3) + 1));
					ctx.lineTo(this.position, 675.5 + (Math.round(Math.random()) * 2 - 1)*(Math.floor(Math.random() * 3) + 1));
					ctx.lineTo(this.position + this.size.x/4, 675.5 + (Math.round(Math.random()) * 2 - 1)*(Math.floor(Math.random() * 3) + 1));
					ctx.lineTo(this.position + this.size.x/2 + 5, 675.5);
					ctx.lineWidth = 1;
					ctx.strokeStyle = "#99ccff";
					ctx.stroke();
				}
			}
		}
	};
	this.Update = function(){
		this.position = Game.mouse.position.x;
		if(Game.mouse.button == 0 && Game.mouse.up && !this.death){
			if(this.guns){
				var bl = new Bullet({position:{x:this.position - this.size.x/2 - 9, y:668}});
				var br = new Bullet({position:{x:this.position + this.size.x/2 + 6, y:668}});
				Game.scene.objects.push(bl, br);
			}
		}
		var balls = 0;
		for(var i in Game.scene.objects){
			var a = Game.scene.objects[i];
			if(a.name == "ball"){
				balls++;
			}
			if((a.name == "burst" && a.burst && a.a <= 0) || (a.name == "bullet" && a.position.y < 0) || (a.name == "bonus" && a.hidden) || (a.name == "ball" && a.hidden)){
				delete Game.scene.objects[i];
			}
			if(a.name == "main"){
				main = a;
			}
		}
		
		if(balls == 0 || main.rackDeath){
			this.death = true;
			main.rackDeath = true;
			this.animWidth = 0;
		}
		
		if(main.rackBig && this.resize){
			if(this.animWidth < 194){
				this.animWidth += 48;
			}
			this.resize = false;
		}
		if(main.rackSmall && this.resize){
			if(this.animWidth > 0){
				this.animWidth -= 48;
			}
			this.resize = false;
		}
		if(this.animWidth > this.size.x){
			this.size.x++;
		}
		if(this.animWidth < this.size.x){
			if(this.death){
				this.size.x -= 4;
			} else {
				this.size.x--;
			}
		}
		if(this.animWidth == this.size.x){
			main.rackBig = false;
			main.rackSmall = false;
			this.resize = true;
		}
	};
	
	this.Start = function(){
		for(var i in Game.scene.objects){
			if(Game.scene.objects[i].name == "main"){
				main = Game.scene.objects[i];
				break;
			}
		}
		main.rackWidth = this.size.x;
	};
}


var Ball = function(options){

	if(!isset(options.onRacketPosition)){
		options.onRacketPosition = 10;
	}
	
	var main = {};

	this.name = "ball";
	this.size = 2;
	this.position = options.position;
	this.fire = false;
	this.z = options.z;
	this.onRacket = true;
	this.onRacketPosition = options.onRacketPosition;
	this.angle = 20;
	this.speed = {x:4, y:4};
	this.immortal = false;
	
	this.startTrigger = true;
	
	this.p = [
		{
			active: false,
			position: { x: 0, y: 0 },
			r: this.size*4,
			a: 1,
			t: 0,
			g: 60
		},{
			active: false,
			position: { x: 0, y: 0 },
			r: this.size*4,
			a: 1,
			t: 0,
			g: 60
		},{
			active: false,
			position: { x: 0, y: 0 },
			r: this.size*4,
			a: 1,
			t: 0,
			g: 60
		},{
			active: false,
			position: { x: 0, y: 0 },
			r: this.size*4,
			a: 1,
			t: 0,
			g: 60
		},{
			active: false,
			position: { x: 0, y: 0 },
			r: this.size*4,
			a: 1,
			t: 0,
			g: 60
		},{
			active: false,
			position: { x: 0, y: 0 },
			r: this.size*4,
			a: 1,
			t: 0,
			g: 60
		},{
			active: false,
			position: { x: 0, y: 0 },
			r: this.size*4,
			a: 1,
			t: 0,
			g: 60
		},{
			active: false,
			position: { x: 0, y: 0 },
			r: this.size*4,
			a: 1,
			t: 0,
			g: 60
		},{
			active: false,
			position: { x: 0, y: 0 },
			r: this.size*4,
			a: 1,
			t: 0,
			g: 60
		},{
			active: false,
			position: { x: 0, y: 0 },
			r: this.size*4,
			a: 1,
			t: 0,
			g: 60
		}
	];
	
	this.Draw = function(ctx){
		if(this.fire){
			for(var i in this.p){
				var prt = this.p[i];
				if(prt.active){
					ctx.beginPath();
					ctx.fillStyle = "rgba(190,"+prt.g+",0,"+prt.a+")";
					if(prt.r < 0){prt.r = 0}
					ctx.arc(prt.position.x, prt.position.y, prt.r, 0, 2*Math.PI, false);
					ctx.fill();
					ctx.closePath();
				}
			}
			var grd = ctx.createRadialGradient(this.position.x,this.position.y,3,this.position.x,this.position.y,this.size*4);
			grd.addColorStop(0,"rgb(255,180,0)");
			grd.addColorStop(0.9,"rgb(192,0,0)");
			ctx.beginPath();
			ctx.arc(this.position.x, this.position.y, this.size*4, 0, 2*Math.PI, false);
			ctx.fillStyle = grd;
			ctx.fill();
			ctx.closePath();
		} else {
			var grd = ctx.createRadialGradient(this.position.x,this.position.y,3,this.position.x,this.position.y,this.size*4);
			grd.addColorStop(0,"rgb(255,255,255)");
			grd.addColorStop(0.9,"rgb(180,180,180)");
			ctx.beginPath();
			ctx.arc(this.position.x, this.position.y, this.size*4, 0, 2*Math.PI, false);
			ctx.fillStyle = grd;
			ctx.fill();
			ctx.closePath();
		}
	};
	
	this.Update = function(){
		if(this.startTrigger){
			for(var i in Game.scene.objects){
				if(Game.scene.objects[i].name == "main"){
					main = Game.scene.objects[i];
					break;
				}
			}
			this.startTrigger = false;
		}
	
		if(this.fire){
			var lt = 0;
			for(var i in this.p){
				var prt = this.p[i];
				var now = Date.now();
				if(prt.active){
					prt.r -= this.size*4/10;
					prt.a -= 0.1;
					prt.g -= 10;
					if(this.onRacket){prt.position.y -= 3;}
					if(prt.a <= 0){
						prt.active = false;
					}
				} else {
					if(now - prt.t > 10 && now - lt > 60){
						lt = now;
						prt.t = now;
						prt.active = true;
						prt.position.x = this.position.x;
						prt.position.y = this.position.y;
						prt.a = 1;
						prt.r = this.size*4;
						prt.g = 80;
					}
				}
			}
		}
	
		if(this.angle < -70){this.angle = -70;}
		if(this.angle > 70){this.angle = 70;}
		
		if(this.onRacket){
			this.position.x = Game.mouse.position.x + this.onRacketPosition;
			if(this.position.x > 1024-this.size*4){this.position.x = 1024-this.size*4;}
			if(this.position.x < this.size*4){this.position.x = this.size*4;}
			this.position.y = 682 - this.size*4;
			
			if(Game.mouse.button == 0 && (Game.mouse.up || Game.mouse.down)){
				this.onRacket = false;
			}
			
			if(main.rackSmall){
				if(this.onRacketPosition > 0 && this.onRacketPosition < main.rackWidth/2){
					this.onRacketPosition--;
				}
				if(this.onRacketPosition < 0 && this.onRacketPosition > -main.rackWidth/2){
					this.onRacketPosition++;
				}
			}
			if(main.rackBig && this.onRacketPosition != 0){
				if(this.onRacketPosition > 0 && this.onRacketPosition < main.rackWidth/2){
					this.onRacketPosition++;
				}
				if(this.onRacketPosition < 0 && this.onRacketPosition > -main.rackWidth/2){
					this.onRacketPosition--;
				}
			}
		} else {
			this.position.x += Math.sin(this.angle*Math.PI/180)*this.speed.x;
			this.position.y -= Math.cos(this.angle*Math.PI/180)*this.speed.y;
			
			if(this.position.x - this.size*4 < 0 || this.position.x + this.size*4 > 1024){
				this.speed.x = -this.speed.x;
			}
			if(this.position.y - this.size*4 < 0 || this.position.y + this.size*4 > 800){
				this.speed.y = -this.speed.y;
			}
			if(this.position.y > 768 && !main.end && !this.immortal){
				main.balls--;
				this.hidden = true;
				this.speed.x = 0;
				this.speed.y = 0;
			}
			
			//Chack if collide:
			var balls = 0;
			for(var i in Game.scene.objects){
				var a = Game.scene.objects[i];
				if(a.name == "brick" && a.health > 0){
					var xc = false;
					var yc = false;
					if(this.position.x + this.size*4 >= a.position.x && this.position.x - this.size*4 <= a.position.x + a.size.x){ xc = true; }
					if(this.position.y + this.size*4 >= a.position.y && this.position.y - this.size*4 <= a.position.y + a.size.y){ yc = true; }
					if(xc && yc){
						a.touch = true;
						if(!this.fire || a.isMetal){
							var dx = this.position.x - (a.position.x + a.size.x/2);
							var dy = this.position.y - (a.position.y + a.size.y/2);
							if(Math.abs(dx) > Math.abs(dy)){
								this.position.x += sign(dx)*(this.size*4+a.size.x/2 - Math.abs(dx));
								this.speed.x = -this.speed.x;
							} else {
								this.position.y += sign(dy)*(this.size*4+a.size.y/2 - Math.abs(dy));
								this.speed.y = -this.speed.y;
							}
						}
					}
				}
				if(a.name == "racket"){
					var xc = false;
					var yc = false;
					if(this.position.x + this.size*4 >= a.position - a.size.x/2 - 14 && this.position.x - this.size*4 <= a.position + a.size.x/2 + 14){ xc = true; }
					if(this.position.y + this.size*4 >= 682 && this.position.y - this.size*4 <= 682 + a.size.y){ yc = true; }
					if(xc && yc){
						var dx = this.position.x - a.position;
						var adx = Math.abs(dx);
						var sdx = sign(dx);
						
						if(!a.magnets){
							var dy = this.position.y - 680;
							this.position.y += sign(dy)*(this.size*4+a.size.y/2 - Math.abs(dy));
							this.speed.y = -this.speed.y;

							if(adx > a.size.x/5 && adx <= a.size.x*2/5){
								this.angle = 15;
								//if(sdx != sign(this.speed.x)){
								//	this.speed.x = -this.speed.x;
								//	this.angle = 30;
								//}
							} else {
								if(adx > a.size.x*2/5 && adx <= a.size.x/2){
									this.angle = 30;
								} else {
									if(adx > a.size.x/2 && sign(this.speed.x)!=sign(sdx)){
										this.angle = -70;
									}
								}
							}
						} else {
							this.onRacket = true;
							this.onRacketPosition = dx;
							this.speed.y = -this.speed.y;
							if(sdx != sign(this.speed.x)){
								this.speed.x = -this.speed.x;
							}
							
							if(adx <= a.size.x/4){
								this.angle = 10;
							}
							if(adx > a.size.x/4 && Math.abs(dx) <= a.size.x/2){
								this.angle = 30;
							}
							if(adx > a.size.x/2){
								this.angle = 70;
							}
						}
					}
				}
				if(a.name == "ball"){
					if(main.ballFire){
						a.fire = true;
						main.trigger.fire++;
						if(main.trigger.fire >= main.balls){
							main.ballFire = false;
							main.trigger.fire = 0;
						}
					}
					if(main.ballSmall){
						if(a.size > 1){
							a.size--;
						}
						main.trigger.small++;
						if(main.trigger.small >= main.balls){
							main.ballSmall = false;
							main.trigger.small = 0;
						}
					}
					if(main.ballBig){
						if(a.size < 5){
							a.size++;
						}
						main.trigger.big++;
						if(main.trigger.big >= main.balls){
							main.ballBig = false;
							main.trigger.big = 0;
						}
					}
					if(main.ballSlow){
						if(Math.abs(a.speed.x) > 1){
							a.speed.x /= 2;
							a.speed.y /= 2;
						}
						main.trigger.slow++;
						if(main.trigger.slow >= main.balls){
							main.ballSlow = false;
							main.trigger.slow = 0;
						}
					}
					if(main.ballFast){
						if(Math.abs(a.speed.x) < 17){
							a.speed.x *= 2;
							a.speed.y *= 2;
						}
						main.trigger.fast++;
						if(main.trigger.fast >= main.balls){
							main.ballFast = false;
							main.trigger.fast = 0;
						}
					}
				}
			}
		}
	};
	this.Start = function(){
		for(var i in Game.scene.objects){
			if(Game.scene.objects[i].name == "main"){
				main = Game.scene.objects[i];
				break;
			}
		}
	};
}



var Burst = function(options){
	
	if(!isset(options.big)){options.big = false}
	if(!isset(options.color)){options.color = "255,255,255"}
	
	this.name = "burst";
	this.position = options.position;
	this.z = options.z;
	this.burst = false;
	this.isBig = options.big;
	this.r = 0;
	this.str = 40;
	this.a = 1;
	this.color = options.color;
	this.rgba = "rgba("+this.color+","+this.a+")";
	
	if(this.isBig){this.str = 100; this.a = 0.5}
	
	this.Draw = function(ctx){
		if(this.burst && this.a > 0){
				ctx.beginPath();
				ctx.arc(this.position.x, this.position.y, this.r, 0, 2*Math.PI, false);
				ctx.closePath();
				ctx.lineWidth = this.str;
				ctx.strokeStyle = this.rgba;
				ctx.stroke();
		}
	};
	
	this.Update = function(){
		this.rgba = "rgba("+this.color+","+this.a+")";
		if(this.burst && this.a > 0){
			if(this.isBig){
				this.a -= 0.01;
				this.r += 2;
				this.str -= 2;
			} else {
				this.a -= 0.025;
				this.r++;
				this.str--;
			}
		}
	};
	
	this.Start = function(){};
}

var Bullet = function(options){

	this.name = "bullet";
	this.position = options.position;
	this.size = {x:3, y:18};
	this.speed = 6;
	this.hidden = false;
	
	this.Draw = function(ctx){
		if(!this.hidden){
			ctx.beginPath();
			ctx.rect(this.position.x, this.position.y, this.size.x, this.size.y);
			ctx.closePath();
			var y = this.position.y;
			if(y < 0){y = 0}
			var x = this.position.x;
			if(x < 0){x = 0}
			var lgrd = ctx.createLinearGradient(x, y, x, y + this.size.y);
			lgrd.addColorStop(0, "rgba(255,0,0,1)");
			lgrd.addColorStop(0.7, "rgba(200,100,0,0.5)");
			lgrd.addColorStop(1, "rgba(0,0,0,0)");
			ctx.fillStyle = lgrd;
			ctx.fill();
		}
	}
	
	this.Update = function(){
		if(this.position.y < 0){
			this.hidden = true;
			this.speed = 0;
		} else {
			this.position.y -= this.speed;
			for(var i in Game.scene.objects){
				var a = Game.scene.objects[i];
				if(a.name == "brick" && a.health > 0){
					var xc = false;
					var yc = false;
					if(this.position.x + this.size.x >= a.position.x && this.position.x - this.size.x <= a.position.x + a.size.x){ xc = true; }
					if(this.position.y + this.size.y >= a.position.y && this.position.y <= a.position.y + a.size.y){ yc = true; }
					if(xc && yc){
						a.touch = true;
						if(a.isMetal){
							var burst = new Burst({position:{x:this.position.x+1.5,y:this.position.y},z:3});
							burst.burst = true;
							Game.scene.objects.push(burst);
						}
						this.hidden = true;
						this.speed = 0;
						this.position.y = -999;
					}
				}
			}
		}
	}
	
	this.Start = function(){};
	
}

var Bonus = function(options){

	var main = {};

	if(!isset(options.type)){
		options.type = 13;
	}

	this.name = "bonus";
	this.image = options.image;
	this.position = options.position;
	this.type = options.type;
	this.hidden = false;
	this.direction = Math.round(Math.random()) * 2 - 1;
	this.startpos = {x:this.position.x, y:this.position.y};
	this.k = Math.random()*0.04+0.01;
	this.startTrigger = true;
	
	this.Draw = function(ctx){
		if(!this.hidden){
			ctx.drawImage(this.image, (this.type-1)*32, 228, 32, 32, this.position.x-16, this.position.y-16, 32, 32);
		}
	}
	
	this.Update = function(){
		if(this.startTrigger){
			this.startTrigger = false;
			for(var i in Game.scene.objects){
				if(Game.scene.objects[i].name == "main"){
					main = Game.scene.objects[i];
					break;
				}
			}
		}
		this.position.x += this.direction;
		this.position.y = (this.startpos.x-this.position.x+this.direction*32)*(this.startpos.x-this.position.x+this.direction*32)*this.k + this.startpos.y - 32;
		if(this.position.y > 768){
			this.hidden = true;
		}
		
		for(var i in Game.scene.objects){
			var a = Game.scene.objects[i];
			if(a.name == "racket"){
				var xc = false;
				var yc = false;
				if(this.position.x + 16 >= a.position - a.size.x/2 && this.position.x - 16 <= a.position + a.size.x/2){ xc = true; }
				if(this.position.y + 16 >= 680 && this.position.y - 16 <= 680 + a.size.y){ yc = true; }
				if(xc && yc && !main.rackDeath && !main.end){
					this.hidden = true;
					
					switch(this.type){
					case 1:
						main.lifes--;
						main.rackDeath = true;
						var b = new Burst({position:{x:this.position.x, y:this.position.y}, z:3, big:true, color:"124,0,0"});
						b.burst = true;
						Game.scene.objects.push(b);
						break;
					case 2:
						main.ballSmall = true;
						var b = new Burst({position:{x:this.position.x, y:this.position.y}, z:3, big:true, color:"124,0,0"});
						b.burst = true;
						Game.scene.objects.push(b);
						break;
					case 3:
						main.ballFast = true;
						var b = new Burst({position:{x:this.position.x, y:this.position.y}, z:3, big:true, color:"124,0,0"});
						b.burst = true;
						Game.scene.objects.push(b);
						break;
					case 4:
						main.rackSmall = true;
						var b = new Burst({position:{x:this.position.x, y:this.position.y}, z:3, big:true, color:"124,0,0"});
						b.burst = true;
						Game.scene.objects.push(b);
						break;
					case 5:
						main.lifes++;
						var b = new Burst({position:{x:this.position.x, y:this.position.y}, z:3, big:true, color:"45,80,0"});
						b.burst = true;
						Game.scene.objects.push(b);
						break;
					case 6:
						main.ballBig = true;
						var b = new Burst({position:{x:this.position.x, y:this.position.y}, z:3, big:true, color:"45,80,0"});
						b.burst = true;
						Game.scene.objects.push(b);
						break;
					case 7:
						main.ballSlow = true;
						var b = new Burst({position:{x:this.position.x, y:this.position.y}, z:3, big:true, color:"45,80,0"});
						b.burst = true;
						Game.scene.objects.push(b);
						break;
					case 8:
						main.rackBig = true;
						var b = new Burst({position:{x:this.position.x, y:this.position.y}, z:3, big:true, color:"45,80,0"});
						b.burst = true;
						Game.scene.objects.push(b);
						break;
					case 9:	
						a.guns = true;
						var b = new Burst({position:{x:this.position.x, y:this.position.y}, z:3, big:true, color:"0,78,123"});
						b.burst = true;
						Game.scene.objects.push(b);
						break;
					case 10:
						a.magnets = true;
						var b = new Burst({position:{x:this.position.x, y:this.position.y}, z:3, big:true, color:"0,78,123"});
						b.burst = true;
						Game.scene.objects.push(b);
						break;
					case 11:
						main.ballFire = true;
						var b = new Burst({position:{x:this.position.x, y:this.position.y}, z:3, big:true, color:"0,78,123"});
						b.burst = true;
						Game.scene.objects.push(b);
						break;
					case 12:
						main.ballDouble = true;
						var b = new Burst({position:{x:this.position.x, y:this.position.y}, z:3, big:true, color:"0,78,123"});
						b.burst = true;
						Game.scene.objects.push(b);
						break;
					case 13:
						main.points += 100;
						var b = new Burst({position:{x:this.position.x, y:this.position.y}, z:3, big:true, color:"134,79,0"});
						b.burst = true;
						Game.scene.objects.push(b);
						break;
					case 14:
						var b = new Burst({position:{x:this.position.x, y:this.position.y}, z:3, big:true, color:"134,79,0"});
						b.burst = true;
						Game.scene.objects.push(b);
						main.points += 200;
						break;
					case 15:
						main.points += 500;
						var b = new Burst({position:{x:this.position.x, y:this.position.y}, z:3, big:true, color:"134,79,0"});
						b.burst = true;
						Game.scene.objects.push(b);
						break;
					case 16:
						main.points += 1000;
						var b = new Burst({position:{x:this.position.x, y:this.position.y}, z:3, big:true, color:"134,79,0"});
						b.burst = true;
						Game.scene.objects.push(b);
						break;
					}
				}
			}
		}
	}
	
	this.Start = function(){}
}

var MainObject = function(options){

	if(!isset(options.bricks)){options.bricks = 1;}
	
	this.name = "main";
	this.lifes = 3;
	this.points = 0;
	this.balls = 1;
	this.bricks = options.bricks;
	this.rackWidth = 0;
	this.ballFire = false;
	this.ballSmall = false;
	this.ballBig = false;
	this.ballFast = false;
	this.ballSlow = false;
	this.ballDouble = false;
	this.rackSmall = false;
	this.rackBig = false;
	this.rackDeath = false;
	this.trigger = {fire:0, slow:0, fast:0, big:0, small:0};
	this.deathTime = 0;
	this.end = false;
	this.level = options.level;
	this.win = false;
	
	this.Draw = function(){};
	this.Update = function(){
		var j = 0;
		var r;
		var ri = 0;
		for(var i in Game.scene.objects){
			if(Game.scene.objects[i].name == "ball"){
				j++;
			}
			if(Game.scene.objects[i].name == "racket"){
				r = Game.scene.objects[i];
				ri = i;
			}
		}
		this.balls = j;
	
		if(this.ballDouble){
			this.ballDouble = false;
			if(this.balls < 3){
				this.balls++;
				var ball = new Ball({ position: {x:0,y:0}, z:97, onRacketPosition: Math.round(Math.random()*this.rackWidth/2)*(Math.round(Math.random())*2-1) });
				var k = 0;
				for(var i in Game.scene.objects){
					if(Game.scene.objects[i].name == "racket"){
						k = i;
					}
				}
				var r = Game.scene.objects[k];
				delete Game.scene.objects[k];
				Game.scene.objects.push(ball, r);
			}
		}
		
		if(this.rackDeath && r.size.x <= 0){
			r.hidden = true;
			this.rackDeath = false;
			this.lifes--;
			var b = new Burst({position:{x:r.position, y:680}, z:3, big:true, color:"255,124,0"});
			delete Game.scene.objects[ri];
			this.deathTime = Date.now();
			b.burst = true;
			Game.scene.objects.push(b);
		}
		if(this.deathTime != 0 && Date.now() - this.deathTime > 2000 && !this.end){
			this.deathTime = 0;
			var rack = new Racket({image:tileset, position:512, width:96, z:98});
			Game.scene.objects.push(rack);
			if(this.balls <= 0){
				var ball = new Ball({position:{x:0, y:0}, z:97});
				this.balls = 1;
				Game.scene.objects.push(ball);
			}
		}
		
		if(localStorage.lifes != this.lifes){
			localStorage.lifes = this.lifes;
		}
		if(localStorage.points != this.points){
			localStorage.points = this.points;
		}
		
		if(this.end && this.win){
			localStorage.lastLevel = this.level;
		}
	};
	this.Start = function(){
		if(!isset(localStorage.lifes)){
			localStorage.lifes = 3;
		}
		if(!isset(localStorage.points)){
			localStorage.points = 0;
		}
		this.lifes = Number(localStorage.lifes);
		this.points = Number(localStorage.points);
		this.win = false;
	};
}


var GUI = function(options){
	
	this.name = "gui";
	this.z = 99;
	this.image = options.image;
	this.h = 0;
	this.a = 0;
	this.st = 0;
	
	var main = {};
	
	this.Draw = function(ctx){
		ctx.beginPath();
		ctx.fillStyle = "#000000";
		ctx.drawImage(this.image, 408, 129, 32, 32, 4, 732, 32, 32);
		ctx.drawImage(this.image, 488, 129, 4, 32, 40, 732, 4, 32);
		ctx.fillRect(44, 732, 64, 32);
		ctx.drawImage(this.image, 492, 129, 4, 32, 108, 732, 4, 32);
		ctx.drawImage(this.image, 448, 129, 32, 32, 116, 732, 32, 32);
		ctx.drawImage(this.image, 488, 129, 4, 32, 152, 732, 4, 32);
		ctx.fillRect(156, 732, 256, 32);
		ctx.drawImage(this.image, 492, 129, 4, 32, 412, 732, 4, 32);
		ctx.closePath();
		ctx.beginPath();
		ctx.textAlign = "left";
		ctx.fillStyle = "#FFFFFF";
		ctx.font = "normal 18pt/20pt Roboville";
		ctx.fillText(main.lifes, 47, 757, 50);
		ctx.fillText(main.points, 159, 757, 249);
		ctx.closePath();
		/* bricks */
		ctx.drawImage(this.image, 488, 129, 4, 32, 420, 732, 4, 32);
		ctx.fillStyle = "#000000";
		ctx.fillRect(424, 732, 64, 32);
		ctx.drawImage(this.image, 492, 129, 4, 32, 488, 732, 4, 32);
		ctx.fillStyle = "#FFFFFF";
		ctx.fillText(main.bricks, 427, 757, 58);
		/*  */
		if(main.bricks === "0" || main.lifes === "0"){
			var t = "";
			if(main.bricks === "0"){
				t = "level complete";
			} else {
				t = "failed";
			}
			ctx.fillStyle = "#000000";
			ctx.fillRect(0, 384-this.h/2, 1024, this.h);
			ctx.fillStyle = "rgba(255,255,255,"+this.a+")";
			ctx.textAlign = "center";
			ctx.font = "normal 64pt/66pt Roboville";
			ctx.fillText(t, 512, 406, 1024);
			if(this.h < 256){
				this.h += 4;
			}
			if(this.a < 1 && Date.now() - this.st > 1000){
				this.a += 0.01;
			}
		}
	}
	this.Update = function(){
		if(main.lifes === -1){
			localStorage.fail = true;
			main.lifes = "0";
			this.st = Date.now();
			var turnoff = new Turnoff();
			turnoff.start = Date.now();
			Game.scene.objects.push(turnoff);
			main.end = true;
		}
		if(main.bricks === 0){
			main.bricks = "0";
			this.st = Date.now();
			var turnoff = new Turnoff();
			turnoff.start = Date.now();
			Game.scene.objects.push(turnoff);
			main.end = true;
			main.win = true;
		}
	}
	this.Start = function(){
		localStorage.fail = false;
		for(var i in Game.scene.objects){
			if(Game.scene.objects[i].name == "main"){
				main = Game.scene.objects[i];
				break;
			}
		}
	};
}

var Turnoff = function(){
	this.start =	0;
	this.a =		0;
	
	this.Draw =	function(ctx){
				if(Date.now() - this.start > 5000){
					ctx.fillStyle = "rgba(0,0,0,"+this.a+")";
					ctx.fillRect(0,0,1024,768);
					if(this.a < 1){
						this.a += 0.01;
					} else {
						var k = document.head.getElementsByTagName('script').length;
						for (var i = 0; i < k; i++){
							document.head.removeChild(document.head.getElementsByTagName('script')[0]);
						}
						Game.LoadScene(sceneChooseLevel);
						this.a = 1;
					}
				}
			};
	this.Update =	function(){};
	this.Start =	function(){};
}

var Blink = function(){
	this.startTime = 0;
	this.Draw =	function(ctx){};
	this.Update =	function(){
				if(Date.now() - this.startTime > 5000){	
						this.startTime = Date.now();
						for(var i in Game.scene.objects){
							var a = Game.scene.objects[i];
							if(a.name == "brick"){
								a.Blink();
							}
						}
				}
			};
	this.Start =	function(){
				this.startTime = Date.now();
			};
}