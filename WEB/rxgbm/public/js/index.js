var rxgbm = angular.module('rxgbm', ['angular-loading-bar',
	'elasticsearch', 'ngRoute',
	'ui.bootstrap','ui.bootstrap.datetimepicker', 'ngSanitize','nvd3']);

	

rxgbm.config(['$routeProvider',function($routeProvider) {
			$routeProvider.

			  when('/', {
				templateUrl:'partials/dashboard/dashboard-country.html',
				controller: 'DashboardCountryCtrl',
			  }).
			  when('/from/:startDate/to/:endDate', {
			  	templateUrl:'partials/dashboard/dashboard-country.html',
			  	controller: 'DashboardCountryCtrl',
			  }).
			  when('/:country', {
			  	templateUrl:'partials/dashboard/dashboard-country.html',
			  	controller: 'DashboardCountryCtrl'
			  }).
			  when('/:country/from/:startDate/to/:endDate', {
			   	templateUrl:'partials/dashboard/dashboard-country.html',
			   	controller: 'DashboardCountryCtrl'
			  }).
			  when('/:country/supply', {			  
			  	templateUrl:'partials/dashboard/dashboard-supply.html',
			  	controller: 'DashboardSupplyCtrl'
			  }).
			  when('/:country/supply/from/:startDate/to/:endDate', {			  
			  	templateUrl:'partials/dashboard/dashboard-supply.html',
			  	controller: 'DashboardSupplyCtrl'
			  }).
			  when('/:country/supply/product/:productId', {			  
			  	templateUrl:'partials/dashboard/dashboard-supply.html',
			  	controller: 'DashboardSupplyCtrl'
			  }).
			  when('/:country/supply/product/:productId/from/:startDate/to/:endDate', {			  
			  	templateUrl:'partials/dashboard/dashboard-supply.html',
			  	controller: 'DashboardSupplyCtrl'
			  }).
			  when('/:country/customer/:customerId', {
				templateUrl:'partials/dashboard/dashboard-customer.html',
				controller: 'DashboardCustomerCtrl'
			  }).
			  when('/:country/customer/:customerId/from/:startDate/to/:endDate', {
			 	templateUrl:'partials/dashboard/dashboard-customer.html',
			 	controller: 'DashboardCustomerCtrl'
			  }).
			  	when('/:country/customer/:customerId/:orderId', {
				templateUrl:'partials/dashboard/dashboard-order.html',
				controller: 'DashboardOrderCtrl'
			  }).
			   when('/:country/customer/:customerId/:orderId/from/:startDate/to/:endDate', {
			 	templateUrl:'partials/dashboard/dashboard-order.html',
			 	controller: 'DashboardOrderCtrl'
			   }).
			  	when('/:country/customer/:customerId/product/:productId', {
				templateUrl:'partials/dashboard/dashboard-product.html',
				controller: 'DashboardProductCtrl'
			   }).
			   when('/:country/customer/:customerId/product/:productId/from/:startDate/to/:endDate', {
			 	templateUrl:'partials/dashboard/dashboard-product.html',
			 	controller: 'DashboardProductCtrl'
			   }).
			   when('/:country/product/:productId', {
				templateUrl:'partials/dashboard/dashboard-product.html',
				controller: 'DashboardProductCtrl'
			   }).
			   when('/:country/product/:productId/from/:startDate/to/:endDate', {
			 	templateUrl:'partials/dashboard/dashboard-product.html',
			 	controller: 'DashboardProductCtrl'
			   }).
			   when('/:country/order/:orderId', {
				templateUrl:'partials/dashboard/dashboard-order.html',
				controller: 'DashboardOrderCtrl'
			   }).
			   when('/:country/order/:orderId/from/:startDate/to/:endDate', {
			 	templateUrl:'partials/dashboard/dashboard-order.html',
			 	controller: 'DashboardOrderCtrl'
			   }).
			   otherwise({
				redirectTo: '/',
				templateUrl:'partials/dashboard/dashboard-customer.html',
				controller: 'CustomerSearchCtrl'
			  });
}]);


