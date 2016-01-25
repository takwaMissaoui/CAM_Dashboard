rxgbm.directive('rxgbmLineChartProductPrice', function(){
	 return {
		restrict: 'A',
		template:'<nvd3 options="options" data="data"></nvd3>',
		controller: 'StackedLineProductPriceCtrl'
	}
});
