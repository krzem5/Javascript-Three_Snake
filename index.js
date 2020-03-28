var scene,cam,renderer,BOARD,MOBILE=(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent));



function init(){
	scene=new THREE.Scene();
	cam=new THREE.PerspectiveCamera(60,window.innerWidth/window.innerHeight,0.1,100000);
	renderer=new THREE.WebGLRenderer({antialias:(MOBILE?true:false)});
	renderer.setSize(window.innerWidth,window.innerHeight);
	scene.background=new THREE.Color(0.05,0.05,0.05);
	document.body.appendChild(renderer.domElement);
	ambient=new THREE.AmbientLight(0xffffff,1);
	scene.add(ambient);
	renderer.render(scene,cam);
	window.addEventListener("resize",resize,false);
	document.body.addEventListener("keydown",onkeypress);
	BOARD=new Board();
	requestAnimationFrame(render);
}



function render(){
	BOARD.update();
	renderer.render(scene,cam);
	requestAnimationFrame(render);
}



function resize(){
	cam.aspect=window.innerWidth/window.innerHeight;
	cam.updateProjectionMatrix();
	renderer.setSize(window.innerWidth,window.innerHeight);
}



function onkeypress(e){
	if (BOARD==null){
		return;
	}
	BOARD.key(e);
}



window.ondeviceorientation=function(e){
	if (e.alpha==null||e.beta==null||e.gamma==null){
		return;
	}
	var BF=10;
	var FBF=20;
	var bt=e.beta+0;
	if (e.gamma>0){
		bt=(180-Math.abs(e.beta))*(e.beta<0?-1:1);
	}
	if (e.gamma>-(90-BF)&&e.gamma<=0){
		onkeypress({key:"w"});
	}
	else if (e.gamma<90-BF&&e.gamma>0){
		onkeypress({key:"s"});
	}
	else if (bt<0-BF&&bt>=-90){
		onkeypress({key:"a"});
	}
	else if (bt>BF&&bt<=90){
		onkeypress({key:"d"});
	}
}



window.ontouchstart=function(e){
	onkeypress({key:" "});
}



document.addEventListener("DOMContentLoaded",init,false);