/**
 * @class Sprite
 * @requires Transform
 * @requires Vector2
 * @constructor
 * @param {Object} options
 */
var Sprite = function(options){

	// Vars
	this.image = options.image; // Image
	this.hidden = options.hidden; // Boolean
	this.position = options.position; // Vector2
	this.localPosition = options.localPosition; // Vector2
	this.localRotation = options.localRotation; // Vector2
	this.angle = options.angle; // Number
	this.scale = options.scale; // Vector2
	this.z = options.z; // Number
	this.size = options.size; // Vector2
	this.delta = options.delta; // Vector2
	this.deltaScale = options.deltaScale; // Vector2
	
	// Checking if some important vars exists
	if(!isset(options.hidden)){
		this.hidden = false;
	}
	if(!isset(options.position)){
		this.position = {x:0,y:0};
	}
	if(!isset(options.localPosition)){
		this.localPosition = {x:0,y:0};
	}
	if(!isset(options.localRotation)){
		this.localRotation = {x:0, y:0};
	}
	if(!isset(options.angle)){
		this.angle = 0;
	}
	if(!isset(options.scale)){
		this.scale = {x:1, y:1};
	}
	if(!isset(options.delta)){
		this.delta = {x:0, y:0};
	}
	
	this.firstDraw = true;
}
Sprite.prototype = {
				/**
				 * Drawing this object
				 * @param {Object} ctx
				 */
	"Draw"	:	function(ctx){
					if(this.firstDraw){
						if(!isset(this.size)){
							this.size = {x:this.image.width, y:this.image.height};
						}
						if(!isset(this.deltaScale)){
							this.deltaScale = {x:this.size.x, y:this.size.y};
						}
						this.firstDraw = false;
					}
					
					if(!this.hidden){
						ctx.save();
						ctx.translate(this.position.x, this.position.y);
						ctx.scale(this.scale.x, this.scale.y);
						ctx.rotate(this.angle);
						ctx.translate(-this.localPosition.x, -this.localPosition.y);
						ctx.drawImage(this.image, this.delta.x, this.delta.y, this.deltaScale.x, this.deltaScale.y, 0, 0, this.size.x, this.size.y);
						ctx.restore();
					}
				},
	"Start"	:	function(){},
	"Update":	function(){}
}


/**
 * @class Rect
 * @requires Transform
 * @requires Vector2
 * @constructor
 * @param {Object} options
 */
var Rect = function(options){

	// Vars
	this.hidden = options.hidden; // Boolean
	this.position = options.position; // Vector2
	this.localPosition = options.localPosition; // Vector2
	this.localRotation = options.localRotation; // Vector2
	this.angle = options.angle; // Number
	this.scale = options.scale; // Vector2
	this.z = options.z; // Number
	this.size = options.size; // Vector2
	this.color = options.color; // String
	this.stroke = options.stroke; // Number
	this.strokeColor = options.strokeColor; // String
	
	this.radialGradient = options.radialGradient; // String
	this.linearGradient = options.linearGradient; // String
	
	// Checking vars
	if(!isset(options.hidden)){
		this.hidden = false;
	}
	if(!isset(options.position)){
		this.position = {x:0, y:0};
	}
	if(!isset(options.localPosition)){
		this.localPosition = {x:0, y:0};
	}
	if(!isset(options.localRotation)){
		this.localRotation = {x:0, y:0};
	}
	if(!isset(options.size)){
		this.size = {x:0, y:0};
	}
	if(!isset(options.angle)){
		this.angle = 0;
	}
	if(!isset(options.scale)){
		this.scale = {x:1, y:1};
	}
	if(!isset(options.color)){
		this.color = 'rgba(0,0,0,0)';
	}
	if(!isset(options.stroke)){
		this.stroke = 0;
	}
	if(!isset(options.strokeColor)){
		this.strokeColor = 'rgba(0,0,0,1)';
	}
}
Rect.prototype = {
				/**
				 * Drawing this object
				 * @param {Object} ctx
				 */
	"Draw"	:	function(ctx){
					if(!this.hidden){
						ctx.save();
						ctx.translate(this.position.x, this.position.y);
						ctx.scale(this.scale.x, this.scale.y);
						ctx.rotate(this.angle);
						ctx.translate(-this.localPosition.x, -this.localPosition.y);
						
						// Drawing
						ctx.beginPath();
						ctx.rect(0, 0, this.size.x, this.size.y);
						
						// DEBUG
						if(isset(this.radialGradient) && this.radialGradient.length != 0){
							var grd = ctx.createRadialGradient(0,0,0,0,0,this.radius);
							for(var i in this.radialGradient){
								grd.addColorStop(this.radialGradient[i][0],this.radialGradient[i][1]);
							}
							ctx.fillStyle = grd;
						} else {
							var _x = this.size.x;
							if(isset(this.linearGradient) && this.linearGradient.length != 0){
								var grd = ctx.createLinearGradient(0, 0, this.size.x, 0);
								for(var i in this.linearGradient){
									grd.addColorStop(this.linearGradient[i][0],this.linearGradient[i][1]);
								}
								ctx.fillStyle = grd;
							} else {
								ctx.fillStyle = this.color;
							}
						}
						// DEBUG
						
						if(this.stroke != 0){
							ctx.lineWidth = this.stroke;
							ctx.strokeStyle = this.strokeColor;
							ctx.stroke();
						}
						ctx.fill();
						
						ctx.restore();
					}
				},
	"Start"	:	function(){},
	"Update":	function(){}
}


