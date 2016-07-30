angular.module('app.controllers', ['app.userCtr'])
//商城控制器
.controller('storeCtr', ['$scope', 'getOneData', 'ENV', 'Dragable', '$timeout', function ($scope, getOneData, ENV, Dragable, $timeout) {

	$scope.localhost = ENV.localhost;

	// $scope.hotlist = []
	

	//获取主卖产品数据
	getOneData.getTopics('mainProduct');

	$scope.$on('mainProductUpdated', function () {
		$scope.mainProductData = getOneData.getTheData();
	})

	//获取热卖产品数据
	getOneData.getTopics('hotProduct');

	var l = false;

	$scope.$on('hotProductUpdated', function () {
		$scope.hotlist = getOneData.getTheData();
		console.log($scope.hotlist)

		$timeout(function () {
			// 创建一个左右滚动展示
			Dragable.creat('scrollX_1');
			l = true;
			
		},1000)
	})

	//每次加载前
    $scope.$on('$ionicView.beforeEnter', function() {
			// 创建一个左右滚动展示
		if(l) Dragable.creat('scrollX_1');
			
    });

}])
//商品分类控制器
.controller('classificationCtr', ['$scope', function ($scope) {
	console.log('classificationCtr success')
}])
//我优货控制器
.controller('cleanCargoCtr', ['$scope', function ($scope) {
	console.log('cleanCargoCtr success')
}])
//购物车控制器
.controller('shoppingTrolleyCtr', ['$rootScope', '$scope','getOneData','$http', function ($rootScope, $scope, getOneData, $http) {
	
	$scope.allPrice = 0;
	$scope.allNum = 0;

	//获取购物车数据
	getOneData.getTopics('buyCar');

	$scope.$on('buyCarUpdated', function () {
		$scope.carlist = getOneData.getTheData();
		
		//初始化购物车品种数量
		$rootScope.carBadge = $scope.carlist.length;

		//初始化选项对象
		$scope.chosedObj = {};
		for (var i = 0; i < $scope.carlist.length; i++) {
			$scope.chosedObj['choosed' + i] = $scope.carlist[i].checked;
			if ($scope.carlist[i].checked){
				$scope.allChosed = true;

				//初始化总价格
				$scope.allPrice += $scope.carlist[i].price * $scope.carlist[i].value;
				//初始化总数量
				$scope.allNum += $scope.carlist[i].value;
			}

			
			
			
		}

	})

	//监听数量变化
	$scope.$on('changeNum', function (e, data) {
		$scope.allNum += data.listNum;
		$scope.allPrice += data.listPrice;
	})

	//监听选中按钮
	$scope.$on('childCheck', function (e, childMsg) {
		$scope.chosedObj[childMsg.choosed[0]] = childMsg.choosed[1];
		if(childMsg.choosed[1]) {
			$scope.allPrice += childMsg.listPrice;
			$scope.allNum += childMsg.listNum;
		} else {
			$scope.allPrice -= childMsg.listPrice;
			$scope.allNum -= childMsg.listNum;

		}
		for(var k in $scope.chosedObj){
			if($scope.chosedObj[k]){
				$scope.allChosed = true;
				break;
			} else {
				$scope.allChosed = false;

			}
		}
	})

	var oldAllPrice = 0,
		oldAllNum = 0

	//全选按钮的点击事件
	$scope.allChoosedFun = function () {
		$scope.allChosed = !$scope.allChosed;
		$scope.$broadcast('allChoosed',$scope.allChosed)
		if($scope.allChosed){
			for(var k in $scope.chosedObj){
				$scope.chosedObj[k] = true;
			}
			$scope.allPrice = oldAllPrice;
			$scope.allNum = oldAllNum;
		} else {
			for(var k in $scope.chosedObj){
				$scope.chosedObj[k] = false;
			}
			oldAllPrice = $scope.allPrice;
			oldAllNum = $scope.allNum;
			$scope.allPrice = 0;
			$scope.allNum = 0;
		}
	}

	//监听删除按钮	
	$scope.$on('carListDele', function (e, data) {
		$http({
			method: 'GET',
			url: 'php/deleCarShop.php',
			params: {
				id : +data
			}
		})
		--$rootScope.carBadge;
	})

}])

//商品详情控制器
.controller('productDeatilCtr', ['$rootScope', '$scope', '$ionicActionSheet', function ($rootScope, $scope, $ionicActionSheet) {

	$scope.chooseProduct = function (type) {
	 	$scope.$broadcast('showChooseProduct', type);

	 	
	}
}])

//商品列表控制器
.controller('typelistCtr', ['$scope', function ($scope) {
	console.log('typelistCtr success')
}])

//积分商城控制器
.controller('integralStoreCtr', ['$scope', function ($scope) {
	console.log('integralStoreCtr success')
}])

//订单详情控制器
.controller('confirmAndOrderCtr', ['$scope','$ionicHistory', function ($scope, $ionicHistory) {
	$scope.isShow = true;

	$scope.$on('$ionicView.beforeEnter', function () {

		//判断是否由商品详情页进入
		if($ionicHistory.viewHistory().backView && $ionicHistory.viewHistory().backView.url.indexOf('productDeatil') > 0){
			$scope.isShow = false;
		} else {
			$scope.isShow = true;
		}

	})


}])