/**
 * @class Input
 * @constructor
 */
var Input = function(){
	this.mouse = {position:{x:0, y:0}, button:[0,0]};
	Game.cnv.addEventListener('mousemove', function(e){
		Input.mouse.position.x = e.layerX;
		Input.mouse.position.y = e.layerY;
	}, false);
	Game.cnv.addEventListener('mousedown', function(e){
		console.log('Mouse down');
	}, false);
}