
rxgbm.directive('rxgbmListOrders', function() {
  return {
	restrict: 'A',
	controller: 'ListOrders',
	scope:{},
	templateUrl: 'partials/order/list-orders.html'
  };
});