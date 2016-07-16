(function(){
	if(!window.yc){
		//window.yc={};
		window['yc']={};
	}
///////////////////获取页面元素操作////////////////////////
	function $(){
		var elements=new Array();
		//查找作为参数提供的所有元素
		for(var i=0;i<arguments.length;i++){
			var element=arguments[i];
			//如果元素是一个string，则表明这是一个id
			if(typeof element=='string'){
				element=document.getElementById(element);
			}
			if(arguments.length==1){
				return element;
			}
			elements.push(element);
		}
		return elements;
	}
	//window.yc.$=$;
	window['yc']['$']=$;
	

//判断当前浏览器是否兼容这个库：浏览器能力检测。
	function isCompatible(other){
		if(other===false || !Array.prototype.push || !Object.hasOwnProperty || !document.createElement || !document.getElementsByTagName){
			return false;
		}
		return true;
	};
	window['yc']['isCompatible']=isCompatible;

//扩展getElementsByClassName  className:要找的类名  tag:要查找的标签
  	function getElementsByClassName(className, tag, parent){
  		parent=parent||document;
  		if( !(parent=$(parent))){ 
  			return false;
  		}
//查看所有匹配的标签
	var allTags=(tag=="*"&&parent.all)?parent.all:parent.getElementsByTagName(tag);
	var matchingElements=new Array();
	//创建一个正则表达式，来判断className是否正确
	var regex=new RegExp( "(^|\\s)"+className+"(\\s|$)");
	var element;
	//检查每个元素
	for( var i=0;i<allTags.length;i++){
		element=allTags[i];
		if(regex.test(element.className)){
			matchingElements.push(element);
		}
	}
	return matchingElements;
	};
	window['yc']['getElementsByClassName']=getElementsByClassName;



////////////////////////////事件操作//////////////////////////////////////
///
//增加事件：node：节点  type：事件类型（‘click’） listener:监听器函数
	function addEvent(node,type,listener){
		if(!isCompatible()){return false;}
		if(!(node=$(node))){return false;}
		//w3c加事件的方法
		if(node.addEventListener){
			node.addEventListener(type,listener,false);
			return true;
		}else if(node.attachEvent){
		//MSIE的事件
		node['e'+type+listener]=listener;
		node[type+listener]=function(){
			node['e'+type+listener](window.event);//防止事件重名
			//listener(window.event);
		}
		node.attachEvent('on'+type,node[type+listener]);
		return true;
		}
	};
	window['yc']['addEvent']=addEvent;

//移除事件
	function removeEvent(node,type,listener){
		if(!(node=$(node))){ return false;}
		if(node.removeEventListener){   // ff
		   node.removeEventListener( type,listener,false);
		   return true;
	}else if( node.datachEvent){
			node.datachEvent('on'+type,node[type+listener]);
			node[type+listener]=null;
			return true;
		}
		return false;
	};
	
    window['yc']['removeEvent']=removeEvent;
    /*
    var show=function(){
    	alert("hello");
    }
    yc.addEvent( "show","click",show ); //  添加事件时用了另一个函数
    yc.removeEvent(  "show","click",show );  //删除时用了另一个函数
    //以上对
    yc.addEvent("show","click",function(){alert("hello"); });
    yc.removeEvent("show","click",function(){alert("hello"); });
    以上错误，无法移除，因为匿名函数是两个函数。
	*/

//替换模板文字   str: 模板文字中包含  {属性名}，
//   o: 是对象， 格式{属性名：值}
//以o对象中对应的属性名的值来替换str模板。
	function supplant(str,o){
		//  /g  整个字符串全部匹配
		//  //正则表达式的标志
		//  {()}：()分组，将匹配的值存起来。
		return str.replace(/{([a-z]*)}/g,
			function (a,b) {
				alert(a+"\t"+b);  //  a:{border}  b:{border}
				var r=o[b];  //  o["border"]=>2
							 //   o["{border}"]
				//return typeof r==='string' ? r:a;
				return r;
			}
		);
	};
	window['yc']['supplant']=supplant;


//带过滤的eval
	function parseJson(str,filter){
		var result=eval( "("+ str+")" );  //  json对象 {"name":"a","age":20}
		if(filter!=null&& typeof(filter)=='function'){
			for(var i in result){
				result[i]=filter( i, result[i] );
			}
		}
		return result;
	}
	window['yc']['parseJson']=parseJson;

/////////////////////页面操作/////////////////////

//开关操作
	function toggleDisplay(node,value){
		if(!(node=$(node))){ return false;}
		if( node.style.display!='none'){
			node.style.display='none';
		}else{
			node.style.display=value||'';
		}
		return true;
	};
	window['yc']['toggleDisplay']=toggleDisplay;


/////////////////////DOM中的节点操作补充///////////////////
///   a.appendChild(b)  在a的子节点的最后加入b
///   a.insertBefore(b); 在a的前面加入一个b

//新增的第一个函数：给 referenceNode的后面加入一个node
	function insertAfter(node,referenceNode){
		if(!(node=$(node))){ return false; }
		if(!(referenceNode=$(referenceNode))){ return false; }
		var parent=referenceNode.parentNode;
		if(parent.lastChild==referenceNode ){
			parent.appendChild(node);
		}else{
			parent.insertBefore(node,referenceNode.nextSibling );
		}
	};
	window['yc']['insertAfter']=insertAfter;

//标准（删除节点）：node.removeChild(childNode)  => 一次只能删除一个节点
//新增的第二个函数：一次删除所有的子节点
	function removeChildren(parent){
		if(!(parent=$(parent))){ return false;}
		while( parent.firstChild){
			//parent.firstChild.parentNode.removeChild( parent.firstChild );
			parent.removeChild( parent.firstChild );
			}
			//返回父元素，以实现方法连锁。
			return parent;
		};
	window['yc']['removeChildren']=removeChildren;

//在一个父节点的第一个子节点前面添加一个新节点
	function prependChild( parent, newChild){
		if( !(parent=$(parent))){return false; }
		if( !(newChild=$(newChild))){ return false;}
		if( parent.firstChild){//查看parent节点下是否有子节点
			//如果有一个子节点，就在这个子节点前添加
			parent.insertBefore(newChild,parent.firstChild);
		}else{
			//如果没有子节点则直接添加
			parent.appendChild(newChild);
		}
		return parent;
	};
	window['yc']['prependChild']=prependChild;

})();


