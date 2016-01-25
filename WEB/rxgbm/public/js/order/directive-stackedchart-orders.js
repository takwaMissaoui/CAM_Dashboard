rxgbm.directive('rxgbmStackedChartOrders', function(){
	 return {
		template:'<div class="panel rx-main-panel"><div class="panel-heading">Order status <small style="float:right"> todo : onclick update below table</small></div><div class="panel-body"><nvd3 options="options" data="data" interpolate="linear" order="inside-out"></nvd3></div></div>',
		controller: 'StackedChartOrdersCtrl'
	}
});
