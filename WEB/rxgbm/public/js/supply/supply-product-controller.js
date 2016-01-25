rxgbm.controller('supplyProductCtrl',['$scope','esClient', '$location','dashboardContext',function($scope,esClient,$location,dashboardContext){


	$scope.countQuantity=function(){
			
				
				esClient.search({

					index:dashboardContext.getIndex(),
					type:'order',
					body: {
						    query: {
						        filtered: {

						            filter: {
						                and: [
						                    {
						                        query : {
						                            match : { 
						                                'customerId':'REXEL'
						                            }
						                        }
						                    },
						                    {
											
						                     query: {
													term: { 
														'Lines.code':$scope.productIdent
													}
												}
						                    }
						                ]
						            }
						        }
						    }
						,

						   size: 0,
						   aggregations: {
						   
								'product_type': {
						         sum: {
						            'field': 'Lines.quantity'
									}
								}
						   }
						},


				}).then(function(resp){
					$scope.total=resp.aggregations.product_type.value;

				}).catch(function(err){
					console.log(err);

				})
		
	}







}])