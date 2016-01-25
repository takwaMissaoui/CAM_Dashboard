
rxgbm.controller('DashboardCustomerCtrl', ['$scope','$routeParams', 'rxgbmCommon', 'dashboardContext',
	function($scope, $routeParams, rxgbmCommon, dashboardContext){
	
	if(angular.isUndefined($routeParams.country))
		dashboardContext.setCountry('global')
	else
		dashboardContext.setCountry($routeParams.country.toLowerCase() || 'global')

	if(angular.isUndefined($routeParams.customerId))
		console.error("customerId is not defined")
	else
		dashboardContext.setCustomer($routeParams.customerId);

 
	if(angular.isUndefined($routeParams.startDate) || angular.isUndefined($routeParams.endDate))
		console.error("startDate")

	else
		dashboardContext.setDate(moment($routeParams.startDate),moment($routeParams.endDate));

	dashboardContext.triggerEndofUpdate();

}]);
