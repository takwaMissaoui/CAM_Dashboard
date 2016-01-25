rxgbm.directive('rxgbmTreeMapLog', function(){
	 return {
		restrict: 'A',
		scope: {
			from :'=',
			to : '='
		},
		templateUrl:'partials/log/tree-map.html',
		controller: 'TreeMapLogCtrl',
		transclude : true,
		link : function(scope, element, attrs){

			var directive ={
					width : element[0].offsetWidth,
					height : element[0].offsetHeight
			}
			var svg = element.children();
				svg.attr("width", directive.width);
				svg.attr("height", directive.height);
		}
	  };
});


rxgbm.controller('TreeMapLogCtrl', ['$scope',  function($scope){
	console.log($scope);
	var width = 1024, height = 700;

	var testdata = {
		name: "monitoring",
		children : [
			{
			name :"webshop-nln",
			children : [
				{name : "addOrder", value : '12'},
				{name : "getCustomerPrice",	value : '150'}
			]},
			{
			name :"webshop-sto",
			children : [
				{name : "addOrder",value : '69'},
				{name : "getCustomerPrice",	value : '17'}
			]},
			{
			name :"webshop-sel",
			children : [
				{name : "addOrder",	value : '21'},
				{name : "getCustomerPrice",	value : '450'}
			]}
		]
	}
/*
	var treemap = d3.layout.treemap();
	treemap.size([960, 500]);

	var color =  d3.scale.category10();

	function buildTreeMap(root){
		  $scope.nodes = treemap.nodes(root);
		  console.log($scope.nodes);
		  //setting node color
		  for (a in $scope.nodes){
		  	$scope.nodes[a].style = {};
		  	$scope.nodes[a].style.fill = ($scope.nodes[a].children ? null : color($scope.nodes[a].parent.name))
		  }
	}//buildTreeMap

	buildTreeMap(testdata);*/

	var color =  d3.scale.category20c();

	var sunburst = d3.layout.partition(), radius = Math.min(width, height) / 2 - 10;
	sunburst.size([2 * Math.PI, radius * radius]);


	//calcul the translation to the center
	$scope.transform = {
		width : width / 2,
		height : height / 2
	}

	function buildSunBurst(root){
		$scope.nodes = sunburst.nodes(root);
		console.log($scope.nodes);
		for (a in $scope.nodes){
			$scope.nodes[a].path = d3.svg.arc()
    			.startAngle($scope.nodes[a].x)
    			.endAngle($scope.nodes[a].x + $scope.nodes[a].dx)
    			.innerRadius(Math.sqrt($scope.nodes[a].y))
    			.outerRadius(Math.sqrt($scope.nodes[a].y + $scope.nodes[a].dy))();
    		$scope.nodes[a].style = {};
		  	$scope.nodes[a].style.fill = ($scope.nodes[a].children ? null : color($scope.nodes[a].parent.name))
		  	$scope.nodes[a].style.display = ($scope.nodes[a].depth ? null : "none")
			$scope.nodes[a].history = {
				x : $scope.nodes[a].x,
				y : $scope.nodes[a].y,
				dx : $scope.nodes[a].dx,
				dy : $scope.nodes[a].dy
			}//history
		}

	}
	buildSunBurst(testdata);
}]);