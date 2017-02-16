
	var repeat = localStorage.repeat || 1,
		continous = true,
		autoplay = true;
		
	if(repeat==1){document.getElementsByClassName("repeat icon")[0].className="repeat icon once";}
	if(repeat==0){document.getElementsByClassName("repeat icon")[0].className="repeat icon";}

	var time = new Date(),
		trigger = false,
		audio, timeout, isPlaying, playCounts;

	var play = function(){
		audio.play();
		document.getElementById("play").innerHTML="&#9632;";
		timeout = setInterval(updateProgress, 500);
		isPlaying = true;
	}

	var pause = function(){
		audio.pause();
		document.getElementById("play").innerHTML="&#9654;";
		clearInterval(updateProgress);
		isPlaying = false;
	}

	// 进度条
	var setProgress = function(value){
		var currentSec = parseInt(value%60) < 10 ? '0' + parseInt(value%60) : parseInt(value%60),
			ratio = value / audio.duration * 100;

		document.getElementsByClassName('timer left')[0].innerHTML=(parseInt(value/60)+':'+currentSec+"/"+totalDuration);
		document.getElementsByClassName('pace')[1].style.width=ratio + '%';
		//document.getElementsByClassName('ui-slider-handle ui-state-default ui-corner-all')[1].style.left= ratio + '%';
	}

	var updateProgress = function(){
	
		setProgress(audio.currentTime);
	}

	function addSlider(cur,bar,container,callback,disregardSliderEnabled){
		container.onmousemove=function(e){
		e.preventDefault();
		if(e.pageX>=container.offsetLeft){
		cur.style.left=e.pageX-container.offsetLeft;
		}};
		
		cur.onmousedown=function(){
		if(sliderEnabled==true||disregardSliderEnabled==true){
		container.className+=" enable";
		window.onmousemove=function(e){
		e.preventDefault();
		if(e.pageX>=container.offsetLeft){
		cur.style.left=e.pageX-container.offsetLeft;
		bar.style.width=e.pageX-container.offsetLeft;}};
		
		window.onmouseup=function(e){
		window.onmouseup=null;
		window.onmousemove=null;
		container.className=container.className.split(" enable")[0];
		container.onmousemove=function(e){
		e.preventDefault();
		if(e.pageX>=container.offsetLeft){
		cur.style.left=e.pageX-container.offsetLeft;
		}};
		bar.style.width=e.pageX-container.offsetLeft;
		callback(cur,bar,container)
		;};
		}
		};
	};
	var spinner=new Spinner();
	
	function setProgressSlider(cur,bar,container){
		
		
		audio.currentTime=(parseFloat(bar.style.width)/container.scrollWidth)*audio.duration;
		
		
	};
	function setVolumeSlider(cur,bar,container){
	
		setVolume(parseFloat(cur.style.left)/100);
	};
	var sliderEnabled=false;
	
	addSlider(document.getElementsByClassName("ui-slider-handle ui-state-default ui-corner-all")[1],document.getElementsByClassName("pace")[1],document.getElementsByClassName("slider ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all")[1],setProgressSlider,false);
	addSlider(document.getElementsByClassName("ui-slider-handle ui-state-default ui-corner-all")[0],document.getElementsByClassName("pace")[0],document.getElementsByClassName("slider ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all")[0],setVolumeSlider,true);
	

	// 音量
	var setVolume = function(value){
		if(value>1){value=1;}
		if(value<0){value=0;}
		if(audio!=null){
			audio.volume=value;
		}
		localStorage.volume = value;
		volume=value;
		document.getElementsByClassName('pace')[0].style.width=(value * 100) + '%';
		document.getElementsByClassName('ui-slider-handle ui-state-default ui-corner-all')[0].style.left=(value * 100) + '%';
	};
	document.getElementsByClassName("mute icon left")[0].onclick=function (){setVolume(0);};
	

	var volume = localStorage.volume || 0.5;
	setVolume(volume);


	// 播放结束后
	var ended = function(){
		pause();
		audio.currentTime = 0;
		autoplay=false;
		if (continous == true) isPlaying = true;
		// repeat： 1 单曲循环，2 列表循环，3 列表播放
		if (repeat == 1){
			play();
		} 
	}
	var totalDuration;
	var beforeLoad = function(){
		var endVal = this.seekable && this.seekable.length ? this.seekable.end(0) : 0;
		document.getElementsByClassName('loaded')[0].style.width=(100 / (this.duration || 1) * endVal) +'%';
		if(!isNaN(audio.duration)){
		totalDuration=parseInt(audio.duration/60)+":"+parseInt(audio.duration%60);
		document.getElementsByClassName('tag')[0].innerHTML='<strong>'+header+'</strong>';
		}
	};

	// 音乐加载完毕
	var afterLoad = function(){
		spinner.stop();
		sliderEnabled=true;
		if (autoplay == true) play();
	}
	// 播放音乐
	var audio;
	var audioContainer;
	var header;
	var loadMusic = function(name,src){
		sliderEnabled=false;
		header=name;
		if(audioContainer==null){
		audioContainer=document.createElement("iframe");
		audioContainer.style.display="none";
		
		
		audioContainer.onload=function(){		
			var item = src;
			audio = document.createElement('audio');
			audio.innerHTML='<source src="'+item+'" type="audio/mpeg"><source src="'+item+'" type="audio/ogg">';
			audioContainer.contentDocument.body.appendChild(audio);
			//document.getElementsByClassName('tag')[0].innerHTML='<strong>'+name+'</strong>';
			audio.volume = volume;
			audio.addEventListener('progress', beforeLoad, false);
			audio.addEventListener('durationchange', beforeLoad, false);
			audio.addEventListener('canplay', afterLoad, false);
			audio.addEventListener('ended', ended, false);
			audio.onseeking=function(){spinner.spin(document.getElementsByClassName("slider ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all")[1]);audio.onseeked=function(){spinner.stop();};};
		};
		document.body.appendChild(audioContainer);}
		else{
			var item = src;
			audio = document.createElement('audio');
			audio.innerHTML='<source src="'+item+'" type="audio/mpeg"><source src="'+item+'" type="audio/ogg">';
			audioContainer.contentDocument.body.appendChild(audio);
			
			audio.volume = volume;
			audio.addEventListener('progress', beforeLoad, false);
			audio.addEventListener('durationchange', beforeLoad, false);
			audio.addEventListener('canplay', afterLoad, false);
			audio.addEventListener('ended', ended, false);
			audio.onseeking=function(){spinner.spin(document.getElementsByClassName("slider ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all")[1]);audio.onseeked=function(){spinner.stop();};};
		}
		
	};

	document.getElementById("play").addEventListener('click', function(){
		if (encodeURI(document.getElementById("play").innerHTML)=="%E2%96%A0"){
			pause();
		} else if (encodeURI(document.getElementById("play").innerHTML)=="%E2%96%B6"){
			play();
		}
	});
	
	
	
	document.getElementsByClassName("repeat icon")[0].onclick=function(){
	if (repeat==1)
	{
		
		this.className="repeat icon";
		repeat=0;
	}
	else if (repeat==0)
	{
		this.className="repeat icon once";
		repeat=1;
	}
	
	};
	bgmPlayer.style.bottom=-135;
	function adjustPlayer(ele,bottom){
	bottom-=150;
	var i=10;
	function run(){

		var temp=Math.ceil((bottom-parseInt(ele.style.bottom))/i)+parseInt(ele.style.bottom);
		var dif=temp-parseInt(ele.style.bottom);
		//might be the case of reducing size
		if (dif>0)
			{if(temp<=bottom)
			{
				ele.style.bottom=temp;
				i-=2/i;//Sqrt is sublinear
				setTimeout(run,50);
			}
			else{
			ele.style.bottom=bottom;
			}}
		if (dif<0)
		{
			if(temp>=bottom)
			{
				ele.style.bottom=temp;
				i-=2/i;//Sqrt is sublinear
				setTimeout(run,50);
			}
			else{
			ele.style.bottom=bottom;
			}
		}
		
		};
	
	run();
};

function showPlayer(){
	adjustPlayer(bgmPlayer,150);
};

function hidePlayer(){
	adjustPlayer(bgmPlayer,15);
};
	