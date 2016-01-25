rxgbm.controller('DashboardProductCtrl', ['$scope', '$routeParams', 'dashboardContext',
	function($scope, $routeParams, dashboardContext){
	
	if(angular.isUndefined($routeParams.country))
		console.error("country is not defined")
	else
		dashboardContext.setCountry($routeParams.country.toLowerCase())

	if(angular.isUndefined($routeParams.customerId))
		console.info("customerId is not defined")
	else
		dashboardContext.setCustomer($routeParams.customerId)

	if(angular.isUndefined($routeParams.productId))
		console.error("productId is not defined")
	else
		dashboardContext.setProduct($routeParams.productId);

	if(angular.isUndefined($routeParams.startDate) || angular.isUndefined($routeParams.endDate))
		console.error("startDate")

	else
		dashboardContext.setDate(moment($routeParams.startDate),moment($routeParams.endDate));

	$scope.productId = dashboardContext.getProduct();
	dashboardContext.triggerEndofUpdate();
}]);