rxgbm.service('esClient', function (esFactory) {
	var baseUrl = window.location.hostname;
	if(window.location.port)
		baseUrl += ':' + window.location.port;
  return esFactory({
	host: baseUrl + '/proxy/elasticsearch',
	log: 'info'
  });
});




rxgbm.filter('rxgbmTimeAgo', function(){
	return function(input){
		var dateTo = moment(input);
		return dateTo.fromNow();
	}
})

rxgbm.filter("msToTime", function(){
		return function(duration){
			var value = "";
			var mil = 0;		
			var sec = 0; //1000ms
			var min = 0; //60 000 ms
			var hou = 0; //360 000 ms
			var rest = 0;
			
			if(duration >= 360000){
				hou =  Math.floor(duration/360000); duration = duration%360000;
			}
			if(duration >= 60000){
				min =  Math.floor(duration/60000); duration = duration%60000;
			}
			if(duration >= 1000){
				sec =  Math.floor(duration/1000); duration = duration%1000;
			}
			mil = duration;
			return new String("00" + hou).slice(-2) + ':' + new String("00" + min).slice(-2)  + ':' + new String("00" + sec).slice(-2)  +'.' + new String("000" + mil).slice(-3) ;
		}
	});

rxgbm.filter("orderStatusToName", ['rxgbmCommon', function(rxgbmCommon){
		return function(status){
			if(typeof rxgbmCommon.orderStatus[status] != 'undefined')
				return rxgbmCommon.orderStatus[status];
			else return status;
		}
}]);

rxgbm.filter("indexToCountryId", ['rxgbmCommon', function(rxgbmCommon){
		return function(index){
				for (a in rxgbmCommon.countries)
						if (rxgbmCommon.countries[a].index == index)
							return rxgbmCommon.countries[a].id.toUpperCase();
				return 'GLOBAL';
		}
}]);


rxgbm.service('rxgbmCommon', function(){
	
	this.countries = [
		{id:'global', name:'World', index : 'nl,sw',currency : ''}, //must remain first one.
		{id:'nl', name:'Netherlands', index : 'nl',currency:'EUR'}, 
		{id:'se', name:'Sweden', index : 'sw',currency:'SEK'},
		{id:'de', name:'Germany', index : 'gy',currency:'EUR'}
	]

	this.orderStatus = {
		'0' : 'In quotation',
'10' : 'Order received',
'20' : 'STATUS NOT USED',
'30' : 'Order send to warehouse',
'40' : 'STATUS NOT USED',
'50' : 'STATUS NOT USED',
'60' : 'STATUS NOT USED',
'70' : 'Order confirmed',
'80' : 'Later delivery',
'90' : 'STATUS NOT USED',
'100' : 'Being processed',
'110' : 'Being picked',
'120' : 'picked',
'130' : 'Out of stock',
'140' : 'STATUS NOT USED',
'150' : 'Box being calculated',
'160' : 'STATUS NOT USED',
'170' : 'package finished',
'180' : 'Package labeled',
'190' : 'STATUS NOT USED',
'200' : 'Loaded',
'210' : 'Planned to trip',
'220' : 'STATUS NOT USED',
'230' : 'Beeing delivered',
'240' : 'STATUS NOT USED',
'250' : 'STATUS NOT USED',
'260' : 'STATUS NOT USED',
'270' : 'STATUS NOT USED',
'280' : 'STATUS NOT USED',
'290' : 'Delivered',
'300' : 'STATUS NOT USED',
'310' : 'STATUS NOT USED',
'320' : 'STATUS NOT USED',
'330' : 'Reported back',
'340' : 'STATUS NOT USED',
'350' : 'STATUS NOT USED',
'360' : 'STATUS NOT USED',
'370' : 'STATUS NOT USED',
'380' : 'STATUS NOT USED',
'390' : 'STATUS NOT USED',
'400' : 'STATUS NOT USED',
'410' : 'Invoicing in progress',
'420' : 'Invoice sent',
'430' : 'STATUS NOT USED',
'440' : 'STATUS NOT USED',
'450' : 'STATUS NOT USED',
'460' : 'Rejected by ERP',
'470' : 'Blocked',
'480' : 'Closed',
'490' : 'Cancelled',
'500' : 'In Error'
	}

})