//扩展全局的 window.Object.prototype=xxx
Object.prototype.toJSONString=function(){
	//需求：给object类的prototype添加一个功能  toJSONString{},将属性的值
	//以json格式输出
	//{“name”：“zy”，"age":30,"sex":"男"}
	//for(var i in person )   person[i]取出值
	var jsonarr=[];
	for(var i in this){  //  object -> 所有的属性
		if(this.hasOwnProperty(i)){
			jsonarr.push("\""+i+"\""+":\""+this[i]+"\"");
		}
	}
	var r=jsonarr.join(",\n");
	r="{"+r+"}";
	return r ;  //返回json字符串
}
// [1,2,3]
// ["a","zs"]
// [{"name":"zs","age":30},{"name":"zs","age":30}]
Array.prototype.toJSONString=function(){
	var json=[];
	for(var i=0;i<this.length;i++)
		json[i]=(this[i] !=null)?this[i].toJSONString():"null";
	return "["+json.join(",")+"]"
}
String.prototype.toJSONString=function(){
	return '"'+this.replace(/(\\|\")/g,"\\$1").replace(/\n|\r|\t/g,function(){
		var a=arguments[0];
		return (a=='\n')?'\\n':(a=='\r')?'\\r':(a=='\t')?'\\t':""})+'"'
}
// Boolean.prototype.toJSONString=function()(return this)
// Function.prototype.toJSONString=function()(return this)
// Number.prototype.toJSONString=function()(return this)
// RegExp.prototype.toJSONString=function()(return this)
