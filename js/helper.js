window.requestAnimFrame = (function(callback){
    return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback){
        window.setTimeout(callback, 1000 / 60);
    };
})();

function extend(Child, Parent){
	var F = function () { };
    F.prototype = Parent.prototype;
    var f = new F();
    
    for (var prop in Child.prototype) f[prop] = Child.prototype[prop];
    Child.prototype = f;
    Child.prototype.super = Parent.prototype;
}

function isset(foo){
	return typeof foo !== 'undefined';
}

function sign(x) { return x ? x < 0 ? -1 : 1 : 0; }


/**
 * @class Helper
 * @constructor
 */
var Helper = {
	'DrawSprite': function(){},
	'DrawRect': function(){},
	'DrawCircle': function(){},
	'DrawText': function(){},
	
	'DrawLine': function(options, ctx){
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
			this.position = {x:0,y:0};
		}
		if(!isset(options.localPosition)){
			this.localPosition = {x:0,y:0};
		}
		if(!isset(options.localRotation)){
			this.localRotation = {x:0,y:0};
		}
		if(!isset(options.angle)){
			this.angle = 0;
		}
		if(!isset(options.scale)){
			this.scale = {x:1,y:1};
		}
		if(!isset(options.stroke)){
			this.stroke = 1;
		}
		if(!isset(options.strokeColor)){
			this.strokeColor = 'rgba(255,0,255,1)';
		}
		
		if(!isset(options.end)){
			this.end = {x:1,y:1};
		}

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
	}
}