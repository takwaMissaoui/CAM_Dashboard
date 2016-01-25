rxgbm.directive('rxgbmFormDropdownDateLog', function() {
	  return {
		restrict: 'A',
		scope : {
			dateRange :'=',
			onValueSelection : '='
		},
		controller: 'FormDropdownDateLogCtrl',
		templateUrl: 'partials/log/dropdown-date-log.html'
	  };
});

rxgbm.controller('FormDropdownDateLogCtrl', ['$scope', function($scope){
	$scope.defaultLabel = "Select Date"
	$scope.label = $scope.defaultLabel
	$scope.date ={
		from :'',
		to : ''
	}

	$scope.onTimeFromSet = function(newDate, oldDate){
		var m = {
			from : moment($scope.date.from),
			to : moment($scope.date.to)
		}
		if($scope.date.to == '')
			$scope.date.to = m.from.clone().add(1, 'hours').toDate();
		else if (m.from.isAfter(m.to))
			$scope.date.from=m.to.toDate();

		$scope.changeLabel();
	}

	var setDateRange = function(){
		$scope.dateRange = $scope.date;
		console.log('setDateRange-> $scope.date', $scope.date)
		$scope.onValueSelection();
	}

	$scope.beforeRenderFrom = function ($view, $dates, $leftDate, $upDate, $rightDate){
			$scope.unSelectFutur($dates, $scope.date.to || new Date());
	}
	$scope.beforeRenderTo = function ($view, $dates, $leftDate, $upDate, $rightDate){
			$scope.unSelectFutur($dates);
	}


	$scope.unSelectFutur = function ($dates, limit){
		var till = moment(limit);
		for(i in $dates){
			var current = moment($dates[i].dateValue);
			if(current.isAfter(limit))
				$dates[i].selectable = false;
		}
	}

	$scope.onTimeToSet = function(newDate, oldDate){
		var m = {
			from : moment($scope.date.from),
			to : moment($scope.date.to)
		}
		console.log(m);
		if($scope.date.from == '')
			$scope.date.from = m.to.clone().subtract(1, 'hours').toDate();
		else if (m.to.isBefore(m.from))
			$scope.date.to=m.from.toDate();
		$scope.changeLabel();
	}
	$scope.changeLabel = function(){
		var m = {
			from : moment($scope.date.from),
			to : moment($scope.date.to)
		}
		var label = m.from.fromNow() + ' for ' + m.from.from(m.to, false);
		$scope.label = label;
		setDateRange();
	}
}]);