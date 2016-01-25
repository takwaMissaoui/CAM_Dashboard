rxgbm.controller('amountOrdersCtrl',['$scope','dashboardContext','esClient',function  ($scope,dashboardContext,esClient) {

	
	var computeOnlineQuery=function(){
		var body={};
		var filter=null;
		filter=dashboardContext.getFilter(['productId','customerId','Events'],'order',['addorder']);
		body={
			     query: {
			                filtered: {"filter":filter}}
			   ,
			   aggs:{
			   	"amout_online":{
			   		"sum":{
			   			field:"Amount.afterTaxes"
			   		}
			   	}
			   },
			   size :0
			}
		return body;
	}
	var computeOfflineQuery=function(){
		var body={};
		var filter=null;
		filter=dashboardContext.getFilter(['productId','customerId','notEvents'],'order',['addorder']);
		body={
			     query: {
			                filtered: {"filter":filter}}
			       
			   ,
			   aggs:{
			   	"amout_offline":{
			   		"sum":{
			   			field:"Amount.afterTaxes"
			   		}
			   	}
			   },
			   size:0
			}
		return body;
	}

	var getOnlineAmount=function(){
		esClient.search({
			index:dashboardContext.getIndex(),
			type:'order',
			body:computeOnlineQuery()
		}).then(function(resp){
			if(angular.isDefined(resp.aggregations.amout_online))
				{	$scope.onlineAmount = resp.aggregations.amout_online.value;
			 		getAmounts();
			 		console.log($scope.onlineAmount);}
		}).catch(function(err){
			console.log(err);
		})

	}

	var getOfflineAmount=function(){
		esClient.search({
			index:dashboardContext.getIndex(),
			type:'order',
			body:computeOfflineQuery()
		}).then(function(resp){
		
			if(angular.isDefined(resp.aggregations.amout_offline))
				{ 	$scope.offlineAmount = resp.aggregations.amout_offline.value;
					getAmounts();
					console.log($scope.offlineAmount);}
		}).catch(function(err){
			console.log(err);
		})

	}

	var getAmounts=function(){

		// change graph color + add totalSales currency 

		$scope.totalSales=$scope.offlineAmount+$scope.onlineAmount;

		$scope.options = {
						chart: {
						    type: 'discreteBarChart',
						    height: 140,
						    margin : {
						        top: 20,
						        right: 20,
						        bottom: 20,
						        left: 55
						    },
						    x: function(d){return d.label;},
						    y: function(d){return d.value;},
						    showValues: true,
						    valueFormat: function(d){
						        return d3.format('d')(d);
						    },
						    transitionDuration: 500,
						    xAxis: {
						        axisLabel: 'Order Type'
						    },
						    yAxis: {
						        axisLabel: 'Amount',
						        axisLabelDistance: 30
						    },
						    color:(['green', 'orange'])

						}
		       };


		$scope.data = [
		    {
		        key: "Cumulative Return",
		        values: [
		            {
		                "label" : "Online" ,
		                "value" : $scope.onlineAmount
		            } ,
		            {
		                "label" : "Offline" ,
		                "value" : $scope.offlineAmount
		            } ]
		    }
		]
		$scope.currency=dashboardContext.getCountry().currency;
	}

	getOfflineAmount();
	getOnlineAmount();

	



}])