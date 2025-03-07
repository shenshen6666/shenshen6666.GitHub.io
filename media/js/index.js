function addEvent(ele,type,callback){
	if(ele.addEventListener){
		ele.addEventListener(type,callback,false);
	}else if(ele.attachEvent){
		ele.attachEvent('on'+type,callback);
	}else{
		ele['on'+type]=callback;
	}
}

window.onload = () => {
  // menu
  const menu = document.getElementById('thumb-menu')
  const navList = document.getElementById('nav-list')
  const thumbOpen = document.getElementById('thumb-open')
  const thumbClose = document.getElementById('thumb-close')

  menu.onclick = () => {
    navList.classList.toggle('block')
    navList.classList.toggle('hidden')
    thumbOpen.classList.toggle('hidden')
    thumbClose.classList.toggle('hidden')
    thumbClose.classList.toggle('block')
  }
  // sentence
  var gethi;
	var updatehi = document.querySelector('.sentence-sub');
	var time_progress = document.querySelector('.sentence-progress-time');
	var sentence = document.querySelector('.sentence-hi');
	var from = document.querySelector('.sentence-from');
	var queue = [];
	var times = new Date().getTime();
	update();
	setcolor();
	time_update()
	function update() {
		gethi = new XMLHttpRequest();
		gethi.open("GET","https://v1.hitokoto.cn/");
		gethi.send();
		gethi.onreadystatechange = function () {
			if (gethi.readyState===4 && gethi.status===200) {
				var Hi = JSON.parse(gethi.responseText);
				sentence.innerHTML = Hi.hitokoto;
				from.innerHTML = "From "+ Hi.from.substr(0, 12);
			}
		}
	}
	function setcolor() {
		sentence.style.color=updatehi.style.background=time_progress.style.background=color();
	}
	function color() {
		return "rgb("+random()+","+random()+","+random()+")";
	}
	function random() {
		return Math.floor(Math.random()*(81)+60)
	}
	function time_update(){
		queue[queue.length] = setInterval(function(){
			time_progress.style.left=time_progress.style.left=="0%"?"100%":"0%";
			update();
			setcolor();
			times = new Date().getTime();
			},12000);
	}
	addEvent(updatehi,'click',function(){
		for (var i = 0; i < queue.length; i++) {
			clearInterval(queue[i]);
		}
		queue=[];
		update();
		time_update();
	})
	setTimeout(function(){
		time_progress.style.left = ""||"100%";
	},200)
}