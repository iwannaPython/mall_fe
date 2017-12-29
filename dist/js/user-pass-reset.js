webpackJsonp([6],{

/***/ 1:
/***/ (function(module, exports, __webpack_require__) {

/*
 * 
 * 用户登录网络请求
 */
var _mm     = __webpack_require__(0);

var _user = {
    // 用户登录
    login : function(userInfo, resolve, reject){
        _mm.request({
            url     : _mm.getServerUrl('/user/login.do'),
            data    : userInfo,
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    // 检查用户名
    checkUsername : function(username, resolve, reject){
        _mm.request({
            url     : _mm.getServerUrl('/user/check_valid.do'),
            data    : {
                type    : 'username',
                str     : username
            },
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    // 用户注册
    register : function(userInfo, resolve, reject){
        _mm.request({
            url     : _mm.getServerUrl('/user/register.do'),
            data    : userInfo,
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    // 检查登录状态
    checkLogin : function(resolve, reject){
        _mm.request({
            url     : _mm.getServerUrl('/user/get_user_info.do'),
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    // 获取用户密码提示问题
    getQuestion : function(username, resolve, reject){
        _mm.request({
            url     : _mm.getServerUrl('/user/forget_get_question.do'),
            data    : {
                username : username
            },
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    // 检查密码提示问题答案
    checkAnswer : function(userInfo, resolve, reject){
        _mm.request({
            url     : _mm.getServerUrl('/user/forget_check_answer.do'),
            data    : userInfo,
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    // 重置密码
    resetPassword : function(userInfo, resolve, reject){
        _mm.request({
            url     : _mm.getServerUrl('/user/forget_reset_password.do'),
            data    : userInfo,
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    // 获取用户信息
    getUserInfo : function(resolve, reject){
        _mm.request({
            url     : _mm.getServerUrl('/user/get_information.do'),
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    // 更新个人信息
    updateUserInfo : function(userInfo, resolve, reject){
        _mm.request({
            url     : _mm.getServerUrl('/user/update_information.do'),
            data    : userInfo,
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    // 登录状态下更新密码
    updatePassword : function(userInfo, resolve, reject){
        _mm.request({
            url     : _mm.getServerUrl('/user/reset_password.do'),
            data    : userInfo,
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    // 登出
    logout : function(resolve, reject){
        _mm.request({
            url     : _mm.getServerUrl('/user/logout.do'),
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    }
}

module.exports = _user;

/***/ }),

/***/ 10:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(11);


/***/ }),

/***/ 11:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 67:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(68);


/***/ }),

/***/ 68:
/***/ (function(module, exports, __webpack_require__) {

/*
 * 找回密码逻辑
 * 1. 此页面有三个步骤，输入用户名，输入答案，重置密码
 * 2. 进来把第一步显示出来，进行格式判断，点击下一步(提示相应的有没有此用户)
 * 3. 把第二个容器显示出来，把第一个隐藏掉，点击下一步(判断问题是不时正确)
 * 4. 把新密码提交的同时也会提交一个token，如果token相同就会调到结果页
 * 
 * 为什么用token 
 * 在输入新密的时候，在地址栏里面输入别人的用户名，和新密码就能更改密码
 */
__webpack_require__(69);
__webpack_require__(10);
var _mm         = __webpack_require__(0);
var _user       = __webpack_require__(1);
//表单里面的错误提示
var formError = {
	show : function(errMsg){
		var errorItem  		= document.getElementsByClassName('error-item')[0];
		var errMsgShow	    = errorItem.getElementsByClassName('err-msg')[0];
		errorItem.style.display = 'block';
		errMsgShow.innerHTML 	= errMsg;
	},
	hide : function(){
		var errorItem  		= document.getElementsByClassName('error-item')[0];
		var errMsgShow	    = errorItem.getElementsByClassName('err-msg')[0];
		errorItem.style.display = 'none';
		errMsgShow.innerHTML 	= '';
	}
}
var page = {
	data   : {
		username : '',
		question : '',
		answer 	 : '',
		token	 : '',
	},
	init   : function(){
		this.onLoad();
		this.bindEvent();
	},
	onLoad : function(){
		this.loadStepUsername();
	},
	bindEvent : function(){
		var _this = this;
		var submitUsernameBtn 	= document.getElementById('submit-username');
		var submitQuestionBtn 	= document.getElementById('submit-question');
		var submitPasswordBtn 	= document.getElementById('submit-password');
		//点击输入用户名下一步按钮
		submitUsernameBtn.onclick = function(){
			var usernameVal = 	document.getElementById('username').value;
			var usernameVal =	$.trim(usernameVal);
			//用户名存在
			if(usernameVal){
				//如果得到问题就把问题保存起来调到下一步
				_user.getQuestion(usernameVal,function(res){
					_this.data.username = usernameVal;
					_this.data.question = res;
					_this.loadStepQuestion();
				},function(errMsg){
					formError.show(errMsg);
				});
			}
			//用户名不存在
			else{
				formError.show('请输入用户名');
			}
		}
		//点击密码提示问题答案中的下一步按钮点击
		submitQuestionBtn.onclick = function(){
			var answerVal = 	document.getElementById('answer').value;
			var answerVal =	$.trim(answerVal);
			//答案存在
			if(answerVal){
				//检查密码提示答案
				_user.checkAnswer({
					username : _this.data.username,
					question : _this.data.question,
					answer	 : answerVal
				},function(res){
					_this.data.answer 	= answerVal;
					_this.data.token 	= res;
					_this.loadStepPassword();
				},function(errMsg){
					formError.show(errMsg);
				})
			}
			//用户名不存在
			else{
				formError.show('请输入密码提示问题答案');
			}
		}
		//输入新密码后下一步按钮点击
		submitPasswordBtn.onclick = function(){
			var passwordVal = 	document.getElementById('password').value;
			console.log(passwordVal)
			var passwordVal =	$.trim(passwordVal);
			console.log(passwordVal)
			//密码是否存在
			if(passwordVal && passwordVal.length >=6){
				//检查密码提示答案
				console.log(passwordVal)
				_user.resetPassword({
					username 	 : _this.data.username,
					passwordNew	 : passwordVal,
					forgetToken	 : _this.data.token,
				},function(res){
					window.location.href = './result.html?type=pass-reset';
				},function(errMsg){
					formError.show(errMsg);
				})
			}
			//密码不存在
			else{
				formError.show('请输入不少于六位的新密码');
			}
		}
	},
	//加载输入用户名的那一步
	loadStepUsername : function(){
		var stepUsername = document.getElementsByClassName('step-username')[0];
		stepUsername.style.display = "block";
	},
	//切换到输入密码提示问题那一步
	loadStepQuestion : function(){
		var stepUsername = document.getElementsByClassName('step-username')[0];
		var stepQuestion = document.getElementsByClassName('step-question')[0];
		var questionSpan = document.getElementsByClassName('question')[0];
		//清除错误提示
		formError.hide();
		stepUsername.style.display = "none";
		stepQuestion.style.display = "block";
		questionSpan.innerHTML	   = this.data.question;
	},
	//加载输入password的那一步
	loadStepPassword : function(){
		var stepQuestion = document.getElementsByClassName('step-question')[0];
		var stepPassword = document.getElementsByClassName('step-password')[0];
		//清除错误提示
		formError.hide();
		stepQuestion.style.display = "none";
		stepPassword.style.display = "block";
	}
	
	
};
window.onload  = function(){
	page.init();
}


/***/ }),

/***/ 69:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[67]);