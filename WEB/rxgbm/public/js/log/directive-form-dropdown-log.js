rxgbm.directive('rxgbmFormDropdownLog', function() {
	  return {
		restrict: 'A',
		scope: {
		  defaultLabel : '=',
		  listValues : '=',
		  maxValuesDisplayed : '=',
		  maxLabel : '=',
		  maxSelect : '=',
		  onValueSelection : '=' // should contains a callback where current selected value will be shared 
		},
		controller: 'FormDropdownLogCtrl',
		templateUrl: 'partials/log/dropdown-log.html'
	  };
});

rxgbm.controller('FormDropdownLogCtrl', ['$scope', function($scope){
	$scope.label = $scope.defaultLabel || "set DefaultLabel";
	$scope.maxLabel = $scope.maxLabel || 2;
	$scope.maxSelect  = $scope.maxSelect || $scope.listValues.length;
	$scope.radio = {
		val :{}
	}

	$scope.maxSelectReach = false;
	$scope.message='';

	$scope.changeLabel = function(){
		console.log($scope.listValues);
		var labels = [];
		for(i in $scope.listValues)
			if(typeof $scope.listValues[i].selected !="undefined" && $scope.listValues[i].selected)
				labels.push($scope.listValues[i].name);

		if(labels.length <= $scope.maxLabel && labels.length>0){
			var tmpLabel =""
			for(j in labels)
					tmpLabel += labels[j] + ((j < labels.length-1)? ',' : '')
			$scope.label = tmpLabel;
		}else if(labels.length > 0 && labels.length > $scope.maxLabel){
			$scope.label = $scope.defaultLabel + " (" + labels.length+ ")";
		}else{
			$scope.label = $scope.defaultLabel;
		}
		$scope.isMaxReach(labels.length)
		$scope.onValueSelection();
	}

	$scope.isMaxReach = function(nbSelected){
		if($scope.maxSelect > 1) //only in this case of checkBox
			if(nbSelected == $scope.maxSelect){
				$scope.maxSelectReach = true;
				$scope.message = "Max selection reached";
			}else{
				$scope.maxSelectReach = false;
				$scope.message = '';
			}
	}
	$scope.changeSelection = function(){
		for(i in $scope.listValues)
			if($scope.listValues[i].id != $scope.radio.val.id)
				$scope.listValues[i].selected = false;
			else {
				$scope.listValues[i].selected = true;
			}
		$scope.changeLabel();
	}
	$scope.clearSelection = function(){
		for(i in $scope.listValues)
				$scope.listValues[i].selected = false;
		$scope.changeLabel();
	}
}]);