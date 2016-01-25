/**
*
* GET EVENTS FROM ORDER
**/
rxgbm.controller('ListEvents', ['$scope','esClient', function($scope, esClient){

}]);

rxgbm.directive('rxgbmListEvents', function() {
  return {
	restrict: 'A',
	scope: {
	  events: '=rxgbmListEvents',	
	},
	controller: 'ListEvents',
	templateUrl: 'partials/event/list-events.html'
  };
});