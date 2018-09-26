function requestFullscreen(element) {
	if (element.requestFullscreen) {
		element.requestFullscreen();
	} else if (element.mozRequestFullScreen) {
		element.mozRequestFullScreen();
	} else if (element.webkitRequestFullScreen) {
		element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
	}
}
document.fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.documentElement.webkitRequestFullScreen;



function swipedetect(el, callback){

	var touchsurface = el,
	swipedir,
	startX,
	startY,
	distX,
	distY,
    threshold = 50, //required min distance traveled to be considered swipe
    restraint = 100, // maximum distance allowed at the same time in perpendicular direction
    allowedTime = 300, // maximum time allowed to travel that distance
    elapsedTime,
    startTime,
    handleswipe = callback || function(swipedir){}

    touchsurface.addEventListener('touchstart', function(e){
    	var touchobj = e.changedTouches[0]
    	swipedir = 'none'
    	dist = 0
    	startX = touchobj.pageX
    	startY = touchobj.pageY
        startTime = new Date().getTime() // record time when finger first makes contact with surface
        // e.preventDefault()
    }, false)

    touchsurface.addEventListener('touchmove', function(e){
        // e.preventDefault() // prevent scrolling when inside DIV
    }, false)

    touchsurface.addEventListener('touchend', function(e){
    	var touchobj = e.changedTouches[0]
        distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
        distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
        elapsedTime = new Date().getTime() - startTime // get time elapsed
        if (elapsedTime <= allowedTime){ // first condition for awipe met
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){ // 2nd condition for horizontal swipe met
                swipedir = (distX < 0)? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
            }
            else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){ // 2nd condition for vertical swipe met
                swipedir = (distY < 0)? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
            }
        }
        handleswipe(swipedir)
        // e.preventDefault()
    }, false)
}

window.getParameterByName = function(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
	results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}


window.yt_ready = true;
window.onYouTubeIframeAPIReady = function() {
	window.yt_ready = true;
	if(window.app && !window.app.initialized) window.app.init();
}

/**************** APP FUNCTIONALITY *******************/

var PBJ = function(){
}
var s = PBJ;
var p = s.prototype;


window.ASSET_URL = "https://s3.eu-central-1.amazonaws.com/pbjcampaign";
// window.ASSET_URL = "assets";


p.init = function (){
	this.initialized = true;
	setTimeout(function(){
		this.init_internal();
	}.bind(this), 100);

}
p.init_internal = function (){

	

	this.INSTRUCTION_STEPS = []
	var introStep = {
		selector : "intro",
		start: 1.5,
		end: 5.5
	}
	this.INSTRUCTION_STEPS.push(introStep);

	var instructionsStep = {
		selector : $.browser.mobile ? "instructionsMobile" : "instructionsDesktop",
		start: 6.5,
		end: 14
	}
	this.INSTRUCTION_STEPS.push(instructionsStep);

	var ctaStep = {
		selector : "cta",
		start: 15.5,
		end: 20
	}
	this.INSTRUCTION_STEPS.push(ctaStep);


	this.IS_MOBILE = $.browser.mobile;


	this.FADE_TIME = 500;

	this.BASE_SRC = ""
	this.TRACKS = {
		"peter" : {},
		"bjorn" : {},
		"john" : {}
	}

	this.x = 0, this.y = 0;
	this.SOURCE_RECT = {w: 1920 * 2, h: 1080 * 2};
	this.NUM_COLS = 2, this.NUM_ROWS = 2;
	this.TILE_RECT = {w: this.SOURCE_RECT.w/this.NUM_COLS, h: this.SOURCE_RECT.h/this.NUM_ROWS};
	this.numLoaded = 0;




	

	this.$videoWrapper = $('.PBJ__videoWrapper');
	this.videoWrapper = this.$videoWrapper[0];

	this.$overlay = $('.PBJ__overlay');
	this.overlay = this.$overlay[0];

	this.$loader = $('.PBJ__loader');
	this.loader = this.$loader[0];

	this.$menu = $('.PBJ__menu');
	this.menu = this.$menu[0];

	this.$intro = $('.PBJ__intro');
	this.intro = this.$intro[0];


	if($.browser.mobile){
		$('html').addClass('mobile');
	}


	if($.browser.mobile && 'playsInline' in document.createElement('video')){
		//SUPPORT
	}else{
		//FALLBACK REDIRECT
	}



	if($("html").hasClass("videoautoplay")){
		this._autostart = true;
		//CAN AUTOSTART
	}else{
		this._autostart = false;
		//ADD STARTBTN
		
	}

	this.load();
	this.resize();
	$(window).resize(this.resize.bind(this));
}


