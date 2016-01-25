
rxgbm.controller('StackedLineProductPriceCtrl', ['$scope', 'esClient', 'dashboardContext', function($scope, esClient, dashboardContext){

	$scope.options = {
		chart : {
			type : 'lineChart',
			height: 150,
                padding : {
                    top: 20,
                    right: 20,
                    bottom: 60,
                    left: 40
                },
            x: function(d){return moment(d.date, "YYYY-MM-DD").toDate()},
            y: function(d){return d.count || 0;},
            useVoronoi: false,
            clipEdge: true,
            transitionDuration: 500,
            useInteractiveGuideline: true,
            xAxis: {
                    showMaxMin: false,
                    axisLabel: 'Last month price',
                    tickFormat: function(d) {

                        return d3.time.format('%d-%m')(moment(d).toDate());
                    }
            },
             yAxis: {
                    tickFormat: function(d){
                        return "#" + d3.format(',2f')(d);
                    }
            }
		}
	}



	$scope.computeResponse = function(resp){
		var results = resp.aggregations.product_over_time.buckets;
		
		this.min = 0, this.max = 1, this.avg = 2; this.customer = 3;
		this.tmpdata = [
			{key : "Min", values : []},
			{key : "Max", values : []},
			{key : "Avg", values : []}
		]
		angular.forEach(results, function(obj, key){
				this.tmpdata[this.min].values.push({"date" : obj.key_as_string, "count" : obj.min_price.value})
				this.tmpdata[this.max].values.push({"date" : obj.key_as_string, "count" : obj.max_price.value})
				this.tmpdata[this.avg].values.push({"date" : obj.key_as_string, "count" : obj.avg_price.value})
		}, this)//angular.foreach

		if(dashboardContext.getCustomer()!=null)
			$scope.data =  [{key : "Customer Price", values : this.tmpdata[this.avg].values}]
		else
			$scope.data = this.tmpdata;


		console.log($scope.data);
	};

	$scope.computeQuery = function(){
	
		var body = {
			query: {
			    filtered : {
					"filter" : dashboardContext.getFilter(['customerId','productId'], 'product')
				}
			},
			"aggs" : {
		        "product_over_time" : {
		            "date_histogram" : {
	                	"field" : "date",
	                	"interval" : "day",
	               		"format" : "yyyy-MM-dd",
	               		"extended_bounds" : {
           					"min" : dashboardContext.getDateRange().from.format("YYYY-MM-DD"),
            				"max" : dashboardContext.getDateRange().to.format("YYYY-MM-DD")
        				},
                		"min_doc_count" : 0
           		 	},//date_histogram				
		            "aggs" : {

		                "avg_price" : { "avg" : { "field" : "price" } },
		                "max_price" : { "max" : { "field" : "price" } },
		                "min_price" : { "min" : { "field" : "price" } },
		            }
		        }
		    }
		}//body
		return body;
	}

	esClient.search({
		index : dashboardContext.getIndex(),
		type : 'product',
		size : 1,
		body : $scope.computeQuery()
	}).then(function (resp) {
			$scope.computeResponse(resp)
			//$scope.draw();
		}).catch(function (err) {
			console.log('ERROR:', err);
	});
}]);