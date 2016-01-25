rxgbm.controller('DashboardSupplyCtrl', ['$scope', '$routeParams', 'dashboardContext', function($scope, $routeParams, dashboardContext){
	if(angular.isUndefined($routeParams.country))
		dashboardContext.setCountry('global')
	else
		dashboardContext.setCountry($routeParams.country.toLowerCase())

	if(dashboardContext.getCountry().id !='global')
		$scope.isNotGlobal = true;
	else 
		$scope.isNotGlobal = false;

	if(angular.isDefined($routeParams.productId))

		dashboardContext.setProduct($routeParams.productId);

	dashboardContext.triggerEndofUpdate();
}]);