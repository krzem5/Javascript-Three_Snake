var B_WIDTH=19,B_HEIGHT=19,GRAVITY=0.04,FORCE=0.034,S_SIZE=0.8,E_SIZE=0.3,S_COLOR=[3,169,252],E_COLOR=[26,33,97],SH_COLOR=[148220,242],S_OFF=0.1,STEPS=(MOBILE?3:6),A_SIZE=0.6,A_COLOR_A=[247,73,64],A_COLOR_B=[232,120,60],SA_SIZE=0.725,SA_COLOR_A=[105,50,168],SA_COLOR_B=[148,50,168],SA_VALUE=5,HEAD_CAM_Y=20,CHASE_CAM_DIST=5,CHASE_CAM_Y=4,EYE_CAM_Y=1.075;



class Board{
	_map(v,aa,ab,ba,bb){
		return (v-aa)/(ab-aa)*(bb-ba)+ba;
	}
	_gen_tl_el(){
		var e=new THREE.Group();
		for (var i=0;i<B_WIDTH;i++){
			this._vll.push([]);
			var k=(i%2==0?0:1);
			for (var j=0;j<B_HEIGHT;j++){
				var tl=new THREE.Mesh(new THREE.BoxBufferGeometry(1,1,1,1,1,1),new THREE.MeshBasicMaterial({color:(k%2==0?0x30913e:0x2dad40)}));
				tl.rotation.x=-Math.PI/2;
				tl.position.x=i+0;
				tl.position.z=j+0;
				e.add(tl);
				k++;
				this._vll[i][j]=0;
			}
		}
		scene.add(e);
		return e;
	}
	_gen_w_el(){
		var e=new THREE.Group();
		for (var i=-1;i<B_WIDTH+1;i++){
			var tl=new THREE.Mesh(new THREE.BoxBufferGeometry(1,1,(i%2==0?3:3.5),1,1,1),new THREE.MeshBasicMaterial({color:(i%2==0?0xadadad:0x919191)}));
			tl.rotation.x=-Math.PI/2;
			tl.position.x=i+0;
			tl.position.y=(i%2==0?1.5:1.75);
			tl.position.z=-1;
			e.add(tl);
			var tl=new THREE.Mesh(new THREE.BoxBufferGeometry(1,1,(i%2==0?3:3.5),1,1,1),new THREE.MeshBasicMaterial({color:(i%2==0?0xadadad:0x919191)}));
			tl.rotation.x=-Math.PI/2;
			tl.position.x=i+0;
			tl.position.y=(i%2==0?1.5:1.75);
			tl.position.z=B_HEIGHT+0;
			e.add(tl);
		}
		for (var i=0;i<B_HEIGHT;i++){
			var tl=new THREE.Mesh(new THREE.BoxBufferGeometry(1,1,(i%2==0?3:3.5),1,1,1),new THREE.MeshBasicMaterial({color:(i%2==0?0xadadad:0x919191)}));
			tl.rotation.x=-Math.PI/2;
			tl.position.x=-1;
			tl.position.y=(i%2==0?1.5:1.75);
			tl.position.z=i+0;
			e.add(tl);
			var tl=new THREE.Mesh(new THREE.BoxBufferGeometry(1,1,(i%2==0?3:3.5),1,1,1),new THREE.MeshBasicMaterial({color:(i%2==0?0xadadad:0x919191)}));
			tl.rotation.x=-Math.PI/2;
			tl.position.x=B_WIDTH+0;
			tl.position.y=(i%2==0?1.5:1.75);
			tl.position.z=i+0;
			e.add(tl);
		}
		scene.add(e);
		return e;
	}
	_gen_s_el(){
		if (this.s_el){
			scene.remove(this.s_el);
		}
		var e=new THREE.Group();
		var i=0;
		for (var p of this.snake){
			var s=this._map(i,0,this.snake.length,S_SIZE,E_SIZE);
			var cl=new THREE.Color(this._map(i,1,this.snake.length,S_COLOR[0],E_COLOR[0])/255,this._map(i,1,this.snake.length,S_COLOR[1],E_COLOR[1])/255,this._map(i,1,this.snake.length,S_COLOR[2],E_COLOR[2])/255);
			if (i==0){
				cl=new THREE.Color(SH_COLOR[0],SH_COLOR[1],SH_COLOR[2]);
			}
			var tl=new THREE.Mesh(new THREE.BoxBufferGeometry(s,s,s,1,1,1),new THREE.MeshBasicMaterial({color:cl}));
			tl.position.x=p[0];
			tl.position.z=p[1];
			tl.position.y=0.5+s/2+S_OFF;
			p[4]=tl;
			e.add(tl);
			i++;
		}
		scene.add(e);
		return e;
	}
	_gen_snake(){
		var h=[parseInt(B_WIDTH/2),parseInt(B_HEIGHT/2),null,null,null,0];
		return [h,[h[0],h[1],null,null,null,1],[h[0],h[1],null,null,null,2]];
	}
	_gen_a_el(){
		if (this.a_el!=null){
			scene.remove(this.a_el);
		}
		if (this.apple[2]==1){
			var e=new THREE.Mesh(new THREE.BoxBufferGeometry(A_SIZE,A_SIZE,A_SIZE,1,1,1),new THREE.MeshBasicMaterial({color:new THREE.Color(this._map(Math.random(),0,1,A_COLOR_A[0],A_COLOR_B[0])/255,this._map(Math.random(),0,1,A_COLOR_A[1],A_COLOR_B[1])/255,this._map(Math.random(),0,1,A_COLOR_A[2],A_COLOR_B[2])/255)}));
			e.position.x=this.apple[0];
			e.position.z=this.apple[1];
			e.position.y=0.5+A_SIZE/2+S_OFF;
			scene.add(e);
			return e;
		}
		else{
			var e=new THREE.Mesh(new THREE.BoxBufferGeometry(SA_SIZE,SA_SIZE,SA_SIZE,1,1,1),new THREE.MeshBasicMaterial({color:new THREE.Color(this._map(Math.random(),0,1,SA_COLOR_A[0],SA_COLOR_B[0])/255,this._map(Math.random(),0,1,SA_COLOR_A[1],SA_COLOR_B[1])/255,this._map(Math.random(),0,1,SA_COLOR_A[2],SA_COLOR_B[2])/255)}));
			e.position.x=this.apple[0];
			e.position.z=this.apple[1];
			e.position.y=0.5+SA_SIZE/2+S_OFF;
			scene.add(e);
			return e;
		}
	}
	_gen_apple(){
		var x;
		var y;
		var v=(Math.random()<0.05?Math.max(SA_VALUE,parseInt(this.snake.length/10)):1);
		while (true){
			x=parseInt(Math.random()*B_WIDTH);
			y=parseInt(Math.random()*B_HEIGHT);
			var ok=true;
			for (var p of this.snake){
				if (p[0]==x&&p[1]==y){
					ok=false;
					break;
				}
			}
			if (ok==true){
				break;
			}
		}
		return [x,y,v];
	}
	_gen_pt_el(){
		var e=document.createElement("div");
		e.classList.add("pt");
		e.innerText="3 points";
		document.body.appendChild(e);
		return e;
	}
	_get_hs(){
		var cls=this;
		fetch("/",{"method":"SCOREGET"}).then((r)=>r.text()).then(function(sc){
			cls.hs=(sc=="-1"?null:parseInt(sc));
			cls.hs_el=cls._gen_hs_el();
		});
	}
	_gen_hs_el(){
		var e=document.createElement("div");
		e.classList.add("hs");
		e.innerText=`${this.hs} points`;
		if (this.hs==null){
			e.innerText="No highscore"
		}
		document.body.appendChild(e);
		return e;
	}
	_save_hs(){
		var cls=this;
		fetch(`/${this.snake.length}`,{"method":"SCOREUPDATE"}).then((r)=>r.text()).then(function(sc){
			sc=sc.split("~");
			cls.hs=parseInt(sc[0]);
			cls.hs_el.innerText=`${cls.hs} points`;
			var e2=document.createElement("div");
			e2.classList.add("over");
			document.body.appendChild(e2);
			var e=document.createElement("div");
			e.classList.add("plc");
			e.style.fontSize=`${window.innerWidth*0.1}px`;
			e.innerText=`You ranked #${sc[1]} of ${sc[2]}`;
			document.body.appendChild(e);
			setTimeout(function(){
				e.classList.add("rv");
				e2.classList.add("rv");
			},100);
		});
	}
	constructor(){
		this._vll=[];
		this.tl_el=this._gen_tl_el();
		this.w_el=this._gen_w_el();
		this.snake=this._gen_snake();
		this.s_el=this._gen_s_el();
		this.svx=0;
		this.svy=0;
		this.snvx=0;
		this.snvy=0;
		this.svtm=0;
		this.apple=this._gen_apple();
		this.apple[2]=1;
		this.a_el=this._gen_a_el();
		this.v=0;
		this.pt_el=this._gen_pt_el();
		this.hs=this._get_hs();
		this.hs_el=null;
		this.bltm=null;
		this.whit=false;
		this.bhit=false;
		this.pl=true;
		this.pause=false;
		this.ltm=performance.now();
	}
	update(){
		var dt=(performance.now()-this.ltm)*1e-3;
		this.ltm=performance.now();
		if (this.pause==true){
			return;
		}
		for (var i=0;i<B_WIDTH;i++){
			for (var j=0;j<B_HEIGHT;j++){
				var v=this._vll[i][j];
				var tl=this.tl_el.children[i*B_WIDTH+j];
				if (v!=0){
					v+=FORCE-GRAVITY;
					tl.position.y+=v;
					if (tl.position.y<=0){
						tl.position.y=0;
						v=0;
					}
				}
				else{
					if (Math.random()<0.002){
						v=FORCE;
					}
				}
				this._vll[i][j]=v;
			}
		}
		if (this.pl==true){
			if (this.svtm>=0.95||(this.svx==0&&this.svy==0)){
				this.svx=this.snvx+0;
				this.svy=this.snvy+0;
				this.svtm=0;
				this.snake[0][2]=this.snake[0][0]+this.svx;
				this.snake[0][3]=this.snake[0][1]+this.svy;
				if (this.snake[0][2]<0||this.snake[0][2]>=B_WIDTH||this.snake[0][3]<0||this.snake[0][3]>=B_HEIGHT){
					this.whit=true;
					this._save_hs();
				}
				for (var i=1;i<this.snake.length;i++){
					if (this.snake[i][5]>0){
						continue;
					}
					if (this.snake[i][0]==this.snake[0][2]&&this.snake[i][1]==this.snake[0][3]){
						this.bhit=true;
						this.pl=false;
						this._save_hs();
						break;
					}
				}
				for (var i=1;i<this.snake.length;i++){
					if (this.snake[i][5]>0){
						continue;
					}
					this.snake[i][2]=this.snake[i-1][0]+0;
					this.snake[i][3]=this.snake[i-1][1]+0;
				}
			}
			else{
				this.svtm+=dt*STEPS;//1/STEPS;
				for (var p of this.snake){
					if (p[5]>0){
						continue;
					}
					p[4].position.x=this._map(this.svtm,0,1,p[0],p[2]);
					p[4].position.z=this._map(this.svtm,0,1,p[1],p[3]);
				}
				if (this.whit==true){
					var p=this.snake[0];
					var px=this._map(this.svtm+1/STEPS,0,1,p[0],p[2]);
					var py=this._map(this.svtm+1/STEPS,0,1,p[1],p[3]);
					switch (`${this.svx}${this.svy}`){
						case "-10":
							if (px<=S_SIZE/2){
								p[4].position.x=-0.5+S_SIZE/2;
								this.pl=false;
								this.svtm=this._map(p[4].position.x,-1,0,1,0);
							}
							break;
						case "0-1":
							if (py<=S_SIZE/2){
								p[4].position.z=-0.5+S_SIZE/2;
								this.pl=false;
								this.svtm=this._map(p[4].position.z,-1,0,1,0);
							}
							break;
						case "10":
							if (px>=B_WIDTH-1+S_SIZE/2){
								p[4].position.x=B_WIDTH-1+0.5-S_SIZE/2;
								this.pl=false;
								this.svtm=this._map(p[4].position.x,B_WIDTH-1,B_WIDTH,0,1);
							}
							break;
						case "01":
							if (py>=B_HEIGHT-1+S_SIZE/2){
								p[4].position.z=B_HEIGHT-1+0.5-S_SIZE/2;
								this.pl=false;
								this.svtm=this._map(p[4].position.z,B_HEIGHT-1,B_HEIGHT,0,1);
							}
							break;
					}
					for (var p of this.snake){
						if (p[5]>0){
							continue;
						}
						p[4].position.x=this._map(this.svtm,0,1,p[0],p[2]);
						p[4].position.z=this._map(this.svtm,0,1,p[1],p[3]);
					}
				}
				if (this.pl==true&&this.svtm>=0.95){
					for (var p of this.snake){
						if (p[5]==0){
							p[0]=p[2]+0;
							p[1]=p[3]+0;
						}
						p[4].position.x=p[0];
						p[4].position.z=p[1];
						p[5]=Math.max(p[5]-1,0);
					}
					if (this.apple[0]==this.snake[0][0]&&this.apple[1]==this.snake[0][1]){
						var l=this.snake[this.snake.length-1];
						for (var i=0;i<this.apple[2];i++){
							this.snake.push([l[0]+0,l[1]+0,null,null,null,1]);
						}
						this.apple=this._gen_apple();
						this.a_el=this._gen_a_el();
						this.s_el=this._gen_s_el();
						this.pt_el.innerText=`${this.snake.length} points`;
						this.pt_el.classList.add("bl");
						if (this.bltm!=null){
							clearTimeout(this.bltm);
						}
						var ths=this;
						this.bltm=setTimeout(function(){
							ths.pt_el.classList.remove("bl");
							ths.bltm=null;
						},450);
					}
				}
			}
			if (this.v==0){
				cam.position.set(parseInt(B_WIDTH/2),HEAD_CAM_Y,parseInt(B_HEIGHT/2));
				cam.lookAt(new THREE.Vector3(parseInt(B_WIDTH/2),1,parseInt(B_HEIGHT/2)));
			}
			else if (this.v==1){
				cam.position.set(this.snake[0][4].position.x,HEAD_CAM_Y,this.snake[0][4].position.z);
				cam.lookAt(new THREE.Vector3(this.snake[0][4].position.x,1,this.snake[0][4].position.z));
			}
			else if (this.v==2){
				var x=this.snake[1][4].position.x-this.snake[0][4].position.x;
				var z=this.snake[1][4].position.z-this.snake[0][4].position.z;
				var d=Math.sqrt(x*x+z*z);
				x=x/d*CHASE_CAM_DIST;
				z=z/d*CHASE_CAM_DIST;
				cam.position.set(this.snake[0][4].position.x+x,CHASE_CAM_Y,this.snake[0][4].position.z+z);
				cam.lookAt(new THREE.Vector3(this.snake[0][4].position.x,1,this.snake[0][4].position.z));
			}
			else if (this.v==3){
				var x=this.snake[0][4].position.x-this.snake[1][4].position.x;
				var z=this.snake[0][4].position.z-this.snake[1][4].position.z;
				var d=Math.sqrt(x*x+z*z);
				x=x/d;
				z=z/d;
				cam.position.set(this.snake[0][4].position.x,1,this.snake[0][4].position.z);
				cam.lookAt(new THREE.Vector3(this.snake[0][4].position.x+x,EYE_CAM_Y,this.snake[0][4].position.z+z));
			}
		}
	}
	key(e){
		switch (e.key.toLowerCase()){
			case "a": case "arrowleft":
				if (this.v==2||this.v==3){
					switch (`${this.svx}${this.svy}`){
						case "-10":
							this.snvx=0;
							this.snvy=1;
							break;
						case "10":
							this.snvx=0;
							this.snvy=-1;
							break;
						case "0-1":
							this.snvx=-1;
							this.snvy=0;
							break;
						case "01":
							this.snvx=1;
							this.snvy=0;
							break;
					}
				}
				else if (this.svx!=1){
					this.snvx=-1;
					this.snvy=0;
				}
				break;
			case "w": case "arrowup":
				if (this.v==2||this.v==3){

				}
				else if (this.svy!=1){
					this.snvx=0;
					this.snvy=-1;
				}
				break;
			case "d": case "arrowright":
				if (this.v==2||this.v==3){
					switch (`${this.svx}${this.svy}`){
						case "-10":
							this.snvx=0;
							this.snvy=-1;
							break;
						case "10":
							this.snvx=0;
							this.snvy=1;
							break;
						case "0-1":
							this.snvx=1;
							this.snvy=0;
							break;
						case "01":
							this.snvx=-1;
							this.snvy=0;
							break;
					}
				}
				else if (this.svx!=-1){
					this.snvx=1;
					this.snvy=0;
				}
				break;
			case "s": case "arrowdown":
				if (this.v==2||this.v==3){

				}
				else if (this.svy!=-1){
					this.snvx=0;
					this.snvy=1;
				}
				break;
			case " ":
				if (this.snvx==0&&this.snvy==0){
					break;
				}
				this.v=(this.v+1)%4;
				break;
			case "q":
				this.pause=!this.pause;
				break;
		}
	}
}
