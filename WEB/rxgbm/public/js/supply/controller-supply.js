rxgbm.controller('supplyTabCtrl',['$scope','dashboardContext','esClient',function($scope,dashboardContext,esClient){
	
	$scope.rexelSupplies=[];

	$scope.nbResults = 0;
	$scope.pageRange = []; //used for pagination;
	//request parts
	$scope.pageSize = 10;
	$scope.pageNum = 1;
	$scope.productId=dashboardContext.getProduct();
	var computeQuery = function(){

		var body={};
		var filter=null;

		if((angular.isDefined(dashboardContext.getProduct()))&&(dashboardContext.getProduct())!=null)
			filter=dashboardContext.getFilter(['productId'],'order',null);
		else 
			filter=dashboardContext.getFilter();

		body={"sort": { "date": { "order": "desc" }}};
		
		body.query={
				term:{
					'customerId':'rexel'
				}};

		body.filter=filter;
		
		return body;

	}

	$scope.refresh=function(){

		esClient.search({
			index : dashboardContext.getIndex(),
			type : 'order',
			from: ($scope.pageNum - 1) * $scope.pageSize,
			size: $scope.pageSize,
			body:computeQuery()
		}).then(function (resp) {
				var rexelSupplies = resp.hits.hits;
				$scope.setNbResults(resp.hits.total);
				var tab= new Array();
				
				if(angular.isDefined(rexelSupplies)){
					var supplyLines=new Array();
					var totalPerProduct=0;
					
					for(var i=0;i<resp.hits.total;i++){
						
						if(angular.isDefined(rexelSupplies[i])){

							supplyLines = (rexelSupplies[i]._source).Lines;

							if(angular.isDefined(supplyLines))
							
								for(var j=0 ; j< supplyLines.length;j++){

									if(angular.isDefined(dashboardContext.getProduct()) && dashboardContext.getProduct()!=null)
										{if((dashboardContext.getProduct())==(supplyLines[j].code))

											{tab.push(supplyLines[j]);
												totalPerProduct+=supplyLines[j].quantity;}		}
										else
										{
											tab.push(supplyLines[j]);

										}
							}
						}

					}
				}
				$scope.tabSupply=tab;
				$scope.totalPP=totalPerProduct;
				
			}).catch(function (err) {
				console.log(err);
		});
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
		
	}

	$scope.navToPage = function(pageNum){
		console.log('navToPage' + pageNum);
		$scope.pageNum = pageNum;
		$scope.refresh();
	};
	
	$scope.refresh();

}])