/**
 * @class Circle
 * @requires Transform
 * @requires Vector2
 * @constructor
 * @param {Object} options
 */
var Circle = function(options){

	// Vars
	this.hidden = options.hidden; // Boolean
	this.position = options.position; // Vector2
	this.localPosition = options.localPosition; // Vector2
	this.localRotation = options.localRotation; // Vector2
	this.angle = options.angle; // Number
	this.scale = options.scale; // Vector2
	this.z = options.z; // Number
	this.radius = options.radius; // Number
	this.sdeg = options.startDegrees; // Number, rad
	this.edeg = options.endDegrees; // Number, rad
	this.ccw = options.counterClockwise; // Boolean
	this.stroke = options.stroke; // Number
	this.color = options.color; // String
	this.strokeColor = options.strokeColor; // String
	
	this.radialGradient = options.radialGradient; // String
	this.linearGradient = options.radialGradient; // String
	
	// Checking vars
	if(!isset(options.hidden)){
		this.hidden = false;
	}
	if(!isset(options.position)){
		this.position = {x:0, y:0};
	}
	if(!isset(options.localPosition)){
		this.localPosition = {x:0, y:0};
	}
	if(!isset(options.localRotation)){
		this.localRotation = {x:0, y:0};
	}
	if(!isset(options.angle)){
		this.angle = 0;
	}
	if(!isset(options.scale)){
		this.scale = {x:1, y:1};
	}
	if(!isset(options.startDegrees)){
		this.sdeg = 0;
	}
	if(!isset(options.endDegrees)){
		this.edeg = Math.PI*2;
	}
	if(!isset(options.counterClockwise))
	{
		this.ccw = false;
	}
	if(!isset(options.color)){
		this.color = 'rgba(0,0,0,0)';
	}
	if(!isset(options.stroke)){
		this.stroke = 0;
	}
	if(!isset(options.strokeColor)){
		this.strokeColor = 'rgba(0,0,0,1)';
	}
}
Circle.prototype = {
				/**
				 * Drawing this object
				 * @param {Object} ctx
				 */
	"Draw"	:	function(ctx){
					if(!this.hidden){
						ctx.save();
						ctx.translate(this.position.x, this.position.y);
						ctx.scale(this.scale.x, this.scale.y);
						ctx.rotate(this.angle);
						ctx.translate(-this.localPosition.x, -this.localPosition.y);
						
						// DEBUG
						if(isset(this.radialGradient) && this.radialGradient.length != 0){
							var t = ctx.createRadialGradient(0,0,0,0,0,this.radius);
							for(var i in this.radialGradient){
								t.addColorStop(this.radialGradient[i][0],this.radialGradient[i][1]);
							}
							ctx.fillStyle = t;
						} else {
							ctx.fillStyle = this.color;
						}
						// DEBUG
						
						// Drawing
						ctx.beginPath();
						ctx.arc(0, 0, this.radius, this.sdeg, this.edeg, this.ccw);
						ctx.fill();
						if(this.stroke != 0){
							ctx.lineWidth = this.stroke;
							ctx.strokeStyle = this.strokeColor;
							ctx.stroke();
						}
						
						ctx.restore();
					}
				},
	"Start"	:	function(){},
	"Update":	function(){}
}

