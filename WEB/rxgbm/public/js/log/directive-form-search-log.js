rxgbm.directive('rxgbmFormSearchLog', function() {
	  return {
		restrict: 'A',
		scope: {
		  context : '=', //MUST CONTAINS COUNTRY & INDEX NAME 
		},
		controller: 'LogFormSearchLogCtrl',
		templateUrl: 'partials/log/form-search.html'
	  };
});

rxgbm.controller('LogFormSearchLogCtrl', ['$scope', 'log', 'rxgbmCommon', function($scope, log, rxgbmCommon){
	/* Value for pagination */
	$scope.countries = rxgbmCommon.countries;
	$scope.fields = {
		country : $scope.context.country,
		application : $scope.context.application
	};

//	$scope.pageSize = 100;
//	$scope.pageNum = 1;
	
	var nameToNameValue = function(vals){
		var tab =[];
		for( a in vals )
			tab.push({
				name : vals[a].name + ' ('+ vals[a].value +')',
				value : vals[a].name
			});
		return tab;
	}

	$scope.getApplications = function(){
		log.getApplications({country : $scope.fields.country}, function (app){
			$scope.applications = nameToNameValue(app);
			console.log("applications :" , $scope.applications)
		});
		//$scope.getTransactions();
	}

    $scope.getTransactions = function(){
    	log.getTransactions({country : $scope.fields.country, application : $scope.fields.application}, function(trs){
    		$scope.transactions = nameToNameValue(trs);
    		console.log("transactions :" , $scope.transactions)
    	})
    }
    $scope.getStatus = function(){ //NOT WORKING
    	log.getStatus({country : $scope.fields.country, 
    					application : $scope.fields.application, 
    					status : $scope.fields.status}, function(sts){
    		$scope.status = nameToNameValue(sts);
    		console.log("status :" , $scope.status)
    	})
    }
    $scope.search = function(){
    	console.log("search");
    	$scope.context = {country : $scope.fields.country, 
    					application : $scope.fields.application, 
    					status : $scope.fields.status}
    	/*log.listLogs(, function(logDetails){
	    		console.log(logDetails);
    	})*/
    }
	/* Value to fill the form */
/*	$scope.criticity = [ {'name':"High" , 'value':'1'}, {'name':"Medium" , 'value':'2'}, {'name':"Low" , 'value':'3'}];
	$scope.applications = [];
	$scope.attribute_names = [];
	$scope.transactions = [];
	$scope.error_categories = [];
	$scope.status = [ {'name':"Started" , 'value':'10'}, {'name':"In Progress" , 'value':'20'}, {'name':"Terminated" , 'value':'30'}, {'name':"In Error" , 'value':'40'},{'name':"Terminated KO", 'value':'50'}];
		*/
	/*
	
	$scope.search = function(fields){
		esClient.search({
			index : fields.country,
			type : 'log',
			from: ($scope.pageNum - 1) * $scope.pageSize,
			size: $scope.pageSize,
			body : $scope.computeQuery()
		}).then(function (resp) {
				console.log(resp);
				//$scope.orders = resp.hits.hits;
				//$scope.setNbResults(resp.hits.total);
			}).catch(function (err) {
				console.log(err);
		});
	
	}//trigger the search
	*/
	/*$scope.computeQuery = function(fields){
		var query = {
			filtered : {
				filter : {}
			}
		};
		//Set date range
		if(params.from != '')
			query.filtered.filter.range = {
				startTs : {
					gt : params.from
				}
			}
		return query;
	}*/
	
}]);