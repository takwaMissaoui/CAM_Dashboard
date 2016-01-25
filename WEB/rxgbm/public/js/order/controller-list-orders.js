	
	/**
*
* LIST ALL ORDER OF A CUSTOMER
**/
rxgbm.controller('ListOrders', ['$scope','esClient', '$location','dashboardContext', function($scope, esClient, $location, dashboardContext){
		$scope.$watch('customerData', function(){
			$scope.pageNum = 1;
			$scope.refresh();
		});

		$scope.country = dashboardContext.getCountry();
		$scope.customerId = dashboardContext.getCustomer();

		$scope.orders = [];
		$scope.nbResults = 0;
		$scope.pageRange = []; //used for pagination;
		//request parts
		$scope.pageSize = 10;
		$scope.pageNum = 1;
		
		$scope.refresh = function(){
			
			//RUN THE QUERY
			esClient.search({
				index : dashboardContext.getIndex(),
				type : 'order',
				from: ($scope.pageNum - 1) * $scope.pageSize,
				size: $scope.pageSize,
				body : $scope.computeQuery()
			}).then(function (resp) {
					$scope.orders = resp.hits.hits;
					$scope.setNbResults(resp.hits.total);
					
				}).catch(function (err) {
					console.log(err);
			});
		}//refresh()
		//set nbResults and update the range

		$scope.computeQuery = function(){
			var body = {};

			var filter = null;
			filter = dashboardContext.getFilter('customerId');
			/*if (dashboardContext.getCustomer()!=null)
				filter = dashboardContext.getFilter('customerId');
			else
				filter = dashboardContext.getFilter();
			*/
			body.sort = { 
				"date": { "order": "desc" }
			}
			//body.filter = filter;
			body.query ={
				filtered :{filter : filter}
			}

			return body;
		}

		$scope.setNbResults = function(nbResults){
			console.log('setNbResults');
			$scope.nbResults = nbResults;
			nbPages = Math.ceil($scope.nbResults / $scope.pageSize)+1;
			temp = [];
			a=1;
			for(a ; a < nbPages; a++)
				temp.push(a);
			$scope.pageRange = temp;
			//console.log($scope.pageRange +':' + $scope.nbResults);
		}
		
		//use by the nav
		$scope.navToPage = function(pageNum){
			console.log('navToPage' + pageNum);
			$scope.pageNum = pageNum;
			$scope.refresh();
		};
}]);