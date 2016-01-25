rxgbm.controller('statsOrderCtrl',['$scope','esClient','rxgbmCommon','dashboardContext',function($scope,esClient,rxgbmCommon,dashboardContext){
  $scope.perDeliverFromOnlines =0 ;
  $scope.perCollectFromOnlines=0 ;
  $scope.pourcentageOnlines=0 ;
  $scope.pourcentageOfflines=0 ;


	calculatePercentage=function(value,total){ 
	if(value!=null && angular.isDefined(value)){

	  if(total!=null && angular.isDefined(total)){

	    return (value/total)*100;
	  }
	}

	}


	var computeQuery=function(values,content){
		var body={};
		var filter=null;
		if (dashboardContext.getCustomer() != null){

			filter=dashboardContext.getFilter(['customerId',values],'order',content);
		}
		else{
			filter=dashboardContext.getFilter(values,'order',content);
		}

		body={
			query: {
			    filtered : {
					"filter" : filter
				}
			}};

				return body;
	}

	$scope.getTotalOrder = function(){

		esClient.count({
			index : dashboardContext.getIndex(),
			type : 'order',
			body:computeQuery()}
		,function(error ,response){
			if(angular.isDefined(error))
				console.trace(error);
			else {
				setTotal( response.count);
				calculOffline();
			}
		}

		)

	}//getTotalOder

	//***********

	$scope.getDeliverStat = function(){


	  esClient.count({
	    index:dashboardContext.getIndex(),
	    type:'order',
	    body:computeQuery('Delivery','deliver')
	  },function(error , response){
	  		if(angular.isDefined(error)){
		    	console.trace(error);}
		    else{
			   	setDeliver(response.count);
			}
	  })
	}
	//********************




	$scope.getCollectStat = function(){
				
		esClient.count({
		  index:dashboardContext.getIndex(),
		  type:'order',
		  body:computeQuery('Delivery','collect')
		},function(error , response){

			if(angular.isDefined(error))
			  console.trace(error);
			  else
			  	setCollect(response.count);
		})
	}
//******************

$scope.getOnlineStat = function(){
	  esClient.count({
		  index:dashboardContext.getIndex(),
	      type: 'order',
	      body: computeQuery('Events',['addorder'])
	     },
	 	 function (error,response) {
			if(angular.isDefined(error))
	      		console.trace(error);
	       else
			    {setOnlines(response.count);
			    calculOffline();}				      
						
	  });
  }//getOnlineStat

  var setOnlines = function(number){
  	$scope.onlines = number;
  	calculAllPct();

  }

  var setTotal= function(number){
  	$scope.total = number;
  	calculAllPct();

  }
  var setDeliver = function(number){
  	$scope.deliver = number;
  	calculAllPct();
  }
  var setCollect = function(number){
  	$scope.collect = number;
  	calculAllPct();
  }
  var calculOffline = function(){
  	if($scope.total != null && $scope.onlines != null)
  		$scope.offlines = $scope.total - $scope.onlines;
  	
  }  
  var calculAllPct = function(){
  	calculOffline();
  	$scope.pourcentageOnlines= calculatePercentage($scope.onlines,$scope.total);
  	$scope.pourcentageOfflines=100-$scope.pourcentageOnlines;
	$scope.perCollectFromOnlines=calculatePercentage($scope.collect,$scope.onlines);
	$scope.perDeliverFromOnlines=calculatePercentage($scope.deliver,$scope.onlines);
	$scope.pourcentageDeliver=calculatePercentage($scope.deliver,$scope.total);
	$scope.pourcentageCollect=calculatePercentage($scope.collect,$scope.total);
	
  }



   	$scope.refresh = function(){
	  $scope.getTotalOrder();
	  $scope.getDeliverStat();
	  $scope.getCollectStat();
	  $scope.getOnlineStat();
	  

	}
    


    $scope.refresh();
  

  
  
  //controller end 


}])