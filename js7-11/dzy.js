//库： 放一些内置函数的扩展（String,Array,Object）
//	放一些自定义的函数，这些函数为了不与别的库冲突，定义到一个命名空间(对象)
(function(){
	//给window添加了一个
	if(!window.yc){
		//window.yc={};
		window['yc']={};
	}
	// window.yc.prototype={

	// 	$:function(){

	// 	}
	// }//方法一
	

	
	//window.yc.$=$;//方法二
	//window['yc']['$']=$;//方法三
	//如果参数是一个字符串，则返回一个对象
	//如果参数是多个字符串，则返回一个数组

	///////////////////获取页面元素操作///////////////////////////////
	function $(){
		var elements=new Array();
		//查找作为参数提供的所有元素
		for(var i=0;i<arguments.length;i++){
			var element=arguments[i];
			//如果这个元素是一个string,则表明这是一个id
			if(typeof element=='string'){
				element=document.getElementById(element);
			}
			if(arguments.length==1){
				return  element;
			}
			elements.push(element);
		}
		return elements;
		}
		window['yc']['$']=$;

		//className:要找的类名   tag:要查找的类名
		function getElementByClassName(className,tag,parent){
			parent=parent||document;
			if(!(parent=$(parent))){
				return false; 
			}
			//查看所有匹配的标签
			var allTags=(tag=="*"&&parent.all)?parent.all:parent.getElementsByTagName(tag);
			var matchingElements=new Array();
			//创建一个正则表达式，来判断className是否正确  ^a || a
			var regex=new RegExp("(^|\\s)"+className+"(\\s|$)");
			var element;
			//检查每个元素
			for(var i=0;i<allTags.length;i++){
				element=allTags[i];
				if(regex.test(element.className)){
					matchingElements.push(element);
				}
			}
			return matchingElements;
		}
		window['yc']['getElementByClassName']=getElementByClassName;

		
		//开关操作
		function toggleDisplay(node,value){
			if(!(node=$(node))){return false;}
			if(node.style.display!='none'){
				node.style.display='none';
			}else{
			node.style.display=value||'';
		}
		return true;
		};
		window['yc']['toggleDisplay']=toggleDisplay;

		//判断当前浏览器是否兼容这个库：浏览器能力检测
		function isCompatible(other){
			if(other===false||!Array.prototype.push||!Object.hasOwnProperty||!document.createElement||!document.getElementsByTagName){
				return false;
			}
			return true;
		};
		window['yc']['isCompatible']=isCompatible;

		////////////////////////////事件操作//////////////////////////////
		//增加事件： node:节点  type:事件类型('click') listener:监听器函数
		function addEvent(node,type,listener){
			if(!isCompatible()){return false;}
			if(!(node=$(node))){return false;}
		
		//W3c加事件的方法
		if(node.addEventListener){
			node.addEventListener(type,listener,false);
			return true;
		}else if(node.attachEvent){
			//MSIE的事件
			node['e'+type+listener]=listener;
			node[type+listener]=function(){
				node['e'+type+listener](window.event);
				//listener(window.event);
			}
			node.attachEvent('on'+type,node[type+listener]);
			return true; 
		}
		};
		window['yc']['addEvent']=addEvent;

		
		//移除事件
		function removeEvent(node,type,listener){
			if(!(node$=(node))){return false;}
			if(node.removeEventListener){
			node.removeEventListener(type,listener,false);
			return true;
		}else if(node.detachEvent){
			node.detachEvent('on'+type,node[type+listener]);
			node[type+listener]=null;
			return true;
		}
		return false;
		};
		window['yc']['removeEvent']=removeEvent;
		///////////////////////////////////////////////////////
		///注意点：添加事件时用的函数必须与删除函数用的是一样的
		//<script type="text/javascript">
		// yc.addEvent("show","click",function(){
		// 	alert("Hello");
		// });
		// yc.removeEvent("show","click",function(){
		// 	alert("Hello");
		// });错误！！！！！以上错误，无法移除，因为匿名函数是两个函数
		//</script>
		///////// var show=function(){
		// 	alert("hello");
		// }
		// yc.addEvent("show","click",show);
		// yc.removeEvent("show","click",show);////正确 

		
		//替换模板文字 str：模板文件包括{属性名}，
		//o是对昂 ，格式{属性名：值}
		//以o对象中对应的属性名的值来替换str模板
		function supplant(str,o){
			//   /g整个字符串全部匹配
			//   //正则表达式的标志
			//   {()}:()分组，将匹配的值存起来
			return str.replace(/{([a-z]*)}/g,
				function(a,b){
					//alert(a+"\t"+b); //a:{border} b:border
					var r=o[b]; //o["border"]=>2
								//o["{border"]
					//return typeof r=='string'?r:a;
					return r;
				}
			);
		};
		window['yc']['supplant']=supplant;

		function parseJson(str,filter){
			var result=eval("("+str+")");//json对象{"name":"a","age":20}
			if(filter!=null&&typeof(filter)=='function'){
				for(var i in result){
				result[i]=filter(i,result[i]);
			}
				}
			return result;
		}
		window['yc']['parseJson']=parseJson;

		///////////////////DOM中的节点方法扩充/////////////////////////////////
		//a.appenChild(b) 在a的子节点的最后加入b
		//a.insertBrfore(b) 在a的前面加入b
		//新增第一个函数：给 referenceNode的后面加入一个node
		function insertAfter(node,referenceNode){
			if(!(node=$(node))){return false;}
			if(!(referenceNode=$(referenceNode))){return false;}
			var parent=referenceNode.parentNode;
			if(parent.lastChild==referenceNode){//当前节点referenceNode是最后一个节点->appendChild
				parent.appendChild(node);
			}else{
				parent.insertBefore(node,referenceNode.nextSibling);
			}
		};
		window['yc']['insertAfter']=insertAfter;

		//在一个父节点的第一个子节点前面添加一个新节点
		function prependChild(parent,newChild){
			if(!(parent=$(parent))){return false;}
			if(!(newChild=$(newChild))){return false;}
			if(parent.firstChild){//查看parent节点下是否有子节点
				//如果有一个子节点，就在这个子节点前添加
				parent.insertBefore(newChild,parent.firstChild);
			}else{
				//如果没有子节点则直接添加
				parent.appendChild(newChild);
			}
			return parent;
		};
		window['yc']['prependChild']=prependChild;

		//标准(删除节点)：node.removeChild(childNode)  ->一次只能删除一个子节点
		//新增的第二个函数：一次删除所有的节点
		function removeChildren(parent){
			if(!(parent=$(parent))){return false;}
			while(parent.firstChild){
				//parent.firstChild.parentNode.removeChild(parent.firstChild);
				parent.removeChild(parent.firstChild);
		}
		//返回父元素，以实现方法连缀
		return parent;
	};
	window['yc']['removeChildren']=removeChildren;
})();

