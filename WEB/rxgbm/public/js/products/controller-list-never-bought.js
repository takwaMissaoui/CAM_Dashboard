/**
*
* LIST never bought product for a customer on a defined day.
**/
rxgbm.controller('ListNeverBoughtCtrl', ['$scope','esClient','dashboardContext', function($scope, esClient, dashboardContext){
	$scope.customerId = dashboardContext.getCustomer();
	$scope.country = dashboardContext.getCountry().id;
	var body = {
		filter : dashboardContext.getFilter(['customerId'], 'product')

		};

	body.filter.and.filters.push(
					{
						range : {
							"browsed.price" : {
								gt : 0
							}
						}
					},
					{
						missing:{
							"field" : "browsed.orders"
						}
					}
				)
	body.sort =[{
		"date" : "desc"
	},{
		"browsed.price" : "desc"
	}]

	//RUN THE QUERY
	esClient.search({
		index : dashboardContext.getIndex(),
		type : 'product',
		size: 20,
		body : body
	}).then(function (resp) {
		var prd = [];
		for (i in resp.hits.hits)
			prd.push(resp.hits.hits[i]._source);
		$scope.products = prd;

			console.log($scope.products);
		}).catch(function (err) {
			console.log(err);
	});

}]);