/************** INTRO ******************/

p.showInstructions = function(){
	this.$intro.show();
	TweenMax.to(this.intro, .5, {opacity: 1});
	for(var i = 0; i < this.INSTRUCTION_STEPS.length; i++){
		var step = this.INSTRUCTION_STEPS[i];
		var $el;
		var t = .5;
		TweenMax.delayedCall(step.start, function(step){
			$el = $(".PBJ__intro--" + step.selector);
			$el.addClass('active');
			TweenMax.to($el, t, {opacity: 1, ease: Quad.easeInOut, onComplete: function(step){
			}.bind(this, step)});
		}.bind(this, step));

		TweenMax.delayedCall(step.end, function(step){
			$el = $(".PBJ__intro--" + step.selector);
			TweenMax.to($el, t, {opacity: 0, ease: Quad.easeInOut, onComplete: function(step){
				$el = $(".PBJ__intro--" + step.selector);
				$el.removeClass('active');
			}.bind(this, step)});

		}.bind(this, step));
	}
}

p.hideInstructions = function(){

	if(this.instuctions_done){
		this.showMenu();
		return;
	}

	this.instuctions_done = true;

	TweenMax.to(this.$intro, .5, {opacity: 0, onComplete: function(){
		this.$intro.hide();
		this.showMenu();
	}.bind(this)});
	
}


/******************** MENU ************************/

p.showMenu = function(){

	if(this.menu_visible || !this.instuctions_done) return;

	// if(!$.browser.mobile) return;
	this.menu_visible = true;

	clearTimeout(this._menuAutoHideID);

	this.$menu.show();
	TweenMax.to(this.menu, .5, {opacity: 1});

	this._menuAutoHideID = setTimeout(this.hideMenu.bind(this), 2000);
}


p.hideMenu = function(){
	clearTimeout(this._menuAutoHideID);

	this.menu_visible = false;
	TweenMax.to(this.menu, .5, {opacity: 0, onComplete: function(){
		this.$menu.hide();
	}.bind(this)});
}


/************* LOADING METHODS *************/

p.load = function(){
	this.$loader.show();
	TweenMax.to(this.loader, .5, {opacity: 1});
	setTimeout(function(){
		this.load_min_time = true;
		if(this.video_ready && this.sound_ready) this.onReady();
	}.bind(this), 2000);

	this.loadSounds();
	this.loadVideo();




}

p.loadSounds = function(){
	this.numSoundLoaded = 0;
	this.numSoundFiles = 0;


	this.global_volume = 1;

	for(var i in this.TRACKS){
		this.numSoundFiles++;

		var srcMp3 = ASSET_URL + "/" + i.toUpperCase() + "_SOUND.mp3";
		var srcOgg = ASSET_URL + "/" + i.toUpperCase() + "_SOUND.ogg";

		this.TRACKS[i].player = new Howl({
			src: [srcOgg, srcMp3],
			autoplay: false,
			loop: false,
			volume: 0
		});

		this.TRACKS[i].player.once('load', function(){
			this.onSoundFileLoaded();
		}.bind(this));
	}
}

p.onSoundFileLoaded = function(){
	this.numSoundLoaded++;
	// console.log(" + + SOUND",this.numSoundLoaded);
	if(this.numSoundLoaded == this.numSoundFiles) this.onSoundFilesComplete();
}

p.onSoundFilesComplete = function(){
	if(this.load_complete) return;
	this.load_complete = true;
	// console.log(" + + SOUND LOADED");
	this.sound_ready = true;
	if(this.video_ready) this.onReady();
}

p.loadVideo = function(){

	this.player_type = "yt";//getParameterByName('player');

	if(this.player_type == "yt"){
		var videoID = "Vhqn1-pds5w";//getParameterByName("id");
		this.player = new YTPlayer(videoID);
		this.$player = $(this.player);
		this.player.createPlayer(this.videoWrapper, this.onVideoLoaded.bind(this));
	}else{
		this.$player = $(".PBJ__videoPlayer");
		this.player = $(".PBJ__videoPlayer")[0];
		this.player.video = $(".PBJ__videoPlayer")[0];
		this.$player.one('canplaythrough', this.onVideoLoaded.bind(this));
		
		var q = getParameterByName("q");
		var src = q == "h" ? "/ALLA_FILMER_4K_HIGH.mp4" : "/ALLA_FILMER_4K.mp4";
		this.player.src = ASSET_URL + src;
		this.player.load();
	}
	

}


