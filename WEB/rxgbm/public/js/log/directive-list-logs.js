rxgbm.directive('rxgbmListLogs', function() {
	  return {
		restrict: 'A',
		scope: {
		  context : '=', //MUST CONTAINS COUNTRY & INDEX NAME 
		},
		controller: 'ListLogsCtrl',
		templateUrl: 'partials/log/list-logs.html'
	  };
});

rxgbm.controller('ListLogsCtrl', ['$scope', 'log', 'rxgbmCommon', function($scope, log, rxgbmCommon){
	$scope.filter = {};
	$scope.field = {dateRange : {}};
	$scope.listLogs = [];
	$scope.pageNum = 1;
	$scope.pageSize = 100;
	$scope.nbResults = 0;

	var countryList = function (country){
		country = country || '_all';
		var countries = [];
		for (i in rxgbmCommon.countries)
			countries.push({
				id : rxgbmCommon.countries[i].id,
				name : rxgbmCommon.countries[i].name,
				selected : (rxgbmCommon.countries[i].id == country ? true : false)
			})
		return countries;
	}


	$scope.dropdownFilters = [
			{
				field : 'country',
				label : 'Country',
				dynamic : false,
				listValues : countryList(),
				maxSelect : 1
			},{
				field : 'Service.category',
				label : 'Applications',
				dynamic : true,
				listValues : [],
				maxSelect : 5
			},{
				field : 'Service.name',
				label : 'Interfaces',
				dynamic : true,
				listValues : [],
				maxSelect : 5
			}];

	$scope.onValueSelection = function(){
		buildFilter();
		loadDropDowns();
		updateTableValue($scope.filter);
	}
	$scope.$watch('context', function(newValue, oldValue){
		$scope.pageNum = 1;
		$scope.pageSize = 200;
		newValue.pageNum = $scope.pageNum;
		newValue.pageSize = $scope.pageSize
		updateTableValue(newValue);
	});


	var buildFilter = function (){
		$scope.filter = {};
		for(a in $scope.dropdownFilters){
			for (b in $scope.dropdownFilters[a].listValues)
				if($scope.dropdownFilters[a].listValues[b].selected){
					var fil = $scope.dropdownFilters[a];
					console.log('current filter', fil);
					if(typeof $scope.filter[fil.field] == "undefined")
						$scope.filter[fil.field] = fil.listValues[b].id;
					else if (Array.isArray($scope.filter[fil.field]))
						$scope.filter[fil.field].push(fil.listValues[b].id);
					else{
						var tmp = $scope.filter[fil.field];
						$scope.filter[fil.field] = [];
						$scope.filter[fil.field].push(tmp);
						$scope.filter[fil.field].push(fil.listValues[b].id);
					}
					
				}
		}
		console.log("buildFilter->dropdownFilters", $scope.filter);
		console.log("set filter date", $scope.field.dateRange);
		if(typeof $scope.field.dateRange.from!='undefined' && $scope.field.dateRange.from != '')
			$scope.filter.dateFrom = $scope.field.dateRange.from
		if(typeof $scope.field.dateRange.to!='undefined' && $scope.field.dateRange.to != '')
			$scope.filter.dateTo = $scope.field.dateRange.to
		console.log("buildFilter->with DateRange", $scope.filter);

	}

	var loadDropDowns = function(){
		console.log("loadDropDowns for filter", $scope.filter)
		for(a in $scope.dropdownFilters)
			if($scope.dropdownFilters[a].dynamic)
				loadDropDown($scope.dropdownFilters[a].field, $scope.dropdownFilters[a])
	}

	var loadDropDown = function(name, dropdownFilter){

		var dropFilter = {}; // filter without the current dropdown in it to get all other value possible if this dopdown was not selected
		for(i in $scope.filter)
			if(i != name)
				dropFilter[i] = $scope.filter[i];

		log.getFieldsTerms(name, dropFilter, function(values){
			if(dropdownFilter.listValues.length > 0)
				dropdownFilter.listValues = mergeSelection(dropdownFilter.listValues, nameToNameValue(values));
			else 
				dropdownFilter.listValues = nameToNameValue(values);

		});
	}

	var mergeSelection = function(listWithSelection, listNoSelection){
		for( i in listNoSelection){
			var j = 0;
			while( j < listWithSelection.length){
				if(listNoSelection[i].id == listWithSelection[j].id){
					listNoSelection[i].selected = listWithSelection[j].selected || false;
					listWithSelection.pop(j);
					break;
				}//if
				j++;
			}//while
		}//for

		return listNoSelection;
	}

	var nameToNameValue = function(vals){
		var tab =[];
		for( a in vals )
			tab.push({
				name : vals[a].name + ' ('+ vals[a].value +')',
				id : vals[a].name
			});
		return tab;
	}

	var updateTableValue = function(context){
		log.listLogs(context, function(logs){
			$scope.listLogs = logs.hits
			$scope.nbResults = logs.total
	    });
	}

	loadDropDowns();
}]);