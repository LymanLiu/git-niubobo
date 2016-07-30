angular.module('app.userCtr',[])
//个人中心控制器
.controller('PersonalCenterCtr', ['$scope','Storage', function ($scope, Storage) {
	$scope.userInfo = '请登录';
	$scope.userUrl = '#/niubobo/login';

    	// Storage.remove(storageKey)

	 var storageKey='username';

    //每次加载前 判断是否登录
    $scope.$on('$ionicView.beforeEnter', function() {
        if(Storage.get(storageKey)&&Storage.get(storageKey).username!=''){
            $scope.userInfo=Storage.get(storageKey);
            $scope.userUrl = '#/niubobo/setUser';
        }else{
            $scope.userInfo='请登录';
            $scope.userUrl = '#/niubobo/login';
        }
    });


}])
//登录控制器
.controller('loginCtr', ['$scope', 'User', 'Storage', '$state', '$ionicLoading', function ($scope, User, Storage, $state, $ionicLoading) {

	$scope.signIn = function (user) {
		if(user){
			if(user.username && user.password) {
				User.login(user.username, user.password);
			} else {
				$ionicLoading.show({
					noBackdrop: true,
					template: '请填写完整的用户信息',
					duration: 1500
				});
			}
		} else {
			$ionicLoading.show({
				noBackdrop: true,
				template: '请填写用户信息',
				duration: 1500
			});
		}
	}

	$scope.$on('User.loginUpdated', function () {
		var userRel = User.getCurrentUser();
		if(userRel.username){
			Storage.set('username', userRel.username);
			$state.go('niubobo.PersonalCenter');
		} else {
			$ionicLoading.show({
				noBackdrop: true,
				template: '登录失败',
				duration: 1500
			});
		}
	});

	$scope.$on('mainProductUpdated', function () {
		$scope.mainProductData = getOneData.getTheData();
	})

}])

//用户设置控制器
.controller('setUserCtr', ['$scope','Storage', '$http', '$state', '$ionicPopup', '$ionicActionSheet', 'User', function($scope, Storage, $http, $state, $ionicPopup, $ionicActionSheet, User){
	//初始值
	$scope.user = {
		img  : '',
		email : '未绑定',
		name : '未设置',
		phone : '未绑定',
		password : '未设置'
	}
	var storageKey = 'username';
	 //每次加载前 判断是否登录
    $scope.$on('$ionicView.beforeEnter', function() {
        if(Storage.get(storageKey)&&Storage.get(storageKey).username!=''){
            $scope.user.name = Storage.get(storageKey);
            $scope.user.password = '修改密码';
        }else{
            $state.go('niubobo.PersonalCenter');
        }
    });

     //退出登录
    $scope.logout = function () {
       
        var hideSheet = $ionicActionSheet.show({

            destructiveText: '退出登录',
            titleText: '确定退出当前登录账号么？',
            cancelText: '取消',
            cancel: function() {
                // add cancel code..
            },
            destructiveButtonClicked: function() {
                logout();
                return true;
            }
        });


    }
    //退出登录的方法
    function logout(){
        User.logout();
        $state.go('niubobo.PersonalCenter');  //路由跳转


    }

    $scope.showPopup = function(type) {
		// 调用$ionicPopup弹出修改内容

		$scope.data = {}
		$ionicPopup.show({
			template: "<input type='text' autofocus placeholder='" + showEditor(type).title + "' ng-model='data.newName'>",
			title: showEditor(type).title,
			// subTitle: "密码为8位",
			scope: $scope,
			buttons: [
				{ text: "取消" },
				{
					text: "确认",
					type: "button-green",
					onTap: function(e) {
						return $scope.data.newName;
					}
				}
			]
		})
		.then(function(res) {
			if(res){
				showEditor(type).editor(res);
			}
		});
	};

	//使用策略模式 修改 用户信息
	var showEditor = (function () {
		var _msgType = {
			name : {
				title : '请输入新的呢称',
				editor : function (newname) {
					$http({
						method: 'GET',
						url: 'php/newname.php',
						params: {
							'newname' : newname
						}
					})
					.success(function (res) {
						if(res.errno === 0) {
							Storage.set('username' , res.data.newname);
							$scope.user.name = res.data.newname;
						}
						
					})
					
				}
			},
			email : {
				title : $scope.user.email === '未绑定' ? '请输入绑定邮箱' : '请输入新的邮箱号',
				editor: function (newemai) {
					
				}
			},
			phone : {
				title : $scope.user.phone === '未绑定' ? '请输入绑定的手机号' : '请输入新的手机号',
				editor: function (newphone) {
					
				}
			},
			密码 : {
				title :'请输入新的密码',
				editor: function (newphone) {
					
				}
			}
		}

		return function (type) {
			return _msgType[type]
		}
	})()


}])