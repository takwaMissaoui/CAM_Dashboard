
rxgbm.controller('StackedChartProductScoreCtrl', ['$scope', 'esClient', 'dashboardContext', function($scope, esClient, dashboardContext){

	$scope.options2= {
		chart : {
			type : 'stackedAreaChart',
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
                    axisLabel: 'Last month orders',
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


	var computeResponse = function(resp){
		var results = resp.aggregations.product_over_time.buckets;
		
		this.search = 0, this.direct = 1, this.price = 2, this.stock = 3;
		this.tmpdata = [
			{key : "Search page", values : []},
			{key : "Product page", values : []},
			{key : "Cart page", values : []},
			{key : "Stock query", values : []}
		]
		angular.forEach(results, function(obj, key){
				this.tmpdata[this.direct].values.push({"date" : obj.key_as_string, "count" : obj.direct.value})
				this.tmpdata[this.search].values.push({"date" : obj.key_as_string, "count" : obj.search.value})
				this.tmpdata[this.price].values.push({"date" : obj.key_as_string, "count" : obj.price.value})
				this.tmpdata[this.stock].values.push({"date" : obj.key_as_string, "count" : obj.stock.value})
		}, this)//angular.foreach


		$scope.data2 = this.tmpdata;

	};

	var computeQuery = function(){
		var body = {
			query :{
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

		                "search" : { "sum" : { "field" : "browsed.search" } },
		                "price" : { "sum" : { "field" : "browsed.price" } },
		                "direct" : { "sum" : { "field" : "browsed.direct" } },
		                "stock" : { "sum" : { "field" : "browsed.stock" } }
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
		body : computeQuery()
	}).then(function (resp) {
			computeResponse(resp)
			//$scope.draw();
		}).catch(function (err) {
			console.log('ERROR:', err);
	});
}]);