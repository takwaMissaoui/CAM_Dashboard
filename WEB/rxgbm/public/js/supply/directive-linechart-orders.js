rxgbm.directive('rxgbmLineChartOrders', function(){
	 return {
		template:'<div class="panel rx-main-panel"><div class="panel-heading">Order lines statistics <small style="float:right"> Avg lines / orders {{avg_line_per_order |number:1}} for the current period</small></div><div class="panel-body"><nvd3 options="options" data="data"></nvd3></div></div>',
		controller: 'rxgbmLineChartOrders'
	}
});
