
rxgbm.controller('LogPageContextCtrl', ['$scope', '$routeParams', function($scope, $routeParams){

	$scope.context = {
		country : $routeParams.country.toLowerCase(),
	}

	if(typeof $routeParams.application != 'undefined')
		$scope.context.application = $routeParams.application.toLowerCase()
	if(typeof $routeParams.transaction != 'undefined')
		$scope.context.transaction = $routeParams.transaction.toLowerCase()

	$scope.$watch('context', function(newValue, oldValue){
				//TODO --> CHANGE THE URL WITHOUT TRIGGERING
	});

}]);


rxgbm.service('log', ['esClient', function(esClient){


	this.buildBodyTerms = function(attName, size){
		var size = size || 20;


		var body = { 
			aggs : {
				top_terms: {
					terms: {
						field: attName,
						order : { "_term" : "asc" },
						size: 30
					}//terms
				}//top_terms
			}//aggs
		}
		return body;
	}

	this.getFieldsTerms = function(field, params, cb){
		console.log("getting " +field+" for country ", params.country);
		this.getTerms(params.country, this.addFilterToBody(params, this.buildBodyTerms(field)), cb);

	}
	this.addFilterToBody = function(params, body){
		var filter = this.buildFilterBasedOnParams(params);
		if(filter != null)
			body.filter = filter;
		return body;
	}

	this.buildFilterBasedOnParams = function(params){
		console.log("PARAMS", params);
		var filters = [];


		var paramsToOr = function(name, params){
			var searchCritiria ={};
			searchCritiria[name] = params;
			if(Array.isArray(params))
				return {terms : searchCritiria}
			else
				return {term : searchCritiria}
				
		}

		if(typeof params.application != 'undefined' && params.application !='')
			filters.push({
				term : { "Service.category" : params.application }
			})
		if(typeof params.transaction != 'undefined' && params.transaction !='')
			filters.push({
				term : { "Service.name" : params.transaction }
			})
		if(typeof params.status != 'undefined' && params.status !='')
			filters.push({
				term : { "Service.status" : params.status }
			})
		if(typeof params.error_category != 'undefined' && params.error_category !='')
			filters.push({
				term : { "Service.Error.category" : params.error_category }
			})
		if(typeof params.error_level != 'undefined' && params.error_level !='')
			filters.push({
				term : { "Service.Error.criticity" : params.error_level }
			})

		if(filters.length == 1)
			return filters[0];
		else if (filters.length == 0)
			return null;
		else
			return {"and" : filters};
	}

	this.getTerms =  function(country, bodyFilter, cb){
		esClient.search({
			index : country,
			type : 'log',
			body : bodyFilter
		}).then(function (resp) {
				console.log(resp);
				var vals = resp.aggregations.top_terms.buckets;
				var resp = [];
				for (a in vals)
					resp.push({
						name : vals[a].key,
						value : vals[a].doc_count
					})

				cb(resp);

			}).catch(function (err) {
				console.log(err);
				cb();
		});
	}

	this.listLogs = function(params, cb){

		console.log("log->listLogs->", params)
		var body = {};
		var filter = this.buildFilterBasedOnParams(params);
		if(filter != null)
			body.filter =  filter;
		body.sort = {"startTs" : { order : "desc" }}


		var page = {
			num : params.pageNum || 1,
			size : params.pageSize || 100
		}

		esClient.search({
				index : params.country,
				type : 'log',
				from: (page.num - 1) * page.size,
				size : page.size,
				body : body
			}).then(function (resp) {
				for(a in resp.hits.hits)
					resp.hits.hits[a] = resp.hits.hits[a]._source
				cb(resp.hits);
			}).catch(function (err) {
				console.log(err);
				cb();
		});

	}

}]);

