/**
 * @class Vector2
 * @constructor
 * @param {Number} x
 * @param {Number} y
 */
var Vector2 = function(x, y){
	this.x = x;
	this.y = y;
	
	if(typeof x === 'undefined') this.x = 0;
	if(typeof y === 'undefined') this.y = 0;
}

/**
 * @class Vector3
 * @constructor
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 */
var Vector3 = function(x, y, z){
	this.x = x;
	this.y = y;
	this.z = z;
	
	if(typeof x === 'undefined') this.x = 0;
	if(typeof y === 'undefined') this.y = 0;
	if(typeof z === 'undefined') this.z = 0;
}