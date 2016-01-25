
rxgbm.controller('DashboardOrderCtrl', ['$scope','$routeParams', 'esClient' ,'dashboardContext',
	function($scope, $routeParams, esClient, dashboardContext){
	$scope.order = {};
	if(angular.isUndefined($routeParams.country))
		console.error("country is not defined")
	else
		dashboardContext.setCountry($routeParams.country.toLowerCase())

	if(angular.isUndefined($routeParams.customerId))
		console.info("customerId is not defined")
	else
		dashboardContext.setCustomer($routeParams.customerId)

	if(angular.isUndefined($routeParams.orderId))
		console.error("orderId is not defined")
	else
		dashboardContext.setOrder($routeParams.orderId)

	if(angular.isDefined($routeParams.startDate) || angular.isDefined($routeParams.endDate))

		dashboardContext.setDate(moment($routeParams.startDate),moment($routeParams.endDate));

	dashboardContext.triggerEndofUpdate();

	esClient.search({
		index : dashboardContext.getIndex(),
		type : 'order',
		q: '_id:'+dashboardContext.getOrder()
	}).then(function (resp) {
			$scope.order = resp.hits.hits[0]._source;
		}).catch(function (err) {
			console.log(err);
	});

}]);
