/**
*
* LIST FAV PRODUCTS OF A CUSTOMER
**/
rxgbm.controller('ListFavoriteProductsCtrl', ['$scope','esClient','dashboardContext', function($scope, esClient, dashboardContext){
	$scope.termSize = 20;
	$scope.customerId = dashboardContext.getCustomer();
	$scope.country = dashboardContext.getCountry().id;
	var body = {
				query :{
				    function_score: {
						functions : 
							[{field_value_factor: { field: "browsed.search", factor: 1	}},
							 {field_value_factor: { field: "browsed.stock", factor: 1	}},
							 {field_value_factor: { field: "browsed.direct", factor: 2	}},
							 {field_value_factor: { field: "browsed.price",  factor: 6}}
						],
					score_mode: "sum"
				  }//function_score
				}, // query
				aggs :{
					top_terms: {
						terms: {
							field: "productCode",
							order: { total_score: "desc" },
							size: $scope.termSize
						},
						aggs :{
							total_score :{ sum : {script :'_score'}},
							total_search :{ sum : {field :'browsed.search'}},
							total_stock :{ sum : {field :'browsed.stock'}},
							total_direct :{ sum : {field :'browsed.direct'}},
							total_price :{ sum : {field :'browsed.price'}},
							total_order :{ value_count : {field : 'browsed.orders'}}
						}
					}//top_terms
				}
		};
	//set the query only if there is a customerID
	if($scope.customerId !=null)
		body.query.function_score.query = {
						filtered :{
							filter : dashboardContext.getFilter(['customerId'], 'product')
						}
					}//query
	//RUN THE QUERY
	esClient.search({
		index : dashboardContext.getIndex(),
		type : 'product',
		size: 1,
		body : body
	}).then(function (resp) {
			$scope.products = resp.aggregations.top_terms.buckets;
		}).catch(function (err) {
			console.log(err);
	});

}]);
