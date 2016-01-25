
rxgbm.controller('rxgbmLineChartOrders', ['$scope', 'esClient', '$filter', 'dashboardContext', function($scope, esClient, $filter, dashboardContext){

	$scope.avg_line_per_order = 0;
	var getInterval = function(){
		var diff = dashboardContext.getDateRange().to.diff(dashboardContext.getDateRange().from, 'days');
		if(diff <= 2)
			return "hour"
		if(diff <= 7)
			return "6h"
		if(diff <= 15)
			return "12h"
		if(diff <= 30)
			return "1d"
		if(diff <= 60)
			return "2d"
		return "1M";

	}
	var getDateFormat = function(){
			var interToDate = {
				"hour" : {es: "yyyy-MM-dd HH", chart : "%d-%m %H h", moment : "YYYY-MM-DD HH", word : "Hour"},
				"6h" :  {es: "yyyy-MM-dd HH", chart : "%d-%m %H h", moment : "YYYY-MM-DD HH" , word : "6 Hours"},
				"12h" : {es: "yyyy-MM-dd HH", chart : "%d-%m %H h", moment : "YYYY-MM-DD HH" , word : "1/2 day"},
				"1d" :  {es: "yyyy-MM-dd", chart : "%d-%m", moment : "YYYY-MM-DD", word : "day"},
				"2d" :  {es: "yyyy-MM-dd", chart : "%d-%m", moment : "YYYY-MM-DD", word : "2 days"},
				"1M" :  {es: "yyyy-MM", chart : "%Y-%m", moment : "YYYY-MM" , word : "Month"},
			}

			var inter = getInterval();
			
			return interToDate[inter];
	}

	$scope.options = {
		chart : {
			type : 'lineChart',
			height: 300,
                padding : {
                    top: 20,
                    right: 0,
                    bottom: 60,
                    left: 0
                },
            x: function(d){ return moment(d.date).toDate()},
            y: function(d){ return d.count || 0;},
            transitionDuration: 500,
            clipEdge : true,
            useInteractiveGuideline: true,
            xAxis: {
            		showMaxMin: true,
            		axisLabel : 'Per ' + getDateFormat().word,
            		rotateLabels : -20,
                    tickFormat: function(d) {
                        return d3.time.format(getDateFormat().chart)(moment(d).toDate());
                    }
            },
            yAxis: {
                    tickFormat: function(d){
                        return d3.format(',.1f')(d);
                    }
            }
		}
	}


	$scope.computeResponse = function(resp){
		var aggs = resp.aggregations;


		var orderlineValues = [];
		for (i in aggs.orderlines_over_time.buckets)
			orderlineValues.push({
						'date' : aggs.orderlines_over_time.buckets[i].key,
						'count' : aggs.orderlines_over_time.buckets[i].lines.value || 0
		})
		var orderValues = [];
		for (i in aggs.orders_over_time.buckets)
			orderValues.push({
						'date' : aggs.orders_over_time.buckets[i].key,
						'count' : aggs.orders_over_time.buckets[i].doc_count  || 0
		})
		
		var avg_line_per_date =[];
		var i=0;
		var sumOflines = 0;
		for(i; i < orderValues.length; i++){
			count = 0;
			if(orderValues[i].count > 0)
				count = orderlineValues[i].count/orderValues[i].count

			avg_line_per_date.push({
					'date' : orderlineValues[i].date,
					'count' : count
			})
			sumOflines+=count;
		}
		$scope.avg_line_per_order = sumOflines / i;

		$scope.data = [
			{

				key : "Order lines",
				values : orderlineValues
			},
			{

				key : "Orders",
				values : orderValues
			},
			{

				key : "Avg line / order",
			 	values : avg_line_per_date
			}
		];



		console.log($scope.data);
	};



	$scope.computeQuery = function(){
		var body = {
			query : {
				filtered : {
				"filter" : dashboardContext.getFilter(["customerId"]),
			}}

		};

		body.aggs = {
        		"orders_over_time" : {
            		date_histogram : {
                		"field" : "date",
                		"interval" : getInterval(),
                		"format" : getDateFormat().es,
                		"extended_bounds" : {
           					"min" : dashboardContext.getDateRange().from.format(getDateFormat().moment),
            				"max" : dashboardContext.getDateRange().to.format(getDateFormat().moment)
        				},
                		"min_doc_count" : 0 
            		}//date_histogram
		    	},//orders_over_time
	        		
			    "orderlines_over_time" : {
            		date_histogram : {
                		"field" : "date",
                		"interval" : getInterval(),
                		"format" : getDateFormat().es,
                		"extended_bounds" : {
           					"min" : dashboardContext.getDateRange().from.format(getDateFormat().moment),
            				"max" : dashboardContext.getDateRange().to.format(getDateFormat().moment)
        				},
                		"min_doc_count" : 0, 
                	},//date_histogram
                		aggs : {
                			"lines" :{
                				"scripted_metric": {
                					"init_script" : "_agg['lines'] = []",
                					"map_script" : "_agg.lines.add(doc['Lines.code'].values.size())",
                					"combine_script" : "lines = 0; for (t in _agg.lines) { lines += t }; return lines",
                					"reduce_script" : "lines = 0; for (t in _aggs) { lines += t }; return lines"
                				}//scripted_metric
                			}//lines
                		}//aggs

		    	}//orderlines_over_time
		}//body.aggs

		return body;
	}

	esClient.search({
		index : dashboardContext.getIndex(),
		type : 'order',
		size : 1,
		body : $scope.computeQuery()
	}).then(function (resp) {
			$scope.computeResponse(resp);
			//$scope.draw();
		}).catch(function (err) {
			console.error('ERROR:', err);
	});

}]);