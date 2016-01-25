
rxgbm.directive('rxgbmDetailsOrder', function() {
  return {
	restrict: 'A',
	scope: {
	  order: '=rxgbmDetailsOrder'
	},
	controller: 'DetailsOrderCtrl',
	templateUrl: 'partials/order/details-order.html'
  };
});