//
//

(function(){
	if(!window.yc){
		window.yc={};
	}

	// if(!window.zs){
	// 	window.zs={};
	// }

	// if(!window.ls){
	// 	window.ls={};
	// }

	// window.yc.prototype={   //第一种写法
	// 	$:function(){

	// 	}
	// }

	function  $(){

	}
	//window.yc.$=$;   //第二种写法
	window.['yc']['$']=$;  //第三种写法

	//  <div id="a">  <div  id="b">
	//
	
	function $(id){
		return document.getElementById(id);
	}
}) ();