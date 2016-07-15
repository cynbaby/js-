//封装
function $(id){
	return document.getElementById(id);
}

//验证会员名是否可用
function checkmyname(obj,imgid,divid){
	//alert($("username").value);
	//alert(obj.value);
	//会员名以字母或汉字开头，由3-18位的数字、字母、下划线、汉字组成   \u4e00-\u9fa5
	var reg=/^[a-zA-Z\u4e00-\u9fa5]{2,6}$/;
	if(reg.test(obj.value)){
		$(imagid).src="images/onCorrect.gif";
		$(divid).style.color="green";
	}else{
		$(imagid).src="images/onError.gif";
		$(divid).style.color="red";
	}
}

// //验证真实姓名
// function checkname(obj,imgid,divid){
// 	var reg=/^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9_\u4e00-\u9fa5]{2,17}$/;
// 	if(reg.test(obj.value)){
// 		$(imagid).src="images/onCorrect.gif";
// 		$(divid).style.color="green";
// 	}else{
// 		$(imagid).src="images/onError.gif";
// 		$(divid).style.color="red";
// 	}
// }


// //验证邮箱
// function checkmail(obj,divid){
// 	//abc123@qq.com  zz44422@163.com  aa1222@xx.com.cn   .com.cn.edu
// 	//  /^\w+@\w+(\.\w+){1,3}$/;
// 	var reg=/^[a-zA-Z0-9]\w+@\w+(\.[a-zA-Z]+){1,3}$/;
// 	if(reg.test(obj.value)){
// 		$(divid).className="ok";
// 	}else{
// 		$(divid).className="err";
// 	}
// }

// //验证联系号码 
// //验证密码是否可用
// //证件号验证
// //重复密码验证
