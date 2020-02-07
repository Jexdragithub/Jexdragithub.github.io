(function () {
	'use strict';
	var container = document.getElementById('container');
	container.style.height = window.innerHeight +'px';
	// 
	var supportsVideo = !!document.createElement('video').canPlayType;

	if (supportsVideo) {
		// 
		var videoContainer = document.getElementById('videoContainer');
		var video = document.getElementById('video');
		var videoControls = document.getElementById('video-controls');

		// 
		video.controls = false;

		// 
		videoControls.setAttribute('data-state', 'visible');

		// 
		var playpause = document.getElementById('playpause');
		var stop = document.getElementById('stop');
		var mute = document.getElementById('mute');
		var volinc = document.getElementById('volinc');
		var voldec = document.getElementById('voldec');
		var progress = document.getElementById('progress');
		var progressBackground = document.getElementById('progress-background');

		// 
		var supportsProgress = (document.createElement('progress').max !== undefined);
		if (!supportsProgress) progress.setAttribute('data-state', 'fake');

		// 
		var checkVolume = function(dir) {
			if (dir) {
				var currentVolume = Math.floor(video.volume * 10) / 10;
				if (dir === '+') {
					if (currentVolume < 1) video.volume += 0.1;
				}
				else if (dir === '-') {
					if (currentVolume > 0) video.volume -= 0.1;
				}
				//
				if (currentVolume <= 0) video.muted = true;
				else video.muted = false;
			}
			changeButtonState('mute');
		}

		// 
		var alterVolume = function(dir) {
			checkVolume(dir);
		}

		// 
		if (document.addEventListener) {
			// 
			video.addEventListener('loadedmetadata', function() {
				progress.setAttribute('max', video.duration);
			});

			// 
			var changeButtonState = function(type) {
				// 
				if (type == 'playpause') {
					if (video.paused || video.ended) {
						playpause.setAttribute('data-state', 'play');
					}
					else {
						playpause.setAttribute('data-state', 'pause');
					}
				}
				// 
				else if (type == 'mute') {
					mute.setAttribute('data-state', video.muted ? 'unmute' : 'mute');
				}
			}

			// 
			video.addEventListener('play', function() {
				changeButtonState('playpause');
			}, false);
			video.addEventListener('pause', function() {
				changeButtonState('playpause');
			}, false);
			video.addEventListener('volumechange', function() {
				checkVolume();
			}, false);

			// 		
			playpause.addEventListener('click', function(e) {
				if (video.paused || video.ended) video.play();
				else video.pause();
			});			

			// 
			stop.addEventListener('click', function(e) {
				video.pause();
				video.currentTime = 0;
				progress.value = 0;
				// 
				changeButtonState('playpause');
			});
			mute.addEventListener('click', function(e) {
				video.muted = !video.muted;
				changeButtonState('mute');
			});
			volinc.addEventListener('click', function(e) {
				alterVolume('+');
			});
			voldec.addEventListener('click', function(e) {
				alterVolume('-');
			});

			// 
			video.addEventListener('timeupdate', function() {
				// 
				if (!progress.getAttribute('max')) progress.setAttribute('max', video.duration);
				progress.value = video.currentTime;
				progressBackground.style.width = '100%';
				var perc = Math.floor((video.currentTime / video.duration) * 200) + '%';
				progressBackground.style.background = 'linear-gradient(90deg, rgba(238,174,202,1) 0%, rgba(148,187,233,1) '+ perc +')';
			});

			// 
			progressBackground.addEventListener('click', function(e) {
				//
				var pos = (e.pageX  - (this.offsetLeft + this.offsetParent.offsetLeft)) / this.offsetWidth;
				video.currentTime = pos * video.duration;
			});

		}
	 }

 })();