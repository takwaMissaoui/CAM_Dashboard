rxgbm.directive('rxgbmStackedChartProductOrders', function(){
	 return {
		restrict: 'A',
		template:'<nvd3 options="options1" data="data1"></nvd3>',
		controller: 'StackedChartProductOrdersCtrl'
	}
});