var Text = function(options){
	// Vars
	this.hidden = options.hidden; // Boolean
	this.position = options.position; // Vector2
	this.localPosition = options.localPosition; // Vector2
	this.localRotation = options.localRotation; // Vector2
	this.maxWidth = options.maxWidth; // Number
	this.angle = options.angle; // Number
	this.scale = options.scale; // Vector2
	this.z = options.z; // Number
	this.color = options.color; // String
	this.style = options.style; // String
	this.stroke = options.stroke; // Number
	this.strokeColor = options.strokeColor; // String
	this.text = options.text; // String
	this.align = options.align; // String
	this.baseline = options.baseline; // String
	this.shadow = options.shadow; // String
	this.shadowOffset = options.shadowOffset; // Vector2
	this.shadowBlur = options.shadowBlur; // Number
	
	// Checking vars
	if(!isset(options.hidden)){
		this.hidden = false;
	}
	if(!isset(options.position)){
		this.position = {x:0, y:0};
	}
	if(!isset(options.localPosition)){
		this.localPosition = {x:0, y:0};
	}
	if(!isset(options.localRotation)){
		this.localRotation = {x:0, y:0};
	}
	if(!isset(options.maxWidth)){
		this.maxWidth = 2000;
	}
	if(!isset(options.angle)){
		this.angle = 0;
	}
	if(!isset(options.scale)){
		this.scale = {x:1, y:1};
	}
	if(!isset(options.color)){
		this.color = '#FFF';
	}
	if(!isset(options.style)){
		this.style = 'normal 10pt/12pt sans-serif';
	}
	if(!isset(options.stroke)){
		this.stroke = 0;
	}
	if(!isset(options.strokeColor)){
		this.strokeColor = 'rgba(0,0,0,1)';
	}
	if(!isset(options.text)){
		this.text = '';
	}
	if(!isset(options.align)){
		this.align = 'left';
	}
	if(!isset(options.baseline)){
		this.baseline = 'alphabetic';
	}
	if(!isset(options.shadow)){
		this.shadow = 'rgba(0,0,0,0)';
	}
	if(!isset(options.shadowOffset)){
		this.shadowOffset = {x:0, y:0};
	}
	if(!isset(options.shadowBlur)){
		this.shadowBlur = 0;
	}
}
Text.prototype = {
				/**
				 * Drawing this object
				 * @param {Object} ctx
				 */
	"Draw"	:	function(ctx){
					if(!this.hidden){
						ctx.save();
						ctx.translate(this.position.x, this.position.y);
						ctx.scale(this.scale.x, this.scale.y);
						ctx.rotate(this.angle);
						ctx.translate(-this.localPosition.x, -this.localPosition.y);
						
						// Drawing
						ctx.shadowColor = this.shadow;
						ctx.shadowOffsetX = this.shadowOffset.x;
						ctx.shadowOffsetY = this.shadowOffset.y;
						ctx.shadowBlur = this.shadowBlur;
						ctx.textBaseline = this.baseline;
						ctx.textAlign = this.align;
						ctx.fillStyle = this.color;
						ctx.font = this.style;
						ctx.fillText(this.text, 0, 0, this.maxWidth);
						if(this.stroke != 0){
							ctx.strokeStyle = this.strokeColor;
							ctx.strokeText(this.text, 0, 0, this.maxWidth);
						}
						
						ctx.restore();
					}
				},
	"Start"	:	function(){},
	"Update":	function(){}
}

/**
 * @class Line
 * @requires Transform
 * @requires Vector2
 * @constructor
 * @param {Object} options
 */
var Line = function(options){

	// Vars
	this.hidden = options.hidden; // Boolean
	this.position = options.position; // Vector2
	this.localPosition = options.localPosition; // Vector2
	this.localRotation = options.localRotation; // Vector2
	this.angle = options.angle; // Number
	this.scale = options.scale; // Vector2
	this.z = options.z; // Number
	this.stroke = options.stroke; // Number
	this.strokeColor = options.strokeColor; // String
	
	this.end = options.end; // Vector2
	
	this.radialGradient = options.radialGradient; // String
	this.linearGradient = options.linearGradient; // String
	
	// Checking vars
	if(!isset(options.hidden)){
		this.hidden = false;
	}
	if(!isset(options.position)){
		this.position = {x:0, y:0};
	}
	if(!isset(options.localPosition)){
		this.localPosition = {x:0, y:0};
	}
	if(!isset(options.localRotation)){
		this.localRotation = {x:0, y:0};
	}
	if(!isset(options.angle)){
		this.angle = 0;
	}
	if(!isset(options.scale)){
		this.scale = {x:1, y:1};
	}
	if(!isset(options.stroke)){
		this.stroke = 1;
	}
	if(!isset(options.strokeColor)){
		this.strokeColor = 'rgba(255,0,255,1)';
	}
	
	if(!isset(options.end)){
		this.end = {x:1, y:1};
	}
}
Line.prototype = {
				/**
				 * Drawing this object
				 * @param {Object} ctx
				 */
	"Draw"	:	function(ctx){
					if(!this.hidden){
						ctx.save();
						ctx.translate(this.position.x, this.position.y);
						ctx.scale(this.scale.x, this.scale.y);
						ctx.rotate(this.angle);
						ctx.translate(-this.localPosition.x, -this.localPosition.y);
						
						// Drawing
						ctx.beginPath();
						ctx.moveTo(0, 0);
						ctx.lineTo(this.end.x, this.end.y);
						ctx.lineWidth = this.stroke;
						ctx.strokeStyle = this.strokeColor;
						ctx.stroke();
						
						ctx.restore();
					}
				},
	"Start"	:	function(){},
	"Update":	function(){}
}