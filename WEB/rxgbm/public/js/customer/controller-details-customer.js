
rxgbm.controller('DetailsCustomerCtrl', ['$scope','esClient','dashboardContext', function($scope, esClient, dashboardContext){
	esClient.get({
		index : dashboardContext.getIndex(),
		type : 'customer',
		id:dashboardContext.getCustomer()
	}).then(function (resp) {
			$scope.customer = resp;
		}).catch(function (err) {
			console.log(err);
	});
}]);
