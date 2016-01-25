rxgbm.controller('lateOrderCtrl',['$scope','esClient','$location','dashboardContext',function($scope,esClient,$location,dashboardContext){

	$scope.nbResults = 0;
	$scope.pageRange = []; //used for pagination;
	//request parts
	$scope.pageSize = 10;
	$scope.pageNum = 1;

	$scope.getLateOrders = function(){
	
		esClient.search({
			index:dashboardContext.getIndex(),
			type:'order',
			from: ($scope.pageNum - 1) * $scope.pageSize,
			size: $scope.pageSize,
			body:computeQuery()
		}).then(function(resp){
			$scope.lateOrders=resp.hits.hits;
			$scope.setNbResults(resp.hits.total);
			getTotalOrders($scope.nbResults);
			
		}).catch(function(err){
			console.log(err);
		})
	}

	var computeQuery=function(){

		filter=null;
		body={};
			
		filter=dashboardContext.getFilter(['productId','customerId','notEvents'],'order',['ordercreate']);

		//execlude all orders with confirmed ...received status 
		filter.and.filters.push({
	                     "not": {
	                        "terms": {
	                            "status": ["10","70","410","420","230","110","120","170"]
	                            }
	                        }});
		// include orders where max delivery date < max status update

		filter.and.filters.push({"script":{"script":"lateOrders"}});
			

		body=	{
				"sort":[{"_score":{"order":"dsc"}}],
			    query: {
			        function_score: {
			            query: {
			                filtered: {"filter":filter}},
			                        "functions": [{
			                            "filter": {
			                                "not": {
			                                    "terms": {
			                                        "status": ["10", "70", "410", "420", "230",
			                                            "110", "120", "170"
			                                        ]
			                                    }
			                                }
			                            },
			                            "weight": 2
			                        }, {
			                            "filter": {
			                                "script": {
			                                    "script": "lateOrders"
			                                }
			                            },
			                            "script_score": {
			                                "script": "score_lateOrders"
			                            },
			                            "gauss": {
			                                "date": {
			                                    "origin": "now",
			                                    "scale": "5d",
			                                    "offset": "2d",
			                                    "decay": 0.5
			                                }
			                            }
			                        }],
			                        "score_mode": "multiply"
			                    }
			                },
			                "script_fields" : {
			                     "delay" : {
			                         "script" : "delay"
			                     }}
			                ,
			                "fields": [
			                  "_source"
			                ]
			            }

		return body;

		}

	$scope.setNbResults = function(nbResults){
		
		$scope.nbResults = nbResults;
		console.log('late'+nbResults);
		nbPages = Math.ceil($scope.nbResults / $scope.pageSize)+1;
		temp = [];
		a=1;
		for(a ; a < nbPages; a++)
			temp.push(a);
		$scope.pageRange = temp;
	
	}

	$scope.navToPage = function(pageNum){
		console.log('navToPage' + pageNum);
		$scope.pageNum = pageNum;
		$scope.getLateOrders();
	};

	var computeTotalQuery=function(){
		filter=null;
		body={};
		filter=dashboardContext.getFilter(['productId','customerId'],'order',null);
		body={
			query: {
				   filtered : {
					"filter" : filter
				}
			}};
		return body;

	}

	var getTotalOrders=function(lateOrders){
		esClient.count({
			index:dashboardContext.getIndex(),
			type:'order',
			body:computeTotalQuery()

		}).then(function(resp){
			$scope.totalOrders=resp.count;
			$scope.pourcentageLate=(lateOrders/$scope.totalOrders)*100;
			$scope.onTime=$scope.totalOrders-lateOrders;
			$scope.pourcentageOnTime=100-$scope.pourcentageLate;
			console.log($scope.totalOrders,$scope.pourcentageLate,$scope.pourcentageOnTime);
		}).catch(function(err){
			console.log(err);
		})
	}

	$scope.getLateOrders();

	

}])