angular.module('app.directives', [])

//定义底部菜单栏的显隐指令
.directive('hideTabs',  ['$rootScope', function ($rootScope) {
	return {
		restrict : 'AE',
		link : function ($scope) {
			$rootScope.hideTabs = 'tabs-item-hide';
			$scope.$on('$destroy' , function () {
				$rootScope.hideTabs = '';
			})
		}
	}
}])

//定义一个购买选择产品的指令
.directive('chooseProduct', ['$rootScope', '$timeout','$http','$ionicLoading','$state', function ($rootScope,$timeout,$http,$ionicLoading,$state) {
	return {
		restrict : 'EA',
		replace : true,
		templateUrl: 'view/product/chooseProduct.html',
		link : function ($scope, jqlite, attrs) {
			$scope.$on('showChooseProduct', function (e,type) {
				jqlite.css('display', 'block');
				jqlite.addClass('active');
				$timeout(function () {
					jqlite.children('#gouShop').css('transform','translate3d(0,0,0)');
					
				},10);

				$scope.closePage = function () {
					jqlite.children('#gouShop').css('transform','translate3d(0,120%,0)');
					$timeout(function () {
						jqlite.css('display', 'none');
						jqlite.removeClass('active');
					},300);
				}

				$scope.chooseSure = function () {
					if(type === 'joinCar') {
						$scope.closePage();
						$http({
							method: 'GET',
							url: 'php/joincar.php',
							param : {

							}
						})
						.success(function (e) {
							if(e === 'ok'){
								$ionicLoading.show({
									template: "添加成功"
								});
								$timeout(function(){
									//隐藏载入指示器
									$ionicLoading.hide();
								},800);

							}
						})
					} else if( type === 'buyProduct') {
						//给订单详情发送一条是否显示返回的消息
	 					$rootScope.$broadcast('showBack');
						$state.go('confirmAndOrder')
					}
				}
			})
		}
	}
}])

//定义一个猜你喜欢指令
.directive('guessLike', function () {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'view/guessLike.html',
		link : function ($scope, jqlite, attrs) {
			var guessProBox = document.querySelector('.guess-pro-box');
			var liLength = guessProBox.querySelectorAll('li').length;
			guessProBox.style.width = liLength * 7 +'rem';
			// var w = jqlite.find('.guess-pro-box li').Width() * jqlite.find('.guess-pro-box li').length;
			// jqlite.find('.guess-pro-box').css('width', w);
		}
	}
})

//定义一个购物车列表指令
.directive('carList', ['$ionicLoading','$timeout', function ($ionicLoading, $timeout) {
	return{
		restrict : 'E',
		replace: true,
		templateUrl: 'view/shoppingTrolley/carList.html',
		link: function ($scope, jqlite, attrs) {

			var inp = jqlite[0].querySelector('.inp');
			var oldItemVal = $scope.item.value;

			$scope.addVal = function () {
				oldItemVal = $scope.item.value;
				$scope.item.value ++;

				if($scope.item.checked){
					$scope.$emit('changeNum',{
						listNum: 1,
						listPrice: $scope.item.price
					})
				} else {
					$scope.$emit('changeNum',{
						listNum: $scope.item.value, 
						listPrice: $scope.item.value * $scope.item.price
					});
					$scope.item.checked = true;
					
				}
				
			}
			$scope.lessVal = function () {
				oldItemVal = $scope.item.value;

				if($scope.item.checked){
					$scope.$emit('changeNum',{
						listNum: $scope.item.value == 1 ? 0 : -1,
						listPrice: $scope.item.value == 1 ? 0 : -$scope.item.price
					})
				} else {
					$scope.$emit('changeNum',{
						listNum: $scope.item.value, 
						listPrice: $scope.item.value * $scope.item.price
					});
					$scope.item.checked = true;
					
				}
				$scope.item.value --;
				if($scope.item.value < 1) $scope.item.value = 1;
			}

			$scope.dele = function () {
				jqlite.css('display' , 'none');
				$ionicLoading.show({template: "删除成功"});
				$timeout(function(){
					//隐藏载入指示器
					$ionicLoading.hide();
				},800);
				$scope.$emit('carListDele', attrs.id)
			}
			$scope.checked = function () {
				var choosed = 'choosed' + attrs.id;
				$scope.item.checked = !$scope.item.checked;
				var data = {
					choosed : [choosed, $scope.item.checked],
					listPrice : $scope.item.price * $scope.item.value,
					listNum : $scope.item.value
				};
				$scope.$emit('childCheck', data)
			}

			$scope.$on('allChoosed', function (e,allChoosed) {
				if (allChoosed) {
					$scope.item.checked = true;
				} else {
					$scope.item.checked = false;
				}
			})
		}
	}
}])