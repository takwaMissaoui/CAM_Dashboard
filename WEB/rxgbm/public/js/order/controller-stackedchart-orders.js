
rxgbm.controller('StackedChartOrdersCtrl', ['$scope', 'esClient', '$filter', 'dashboardContext', function($scope, esClient, $filter, dashboardContext){
	$scope.searchBy = "status_by_date"


	$scope.options = {
		chart : {
			type : 'stackedAreaChart',
			height: 300,
                padding : {
                    top: 20,
                    right: 0,
                    bottom: 60,
                    left: 0
                },
            x: function(d){return moment(d.date, "YYYY-MM-DD").toDate()},
            y: function(d){return d.count || 0;},
            useVoronoi: false,
            clipEdge: true,
            transitionDuration: 500,
            useInteractiveGuideline: true,
            xAxis: {
                    showMaxMin: false,
                    tickFormat: function(d) {

                        return d3.time.format('%d-%m')(moment(d).toDate());
                    }
            },
             yAxis: {
                    tickFormat: function(d){
                        return "#" + d3.format(',f')(d);
                    }
            }
		}
	}



	$scope.computeResponse = function(resp){
		var agg = resp.aggregations;
		var results = agg.term_search.buckets;
		this.tmpdata = [];
		console.log(results);

		angular.forEach(results, function(obj, key){
				var serie =  {
					key : $filter('orderStatusToName')(obj.key),
					values : []
				}
				for (i in obj.orders_over_time.buckets)
					serie.values.push({
						'date' : obj.orders_over_time.buckets[i].key_as_string,
						'count' : obj.orders_over_time.buckets[i].doc_count
						})

				this.tmpdata.push(serie);
		}, this)//angular.foreach


		$scope.data = this.tmpdata;

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
            		"term_search" : {
            			terms : {
            				"field" : "status",
            				"size" : "40"
            			}
		        	, aggs : { 
		        		"orders_over_time" : {
		            		date_histogram : {
		                		"field" : "date",
		                		"interval" : "day",
		                		"format" : "yyyy-MM-dd",
		                		"extended_bounds" : {
                   					"min" : dashboardContext.getDateRange().from.format("YYYY-MM-DD"),
                    				"max" : dashboardContext.getDateRange().to.format("YYYY-MM-DD")
                				},
		                		"min_doc_count" : 0 
		            		}//date_histogram
				    	}//orders_over_time
		        	}//aggs
		        	}//status_by_date
		}//body.aggs

		return body;
	}



	esClient.search({
		index : dashboardContext.getIndex(),
		type : 'order',
		size : 1,
		body : $scope.computeQuery()
	}).then(function (resp) {
			$scope.computeResponse(resp)
			//$scope.draw();
		}).catch(function (err) {
			console.error('ERROR:', err);
	});

}]);
