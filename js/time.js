/**
 * @class Time
 * @constructor
 */
var Time = function(){
	this.time = 0;
	this.sceneLoaded = 0;
	this.lastFrame = 0;
	this.sinceSceneLoaded = 0;
	this.deltaTime = 0;
	this.timeScale = 0;
	this.frameCount = 0;
	this.totalFrames = 0;
	this.avfps = 0;
	this.fps = 0;
	this.scale = 1;
	this.Tick = function(){
		this.time = Date.now();
		this.sinceSceneLoaded = this.time - this.sceneLoaded;
		this.deltaTime = this.time - this.lastFrame;
		this.lastFrame = this.time;
		this.frameCount++;
		this.totalFrames++;
		this.avfps = Math.round(1000*this.totalFrames/this.sinceSceneLoaded);
	}
	this.Framerate = function(){
		this.fps = this.frameCount;
		this.frameCount = 0;
	}
}