//扩展全局的  window.Object.prototype=xxx
Object.prototype.toJSONString=function(){
	//需求：给object类的protoype添加一个功能  toJSONString()，将属性的值以json格式输出
	//{"name":"zy","age":30,"sex":"男"}
	//for(var i in person) person[i]取出值
	//var jsonstr="{";
	var jsonarr=[];
	for(var i in this){
		if(this.hasOwnProperty(i)){
		//jsonstr+=i.toJSONString()+":"+this.[i].toJSONString
		jsonarr.push("\""+i+"\""+":"+this[i]+"\"");
		}
		//jsonstr+="}";		
	}
	var r=jsonarr.join(",\n");
	r="{"+r+"}";		       	
	//return jsonstr;//返回json字符串
	return r;
}

//[1,2,3]
//["a","zy"]
//[{"name":"zs","age":30},{"name":"zy","age":30}]
Array.prototype.toJSONString=function(){
	var json=[];
	for(var i=0;i<this.length;i++)
		json[i]=(this[i]!=null)?this[i].toJSONString():"null";
	return "["+json.join(", ")+"]"
}

String.prototype.toJSONString=function(){
	return '"'+this.replace(/(\\|\")/g,"\\$1").replace(/\n|\r|\t/g,function(){
		var a=arguments[0];
		return (a=='\n')?'\\n':(a=='\r')?'\\r':(a=='\t')?'\\t':""})+'"'
	}

// Boolean.prototype.toJSONString=function(){return this}
// Function.prototype.toJSONString=function(){return this}
// Number.prototype.toJSONString=function(){return this}
// RegExp.prototype.toJSONString=function(){return this}



