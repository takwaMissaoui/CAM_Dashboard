
rxgbm.controller('StackedChartProductOrdersCtrl', ['$scope', 'esClient', 'dashboardContext', function($scope, esClient, dashboardContext){

	$scope.options1 = {
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
		var results = resp.aggregations.orders_over_time.buckets;
		
		this.offline = 0, this.online = 1;
		this.tmpdata = [
			{key : "Offline", values : []},
			{key : "Online", values : []}
		]
		angular.forEach(results, function(obj, key){
				var off =0, on = 0;
				for (i in obj.evt_type.buckets){
					if(obj.evt_type.buckets[i].key == "addorder"){
						on = obj.evt_type.buckets[i].doc_count;
						break;
					}
				}

				off = obj.doc_count - on;
				this.tmpdata[this.offline].values.push({"date" : obj.key_as_string, "count" : off})
				this.tmpdata[this.online].values.push({"date" : obj.key_as_string, "count" : on})
		}, this)//angular.foreach


		$scope.data1 = this.tmpdata;

		console.log($scope.data);
	};

	var computeQuery = function(){
	
		var body = {
			query : {
				filtered : {
					"filter" : dashboardContext.getFilter(['customerId', 'productId'], 'order')
				}
			},
			"aggs" : {
        		"orders_over_time" : {
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
	    			aggs :{
	        			"evt_type" : {
	        				terms : {"field" : "Events.type", size:40}
	        			}//evt_type
	        		}//aggs
    			}//orders_over_time
        	}//"aggs"
		}//body
		return body;
	}

		esClient.search({
			index : dashboardContext.getIndex(),
			type : 'order',
			size : 1,
			body : computeQuery()
		}).then(function (resp) {
				computeResponse(resp);
			}).catch(function (err) {
				console.log('ERROR:', err);
		});

}]);