angular.module('app.config', [])
//配置初始值
.constant('ENV', {
	"localhost" : "http://127.0.0.1/niubobo-app",
	"debug": false,
    'dataUrl':"data",
    'imgUrl':"images",
    'version':'1.0.1'
})