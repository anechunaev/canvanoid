var Game = {
	cnv : document.getElementById("cnv"),
	ctx : document.getElementById("cnv").getContext("2d"),
	status : 'init',
	scene : {},
	time : new Time(),
	
	Start : function(options){
		this.status = 'loading';
		this.scene = options.scene;

		// Insertion sort
		for(var i in this.scene.objects){
			if(!isset(this.scene.objects[i].z)) this.scene.objects[i].z = i;
			var obj = this.scene.objects[i];
			var key = obj.z;
			for(j = i-1; j > -1 && this.scene.objects[j].z > key; j--){
				this.scene.objects[j+1] = this.scene.objects[j];
			}
			this.scene.objects[j+1] = obj;
		}
		
		// Loading sources
		var k = 0;
		while(this.status != 'ready'){
			if(this.scene.sources.length==0){
				this.status = 'ready';
				break;
			} else {
				if(this.scene.sources[k].complete){
					k++;
					if(k >= this.scene.sources.length){
						this.status = 'ready';
						break;
					}
				}
			}
		}
		
		
		// Mouse input
		this.mouse = {position:{x:0, y:0}, button:0, down:false, up:false};
		this.cnv.addEventListener('mousemove', function(e){
			Game.mouse.position.x = e.layerX - e.target.offsetLeft;
			Game.mouse.position.y = e.layerY - e.target.offsetTop;
		}, false);
		this.cnv.addEventListener('mousedown', function(e){
			Game.mouse.button = e.button;
			Game.mouse.down = true;
		});
		this.cnv.addEventListener('mouseup', function(e){
			Game.mouse.button = e.button;
			Game.mouse.up = true;
			Game.mouse.down = false;
		});
		
		this.time.sceneLoaded = Date.now();
		this.time.Tick();
		
		// Run "Start" functions
		for(var i in this.scene.objects){
			this.scene.objects[i].Start();
		}
	},
	
	Draw : function(){
		//if(this.status == 'run'){
			requestAnimFrame(function(){Game.Draw()});
			this.ctx.clearRect(0, 0, this.cnv.width, this.cnv.height);
			this.time.Tick();
			
			for(var i in this.scene.objects){
				this.scene.objects[i].Update();
				this.scene.objects[i].Draw(this.ctx);
				//this.scene.GUI();
			}
			
			Game.mouse.up = false;
		//}
	},
	
	Run : function(options){
		setInterval(function(){Game.time.Framerate()}, 1000);
		this.Start(options);
		
		if(this.status == 'ready'){
			this.status = 'run';
			this.Draw();
		}
	},
	
	LoadScene : function(scene){
		this.status = 'init';
		this.time = null;
		this.time = new Time();
		this.scene = {};
		this.Start({scene: scene});
	}
};