

var YTPlayer = function(id) {
  this.id = id;
};

var p = YTPlayer.prototype;

p.createPlayer = function(container, callback){
  this.video = document.createElement('div');
  this.container = container;
  container.appendChild(this.video);
  var noHtml5 = 0;
  if($.browser.msie && parseInt($.browser.version) <= 9) noHtml5 = 1;
  this._player = new YT.Player(this.video, {
   height: '100%',
   width: '100%',
   videoId: this.id,
   playerVars: {
    disablekb: 1,
    playsinline: 1,
    autoplay: 0,
    autohide: 0,
    controls: 0,
    modestbranding: 1,
    rel: 0,
    showinfo: 0,
    wmode: 'transparent',
    origin: window.location.origin,
    // host: '//www.youtube.com',
    iv_load_policy: 3,
    nohtml5: noHtml5
  },
  events: {
    'onStateChange': this.onYTPlayerStateChange.bind(this),
    'onReady': this.onYTLoaded.bind(this, callback)
  }
});
  this.visible = false;
};

p.onYTLoaded = function(callback){
 this.loaded = true;
 this.video = $(this.container).find('iframe')[0];
 this._player.mute();
 callback();
};

p.onYTPlayerStateChange = function(event){


  console.log('onYTPlayerStateChange', event.data);

  if(event.data === 0){
    this.isPlaying = false;
    $(this).trigger('ended');
  }else if(event.data === 1){
    this.isPlaying = true;
    if(this.onReadyBind)this.onReadyBind();
    this.onReadyBind = null;
    this.videoIsReady = true;
    this.play();
    $(this).trigger('play');
  		}else if(event.data === 2){//paused
        this.isPlaying = false;
        $(this).trigger('pause');
			}else if(event.data === 3){//buffering
				this.isPlaying = true;
        $(this).trigger('waiting');
      }
    }

    p.play = function(){
     if(!this.loaded) return;
     this._player.playVideo();
     this.isPlaying = true;
   };

   p.pause = function(){
     if(!this.loaded || !this.isPlaying) return;
     this.isPlaying = false;
     if(!this.videoIsReady) this._player.stopVideo();
     else this._player.pauseVideo();
   };


p._setVolume = function(level){
};

p._getCurrentTime = function(){
  return this._player.getCurrentTime();
};