p.onVideoLoaded = function(video){
	// console.log(' + + VIDEO LOADED');
	this.video_ready = true;
	if(this.sound_ready) this.onReady();
}


p.onReady = function(){
	if(this._ready) return;
	if(!this.load_min_time) return;
	this._ready = true;
	// console.log("--ready");
	this.redrawCanvas(4);
	TweenMax.to(this.loader, 1, {opacity: 0, ease:Sine.easeInOut, onComplete: function(){
		this.$loader.hide();
	}.bind(this)});
	TweenMax.to(this.videoWrapper, 2, {opacity: 1, ease:Sine.easeInOut});



	// if(this.player_type != "yt"){
	// 	window.player = this.player.video;
	// 	setInterval(checkBuffering)
	// 	checkBuffering(this.player.video);
	// }
	

	if(this._autostart){
		this.start();
	}else{
		$('.PBJ__overlay').css('cursor', 'pointer');
		$('.PBJ__overlay').one('click', function(){
			this.start();
				//show play icon
			}.bind(this))
	}

	this.showInstructions();	
}




/************* PLAYBACK METHODS ********************/

p.start = function(){
	// console.log("START-----");
	this.currentTrack = "all";
	this.addEventListeners();
	this.startPlayback();

}


p.stopPlayback = function(stopVideo){
	if(stopVideo)this.player.pause();
	for(var i in this.TRACKS){
		// this.pause();
		// this.TRACKS[i].player.pause();
		this.fadeOutTrack(i, 0);
	}
}	


p.togglePlay = function(){

	
	if(this._playing){
		this._paused = true;
		this.stopPlayback(true);
	}else{
		this._paused = false;
		if(!this._buffering) this.startPlayback(this.currentTrack);
	}
}




p.redrawCanvas = function(tile){
	if(!tile) return;

	this.currentTile = tile;

	var rect = this.getTileRect(tile);
	this.x = rect.col * (this.TILE_RECT.w) * -1;
	this.y = rect.row * (this.TILE_RECT.h) * -1;
	// console.log('redraw canvas', tile);
	TweenMax.set(this.player.video, {x: this.x * this.scale, y: -50 + this.y * this.scale});
}



p.onEnd = function(){
	
	this._ended = true;
	for(var i in this.TRACKS){
		this.fadeOutTrack(i);
	}

	TweenMax.to(this.videoWrapper, 2, {opacity: 0});
}


p.setTrack = function(id){
	// console.log(this.currentTrack, id, "set track----");
	if(this.currentTrack == id){
		return;
	}


	if(this.currentTrack == "all"){
		this.playTrack(id);
		this.currentTrack = id;
		return;
	}

	this.currentTrack = id;

	if(this.currentTrack == "all") this.global_volume = .7;
	else this.global_volume = 1;

	if(this._playing){
		this.$player.one("pause", function(){
			this.startPlayback();
		}.bind(this));
		this.player.pause();
	}else{
		this.startPlayback();
	}
	

}

p.startPlayback = function(){
	// console.log("START PLAYBACK");
	var syncTime = this.player._getCurrentTime ? this.player._getCurrentTime() : this.player.currentTime;
	// console.log('SYNC TIME -- ', syncTime);
	var numReady = 0;
	for(var i in this.TRACKS){
		if ( this.currentTrack == i || this.currentTrack == 'all'){
			this.TRACKS[i].player.once('seek', function(i){
				numReady++;
				if(this.currentTrack != "all" || numReady == 3){
					this.player.play();
					this.playTrack(this.currentTrack);
				}
			}.bind(this, i));
			if(this.TRACKS[i].player.playing()){
				this.TRACKS[i].player.pause();
				this.TRACKS[i].isPlaying = false;
			}
			this.TRACKS[i].player.seek(this.player._getCurrentTime ? this.player._getCurrentTime() : this.player.currentTime);
		}
	}
}


p.playTrack = function(id){
	// console.log('active track is', id);
	$(".PBJ__menu li").removeClass('active');
	$(".PBJ__menu li." + id).addClass('active');
		for(var i in this.TRACKS){
			if(id == "all" || id == i){
				this.fadeInTrack(i);
			}else{
				this.fadeOutTrack(i);
			}
			
		}
}

