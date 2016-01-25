
rxgbm.controller('rxgbmDetailsProductCtrl', ['$scope','$sce','$element', 'dashboardContext', function($scope, $sce, $element, dashboardContext){
	$scope.display = $scope.display || false;

	var urls = {
		nl : {
			baseUrl : "https://m.rexel.nl",
			productUrl : "/product/",
		}, 
		se : {
			baseUrl : "https://m.storel.se",
			productUrl : "/product/",
		},
		de : {
				baseUrl : "https://hagemeyershop.de",
				productUrl: "/p/"
		}

	}

	$scope.webshop = urls[dashboardContext.getCountry().id];
	$scope.product = {
		code : $scope.productCode,
		weblink : $sce.trustAsResourceUrl($scope.webshop.baseUrl + $scope.webshop.productUrl + dashboardContext.getProduct())
	}
}]);

rxgbm.directive('rxgbmDetailsProduct', function() {
  return {
	controller: 'rxgbmDetailsProductCtrl',
	templateUrl: 'partials/product/details-product.html',
  };
});