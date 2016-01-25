rxgbm.controller('DetailsOrderCtrl', ['$scope','dashboardContext', function($scope, dashboardContext){
			$scope.country = dashboardContext.getCountry().id;
			$scope.$watch('order', function(){
				var productTable  = [];
				for (i in $scope.order.Lines)
					productTable.push($scope.order.Lines[i].code);

				// putting sub-orderLines into line.
				for(i in $scope.order.SubOrders)
					for (j in $scope.order.SubOrders[i].Lines){
						ind = productTable.indexOf($scope.order.SubOrders[i].Lines[j].code);
						var productLine = $scope.order.Lines[ind]
						productLine.SubOrders = productLine.SubOrders || [];
						productLine.SubOrders.push({
							erpNumber : $scope.order.SubOrders[i].erpNumber,
							status : $scope.order.SubOrders[i].Lines[j].status,
							preferredDeliveryDate : $scope.order.SubOrders[i].Lines[j].preferredDeliveryDate,
							quantity : $scope.order.SubOrders[i].Lines[j].quantity
						})

						$scope.order.Lines[ind] = productLine;
					}

				console.log("DetailsOrderCtrl->order->", $scope.order);	
			})
}]);
