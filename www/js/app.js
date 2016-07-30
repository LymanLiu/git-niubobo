angular.module('app', 
	[
		'ionic', 
		'ngResource',
		'app.config',
		'app.services',
		'app.controllers',
		'app.directives'
	]
)

/*
*     .run(function($ionicPlatform) {
 $ionicPlatform.ready(function() {
 // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
 // for form inputs)
 if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
 cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
 }
 if (window.StatusBar) {
 // org.apache.cordova.statusbar required
 StatusBar.styleLightContent();
 }
 });
 })
* */

.config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

	//解决导航条统一在下面
    $ionicConfigProvider.platform.ios.tabs.style('standard');
    $ionicConfigProvider.platform.ios.tabs.position('bottom');
    $ionicConfigProvider.platform.android.tabs.style('standard');
    $ionicConfigProvider.platform.android.tabs.position('standard');

    $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
    $ionicConfigProvider.platform.android.navBar.alignTitle('left');

    $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
    $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

    $ionicConfigProvider.platform.ios.views.transition('ios');
    $ionicConfigProvider.platform.android.views.transition('android');

	$stateProvider
	//主页路由
	.state('niubobo', {
		url: '/niubobo',
		abstract: true,
		templateUrl: 'view/tabs.html'
	})
	//牛伯伯商城路由
	.state('niubobo.store', {
		url: '/store',
		views: {
			'store': {
				templateUrl: 'view/store/store.html',
				controller: 'storeCtr'
			}
		}	
	})
		//搜索路由
		.state('niubobo.search', {
			url: '/search',
			views: {
				'store': {
					templateUrl: 'view/store/search.html'
					// controller: 'searchCtr'
				}
			}	
		})

		//文章详情路由
		.state('niubobo.articleDetail', {
			url: '/articleDetail',
			views: {
				'store': {
					templateUrl: 'view/store/articleDetail.html'
					// controller: 'searchCtr'
				}
			}	
		})

	//商品分类路由
	.state('niubobo.classification', {
		url: '/classification',
		views: {
			'classification': {
				templateUrl: 'view/product/classification.html',
				controller: 'classificationCtr'
			}
		}	
	})

	//商品详情购买路由
	.state('productDeatil', {
		url: '/niubobo/productDeatil/:productname',
		templateUrl: 'view/product/productDeatil.html',
		controller: 'productDeatilCtr'
	})

	//商品列表路由
	.state('typelist', {
		url: '/niubobo/typelist/:producttype',
		templateUrl: 'view/product/typelist.html',
		controller: 'typelistCtr'
	})

	//积分商城路由
	.state('integralStore', {
		url: '/niubobo/integralStore',
		templateUrl: 'view/integralStore/integralStore.html',
		controller: 'integralStoreCtr'
	})

	//订单列表路由
	.state('confirmAndOrder', {
		url: '/niubobo/confirmAndOrder',
		templateUrl: 'view/product/confirmAndOrder.html',
		controller: 'confirmAndOrderCtr'
	})


	//我优货路由
	.state('niubobo.cleanCargo', {
		url: '/cleanCargo',
		views: {
			'cleanCargo': {
				templateUrl: 'view/cleanCargo.html',
				controller: 'cleanCargoCtr'
			}
		}	
	})
	//购物车路由
	.state('niubobo.shoppingTrolley', {
		url: '/shoppingTrolley',
		views: {
			'shoppingTrolley': {
				templateUrl: 'view/shoppingTrolley/shoppingTrolley.html',
				controller: 'shoppingTrolleyCtr'
			}
		}	
	})
	//个人中心路由
	.state('niubobo.PersonalCenter', {
		url: '/PersonalCenter',
		views: {
			'PersonalCenter': {
				templateUrl: 'view/userCenter/PersonalCenter.html',
				controller: 'PersonalCenterCtr'
			}
		}	
	})
		//登录路由
		.state('niubobo.login', {
			url: '/login',
			views: {
				'PersonalCenter': {
					templateUrl: 'view/userCenter/login.html',
					controller: 'loginCtr'
				}
			}	
		})

		//用户设置路由
		.state('niubobo.setUser', {
			url: '/setUser',
			views: {
				'PersonalCenter': {
					templateUrl: 'view/userCenter/setUser.html',
					controller: 'setUserCtr'
				}
			}	
		})
	// //404
	// .state('niubobo.404', {
	// 	url: '/404',
	// 	template: '404错误~！'
	// })
	$urlRouterProvider
	.otherwise('/niubobo/store')
	// .otherwise('/niubobo/404')
	
}])