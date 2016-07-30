angular.module('app.services', [])

//数据缓存
.factory('Storage', function(){
	return {
		set: function (key, data) {
			return window.localStorage.setItem(key, window.JSON.stringify(data));
		},
		get: function (key) {
			return window.JSON.parse(window.localStorage.getItem(key));
		},
		remove: function (key) {
			return window.localStorage.removeItem(key);
		}
	};
})

//获取单次数据
.factory('getOneData', ['$rootScope', '$resource', 'ENV', function ($rootScope, $resource, ENV) {
	var rootUrl = ENV.dataUrl,
		topic = '';

	var resource = $resource(rootUrl + '/:name.json', {}, {
		query: {
			method: 'get',
			name : '@name',
			timeout: 20000
		}
	});

	return {
		//获取数据
		getTopics: function (name) {
			resource.query({
				name : name
			}, function (res) {
				if(res.errno === 0) {
					topic = res.data;

					$rootScope.$broadcast(name + 'Updated');
				}
			});
		},
		//返回数据
		getTheData: function () {
			if(!topic) return false;
			return topic
		}
	}
}])


//获取产品数据
.factory('getProductData', ['$rootScope', '$resource', 'ENV', function ($rootScope, $resource, ENV) {
	var rootUrl = ENV.dataUrl,
		// 用来存储话题类别的数据结构，包含了下一页、是否有下一页等属性
        topics = {},
        catid = 20;

}])


//用户登录
.factory('User', ['$resource','$rootScope','ENV','Storage', function($resource, $rootScope, ENV, Storage){

	var rootUrl = ENV.dataUrl,
		user,
		storageKey = 'username',
		resource = $resource('php/login.php');

	return {
		login: function (username, password) {
			return resource.save({
				username: username,
				password: password
			},function (res) {
				if(res.errno === 0) {
					user = res.data;
					$rootScope.$broadcast('User.loginUpdated');
				}
			})
		},
		logout: function () {
			user = {};
			Storage.remove(storageKey);
		},
		getCurrentUser: function () {
			return user;
		}		
	};
}])


//定义一个滑动展示产品的服务
.service('Dragable', function(){
	(function(){
    var Dragable = window.Dragable = function(ID){
        this.dom =  document.getElementById(ID);
        this.Ul = this.dom.getElementsByTagName('ul')[0];
        this.Lis = this.Ul.getElementsByTagName('li');
        this.LisLength = this.Lis.length;
        this.LisWidth = this.Lis[0].offsetWidth + parseFloat(window.getComputedStyle(this.Lis[0]).marginRight) + 2;
        this.ulWidth =  this.LisWidth * this.LisLength;
        this.winWidth = document.documentElement.clientWidth;
        this.min = this.winWidth - this.ulWidth - parseFloat(window.getComputedStyle(this.Lis[0]).marginRight) + 2;
        this.moveArr = [0,0];
        this.deltaX = 0;
        this.nowX = 0;
        this.lock = true;
        this.test = true;
        this.isgo = false;
        this.Ul.style.webkitTransform = 'translate3d(0,0,0)';

        this.init();
        this.move();
        this.binEvent();
    }

    Dragable.prototype = {
        init : function(){
            // this.Ul.style.width = this.ulWidth + 'px';
            this.Ul.style.width = '38rem';
        },
        move : function(){
            var self = this;
           window.onscroll
           window.addEventListener('scroll', function(event){
               if(document.body.scrollTop > (self.dom.offsetTop - 400) && self.lock && self.Ul.style.webkitTransform == 'translate3d(0px, 0px, 0px)'){
                    self.Ul.style.webkitTransition= "all 0.8s ease 0s"; 
                    self.Ul.style.webkitTransform = "translate3d(" + (-40) + "px,0,0)"; 
                    self.lock = false;
                    setTimeout(function(){
                        self.Ul.style.webkitTransform = "translateX(" + 0 + "px)"; 
                        self.lock = true;
                    }, 800)
               }
           }, false);
        },
        binEvent : function(){
            var self = this;
            var start_x1,start_y1;
            var time = 0;
            this.dom.addEventListener('touchstart', function(event){
                self.movearr = [0,0];
                self.Ul.style.webkitTransition = "none";
                self.deltaX = event.touches[0].clientX - self.nowX;
                // self.Ul.style.transform = "translate3d(" + self.deltaX + "px,0,0)";
                self.lock = false;

                start_x1 = event.targetTouches[0].clientX;
                start_y1 = event.targetTouches[0].clientY;
            }, false);

            this.dom.addEventListener('touchmove', function(event){
                var end_x1 = event.targetTouches[0].clientX;
                var end_y1 = event.targetTouches[0].clientY;
                var long_x1 = start_x1 - end_x1;
                var long_y1 = start_y1 - end_y1;
                // if(self.test){       //前30px禁止默认行为
                //     event.preventDefault();
                // }
                if(Math.abs(long_x1) > 30 && self.test){             //X轴先到达
                    self.isgo = true; self.test = false;
                }else if(Math.abs(long_y1) > 30 && self.test){       //Y轴先到达
                    self.isgo = false;self.test = false;
                }
                if(self.isgo){       //X轴先到达
                    event.preventDefault(); 			//锁定系统滑动
                    self.nowX = event.touches[0].clientX - self.deltaX;
                    self.Ul.style.transform = "translate3d(" + self.nowX + "px,0,0)";
                    self.Ul.style.webkitTransform = "translate3d(" + self.nowX + "px,0,0)";
                    time = new Date().getTime();
                }

                self.movearr.push(event.touches[0].clientX);
            }, false);

            this.dom.addEventListener('touchend', function(event){
                // var s = self.movearr[self.movearr.length - 1] - self.movearr[self.movearr.length - 2];
                var s = 0;
                
                var sNum = 4;
                for (var i = 1; i < sNum + 1; i++) {
                   s += self.movearr[self.movearr.length - i] - self.movearr[self.movearr.length - (i + 1)]
                };
                var sSum = s;
                s = s/sNum;
                time = (new Date().getTime() - time) || 0.6;

                var v = s / time

                // console.log('time: ' + time)
                // console.log('v: ' + v)

                var targetx = self.nowX + sSum * Math.abs(v);
                if(targetx < self.min){
                    targetx = self.min;
                    self.Ul.style.webkitTransition= "all "+time+"s linear 0s";    
                }else if(targetx > 0){
                    targetx = 0;
                    self.Ul.style.webkitTransition = "all "+time+"s linear 0s";
                }else{
                   self.Ul.style.webkitTransition = "all "+time+"s linear 0s";   
                }

                self.nowX = targetx;
                self.Ul.style.transform = "translate3d(" + self.nowX + "px,0,0)";
                self.Ul.style.webkitTransform = "translate3d(" + self.nowX + "px,0,0)";
                
                self.lock = true;
                self.test = true;
                self.isgo = false;
            }, false);
        }  
    }
    
})();

this.creat = function (id) {
	return new Dragable(id);
}
})