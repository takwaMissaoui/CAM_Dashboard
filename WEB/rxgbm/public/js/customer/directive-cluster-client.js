rxgbm.directive('rxgbmClusterCustomer', function() {
  return {
	restrict: 'A',
	controller: 'clusterCtrl',
	templateUrl: 'partials/customer/customer-clusters.html'
  };
});