p.fadeInTrack = function(id){
	if(this.TRACKS[id].isPlaying) return;
	this.TRACKS[id].isPlaying = true;
	if(!this.TRACKS[id].player.playing())this.TRACKS[id].player.play();
	this.TRACKS[id].player.off('fade');
	this.TRACKS[id].player.once('fade', function(){

	});
	this.TRACKS[id].player.fade(this.TRACKS[id].player.volume(), this.global_volume, this.FADE_TIME);
}

p.fadeOutTrack = function(id, time){
	time = isNaN(time) ? this.FADE_TIME : time;
	this.TRACKS[id].isPlaying = false;
	this.TRACKS[id].player.off('fade');
	if(time > 0){
		this.TRACKS[id].player.once('fade', function(){
			if(this.playing())this.pause();
		});
		this.TRACKS[id].player.fade(this.TRACKS[id].player.volume(), 0, this.FADE_TIME);
	}else{
		if(this.TRACKS[id].player.playing())this.TRACKS[id].player.pause();
	}
}

/************* APP METHODS ********************/
p.addEventListeners = function(){
	this.$player.on("play", function(){
		this._playing = true;
		if(this._buffering){
			this.player.pause();
			this.startPlayback();
		}
		this._buffering = false;
	}.bind(this));

	this.$player.on("pause", function(){
		this._playing = false;
	}.bind(this));

	this.$player.on("ended", function(){
		this._playing = false;
		this.onEnd();
	}.bind(this));

	this.$player.on("waiting", function(){
		this._buffering = true;
		//for native player
		this.$player.one('canplay', function(){
			this._buffering = false;
			if(!this._paused) this.startPlayback();
		}.bind(this));

		if(this._playing) this.stopPlayback(true);
	}.bind(this));

	$(".PBJ__menu li").each(function(i, item){
		$(item).on("click", function(id){
			this.onInteraction(id);
		}.bind(this, i));
	}.bind(this));


	$(".PBJ__menu li").on("click", function(event){
	}.bind(this));

	$(document).keypress(function(event){
		this.onInteraction(event.which);
	}.bind(this));

	$(document).mousemove(function(event){
		this.showMenu();
	}.bind(this));

	var currNum = 3;
	var maxNum = 3;
	swipedetect(document, function(swipedir){
		var dir = 0;
		if(swipedir == "left") dir = 1;
		else if(swipedir == "right") dir = -1;
		currNum += dir;
		if(currNum > maxNum) currNum = 0;
		if(currNum < 0) currNum = maxNum;
		this.onInteraction(currNum);
	}.bind(this));

}


p.onInteraction = function(id){

	if(this._ended) return;
	this.hideInstructions();

	switch(id){
		case 109:
		this._mute = true;
		this.setTrack();
		break;

		case 32:
		this.togglePlay();
		break;

		case 102:
		case 70:
		if (document.fullscreenEnabled) {
			requestFullscreen(document.body);
		}
		break;

		case 112:
		case 80:
		case 0:
		this.redrawCanvas(1);
		this.setTrack("peter");
		break;

		case 98:
		case 66:
		case 1:
		this.redrawCanvas(2);
		this.setTrack("bjorn");
		break;

		case 106:
		case 74:
		case 2:
		this.redrawCanvas(3);
		this.setTrack("john");
		break;

		case 97:
		case 65:
		case 3:
		this.redrawCanvas(4);
		this.setTrack("all");
		break;
	}
}


p.resize = function(){

	var w = window.innerWidth;
	var h = window.innerHeight;

	var scale = w / (this.TILE_RECT.w);
	if(scale * this.TILE_RECT.h > h) scale = h / (this.TILE_RECT.h);

	var nw = scale * this.TILE_RECT.w;
	var nh = scale * this.TILE_RECT.h;

	var x = (w - nw) * .5;
	var y = (h - nh) * .5;

	this.$videoWrapper.width(nw).height(nh);
	this.$videoWrapper.css({left: x, top: y});
	this.scale = scale;
	this.redrawCanvas(this.currentTile);
}


/*********************** UTILS ***********************/

p.getTileRect = function(tile){
	switch(tile){
		case 1:
		return {col:1, row: 0};
		break;

		case 2:
		return {col:0, row: -0.01};
		break;

		case 3:
		return {col:1, row: 1.01};
		break;

		case 4:
		return {col:0, row: 1};
		break;
	}
}
