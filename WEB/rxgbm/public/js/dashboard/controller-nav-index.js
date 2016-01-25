rxgbm.controller('NavIndexCtrl', ['$scope', 'dashboardContext','rxgbmCommon','$location','esClient', '$window',
	function($scope, dashboardContext,rxgbmCommon,$location,esClient,$window){


	 $scope.navs = {
	 	country : {
	 		defaultName : "Country",
	 		actualName : "Country",
	 		active : false,
	 		listValues : rxgbmCommon.countries,
	 		value : {id : 'global'},
	 		display: true
	 	},
	 	customer : {
	 		defaultName : "Customer",
	 		actualName : "Customer",
	 		active : false,
	 		id : null,
	 		display: true
	 	},
	 	order : {
	 		defaultName : "Order",
	 		actualName : "Order",
	 		active : false,
	 		id : null,
	 		display : true
	 	},
	 	product : {
	 		defaultName : "Product",
	 		actualName : "Product",
	 		active : false,
	 		id : null,
	 		display : true
	 	},
	 	date : {
	 		from : dashboardContext.getDateRange().from,
			to : dashboardContext.getDateRange().to,
			format : 'YYYY-MM-DD',
			options : {
				showWeeks: false,
    			startingDay: 1
			},
			open : {
				from : false,
				to : false
			}
	 	}
	 }	
	$scope.openCalendar = function(e, date) {
	    e.preventDefault();
	    e.stopPropagation();
	    $scope.navs.date.open[date] = true;
	};


	 var updateNav = function(){
	 	console.log("updating left navigation")
	 	updateCountry();
	 	updateCustomer();
	 	updateOrder();
	 	updateProduct();
	 	console.log("updating top navigation");
	 	updateDate();
	 	updateBugReport();
	 }

	var updateBugReport = function(){
		$scope.bugReport ="";
		$scope.bugReport +="URL: "+$location.url() + "%0D%0A";
		$scope.bugReport +="Browser :"+$window.navigator.userAgent +"%0D%0A"
		$scope.bugReport +="add your text and a screenshot below %0D%0A -------------------------- %0D%0A"
	}

	$scope.navs.date.select = function(){
	if(angular.isDefined($scope.navs.date.from) && angular.isDefined($scope.navs.date.to)){
		if(moment($scope.navs.date.from).isAfter(moment($scope.navs.date.to)) && !moment($scope.navs.date.from).isEqual(moment($scope.navs.date.to)) )
			window.alert("start date must be <= en date!")
		else{
			dashboardContext.setDate($scope.navs.date.from , $scope.navs.date.to);
			var route = "";
			if($location.url() == "/")
				route +="/"+$scope.navs.country.value.id
			else if ($location.url().search("/from")> 0){
				route = $location.url().substring(0, $location.url().search("/from"));
			}else 
				route = $location.url();
			route +="/from/"+dashboardContext.getDateRange().from.format($scope.navs.date.format)+"/to/"+dashboardContext.getDateRange().to.format($scope.navs.date.format);
			console.log("set location to :", route);
			$location.path(route);
			}
		}
	}

	$scope.setDate = function(){
		if(angular.isDefined($scope.startDate) && angular.isDefined($scope.endDate)){

			if(moment($scope.startDate)> moment($scope.endDate))
				window.alert("Check date order !")
			else
				{dashboardContext.setDate(moment($scope.startDate) , moment($scope.endDate));
				console.log($location.url());
				$location.path($location.url()+"/from/"+$scope.startDate+"/to/"+$scope.endDate);}
			}
	}


	$scope.navs.country.select = function(){
	 	$location.path("/"+$scope.navs.country.value.id);
	 	$scope.active('country');
		$scope.display('country');
	}
	$scope.navs.customer.select = function(){
	 	$location.path("/"+$scope.navs.country.value.id+"/customer/"+$scope.navs.customer.id);
	 	$scope.active('customer');
	 	$scope.display('customer');
	}
	$scope.navs.order.select = function(){
	 	esClient.exists({
			index:dashboardContext.getIndex(),
			type: 'order',
			id:$scope.navs.order.id
		}, 
		function (error, exists) {
			if(error) console.error(error);
			else
				if (exists == true) {
					if($scope.navs.customer.id!=null)
						$location.path("/"+$scope.navs.country.value.id+"/customer/"+$scope.navs.customer.id+"/"+$scope.navs.order.id);
					else
						$location.path("/"+$scope.navs.country.value.id+"/order/"+$scope.navs.order.id);
					$scope.active('order');
	 				$scope.display('order');
				} else {
				    window.alert("Unkown order, please check the order number");
				}
		});
	}
	$scope.navs.product.select = function(){
	 	esClient.count({
			index:dashboardContext.getIndex(),
			type: 'product',
			body:{
				query:{
					match:{
						'productCode':$scope.navs.product.id
					}
				}
			}
		  }, 
		  function (error, response) {
			if (response.count !=0) {
			  		var url = $location.path();
			  		if(url.indexOf('supply')!=-1){
			  			$location.path("/"+$scope.navs.country.value.id+"/supply/product/"+$scope.navs.product.id);

			  		}else if($scope.navs.customer.id !=null){
						$location.path("/"+$scope.navs.country.value.id+"/customer/"+$scope.navs.customer.id+"/product/"+$scope.navs.product.id);

					}
					else{
						$location.path("/"+$scope.navs.country.value.id+"/product/"+$scope.navs.product.id);
					}
	 				$scope.active('product');
	 				$scope.display('product');
			} else {
			    
			    window.alert("Unkown product, please check the product number");
			}
		});

	}

	$scope.edit=function(nav){
		console.log("received click to edit :", nav)
		if(nav!="country")
			if (dashboardContext.getCountry().id == 'global'){
				window.alert("A country must be selected first")
				return;
			}
		$scope.navs[nav].display = false;
	}
	$scope.display = function(nav){
		console.log("End of edition of :", nav)
		$scope.navs[nav].display = true;
	}
	$scope.active = function(nav, value){
		if(angular.isDefined(value))
			$scope.navs[nav].active = value;
		else
			$scope.navs[nav].active = !$scope.navs[nav].active
	}

	var updateCountry = function(){
	 	if (dashboardContext.getCountry().id != 'global'){
	 		$scope.navs.country.actualName = dashboardContext.getCountry().name;
	 		$scope.active('country', true)
	 	}else{
	 		$scope.navs.country.actualName = $scope.navs.country.defaultName;
	 		$scope.active('country', false)
	 	}
	 	$scope.navs.country.value.id = dashboardContext.getCountry().id
	 }

	var updateCustomer = function(){
	 	if (dashboardContext.getCustomer() != null){
	 		$scope.navs.customer.actualName = dashboardContext.getCustomer()
	 		$scope.active('customer', true)
	 	}else{
	 		$scope.navs.customer.actualName = $scope.navs.customer.defaultName;
	 		$scope.active('customer', false)
	 	}
	 	$scope.navs.customer.id = dashboardContext.getCustomer();
	}

	 var updateOrder = function(){
	 	if (dashboardContext.getOrder() != null){
	 		$scope.navs.order.actualName = dashboardContext.getOrder()
	 		$scope.active('order', true)
	 	}else{
	 		$scope.navs.order.actualName = $scope.navs.order.defaultName;
	 		$scope.active('order', false)
	 	}
	 	$scope.navs.order.id = dashboardContext.getOrder();
	 }
	 var updateProduct = function(){
	 	if (dashboardContext.getProduct() != null){
	 		$scope.navs.product.actualName = dashboardContext.getProduct()
	 		$scope.active('product', true)
	 	}else{
	 		$scope.navs.product.actualName = $scope.navs.product.defaultName;
	 		$scope.active('product', false)
	 	}
	 	$scope.navs.product.id = dashboardContext.getProduct();
	 }
	 var updateDate = function(){
	 	$scope.navs.date.from = dashboardContext.getDateRange().from
	 	$scope.navs.date.to = dashboardContext.getDateRange().to
	 }
 
	$scope.$on('context-updated', updateNav);
}]);