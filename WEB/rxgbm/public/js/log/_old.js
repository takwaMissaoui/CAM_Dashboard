/*
log.service('datas',['$rootScope', '$http', function($rootScope, $http){
		var flowList = [];
		var searchValues = {};
		var currentFlowId = '';
		var nextFlowLoading = false;
		var tab  = 'attribute' // can be also error or payload
		var getFlow = function(flowId){
				var i=0;
				while (i<flowList.length && flowList[i].id != flowId) i+=1;
				if( i !=  (flowList.length))
					return flowList[i];
				else
					return null;
		}
		var genericSet = function(flowId, attribute, data){
			var fl = getFlow(flowId);
			fl[attribute] = fl[attribute] || [];
			if (!angular.isArray(data)) data = [data];
			 angular.forEach(data, function(value, key){
			   if(!angular.isUndefined(value)){
					var z = 0;
					while(z < fl[attribute].length) {
						if(!angular.isUndefined(fl[attribute][z])){ 
							if(fl[attribute][z].id == value.id){
								fl[attribute][z] = value;
								break; // same id exist
							}	
						}else break;
						z+=1;
					}//while
					if(z == fl[attribute].length) // didn't find the value in the table end of loop reach.
						fl[attribute].push(value);
				}//if
			 });
		}

		
		return {
			addFlow : function(data){
				if (angular.isArray(data)){
					 //add each element to the table
					 angular.forEach(data, function(value, key){
					   flowList.push(value);
					 }, this);
				}else{
					flowList.push(data);
				}
			},
			getFlows : function(){
				return flowList;
			},
			getFlow : getFlow,
			getCurrentFlow : function(){
				console.log("getCurrentFlow:" + this.currentFlowId);
				return this.getFlow(this.currentFlowId);
			},
			setCurrentFlowId : function(id){
				console.log("setCurrentFlowId to :" + id);
				this.currentFlowId = id;
				$rootScope.$broadcast('flowSelected');
			},
			setSearchValues : function(values){
				console.log("setSearchValue");
				this.searchValues = values;
				$rootScope.$broadcast('searchValuesChange', values);
			},
			setActiveTab : function(tab){
				console.log("setActiveTab to :" + tab);
				this.tab = tab;
			},
			getActiveTab : function(){
				return this.tab;
			},
			/**
			* Here you should do a HTTP Request to get all flows

			loadFlows : function(){
				console.log("loadFlows");
				var self = this;
				flowList = [];
				nextFlowLoading = true; //avoid to get the next flow before first loading.
				$http({url:'/search', method:'POST', params:this.searchValues}).success(function(content,status){
					self.addFlow($.xml2json(content).flow);
					nextFlowLoading = false;
					$rootScope.$broadcast('flowsLoaded');
				});
				
			},
			/**
			* Here you should do a HTTP Request to get all Errors lines
		
			loadErrors : function(flowId){
				console.log("loadErrors");
				//add in the description service name, operation name, 
				$http.get('/flow/'+flowId+'/errors').success(function(content,status){
					genericSet(flowId, 'errors', $.xml2json(content).error);
				});		
			},
			/**
			* Here you should do a HTTP Request to get all attributes lines
		
			loadAttributes : function(flowId){
				console.log("loadAttributes");
				$http.get('/flow/'+flowId+'/attributes').success(function(content,status){
					console.log($.xml2json(content));
					genericSet(flowId, 'attributes', $.xml2json(content).attribute);
				});									
			},
			/**
			* Here you should do a HTTP Request to get all operations lines
			
			loadOperations : function(flowId, serviceId){
				console.log("loadOperations");
				var fl = getFlow(flowId);
				$http.get('/flow/'+flowId+'/service/'+serviceId+'/operations',{"toto":"toto"}).success(function(content,status){
					var i = 0;
					while (i<fl.services.length && fl.services[i].id != serviceId) i+=1;
					fl.services[i].operations = (angular.isArray($.xml2json(content).operation) ? $.xml2json(content).operation :  [$.xml2json(content).operation]);			
				});
			},
			/**
			* Here you should do a HTTP Request to get all services lines
			
			loadServices : function(flowId){
				console.log("loadServices");
				$http.get('/flow/'+flowId+'/services').success(function(content,status){
					genericSet(flowId, 'services', $.xml2json(content).service);
				});
			},
			/**
			* Here you should do a HTTP Request to get all services lines
		
			loadPayloads : function(flowId){
				console.log("loadServices");		
				$http.get('/flow/'+flowId+'/payloads').success(function(content,status){
					/*var obj = $.xml2json(content);
					for( i in obj.payload)
						obj.payload[i].payload = decodeHTMLEntities(obj.payload[i].payload)
					genericSet(flowId, 'payloads', $.xml2json(content).payload);
				});
			},
			/**
			* Here you should do a HTTP Request to load next results

			loadNextFlows : function(){
				console.log('loadNextFlows');
				if(!nextFlowLoading){
					var self = this;
					nextFlowLoading = true;
					var values = angular.copy(this.searchValues);
					var lastdate = flowList[flowList.length - 1].start_datetime;
					values.start_date = lastdate;
					$http({url:'/search', method:'POST', params:values}).success(function(content,status){
						self.addFlow($.xml2json(content).flow);
						$rootScope.$broadcast('flowsLoaded');
						nextFlowLoading = false;
					});
				}
			}
		}//return
	}]);
	mon.controller('FlowListCtrl', function($scope, datas){
		$scope.flows = {}
		$scope.$on('flowsLoaded',function(evt, values){
			console.log("FlowListCtrl on loadFlows");
			$scope.flows = datas.getFlows();
		});
		$scope.openPanel = function(flowId, tab){datas.setActiveTab(tab); datas.setCurrentFlowId(flowId); /*keep the call order};
		$scope.loadServices = datas.loadServices;
		$scope.loadOperations = datas.loadOperations;
		var xHasY = function(Y){
			if(angular.isUndefined(Y))
				return false;
			else
				if(angular.isArray(Y))
					return Y.length > 0;
				else
					return false;
		}
		$scope.flowHasServices = function (flow){return xHasY(flow.services);};
		$scope.serviceHasOperations = function(service){return xHasY(service.operations);}
		$scope.loadNextFlows = function(){datas.loadNextFlows()};
	});
	/**
	*Use to provide the good css to a status

	mon.filter("StatusToCSS", function(){
		return function(status, error_criticity){
			var value = "N/A";
			//TODO -> Map all status correctly
			if(status == "30") value='<span class="label label-success">&nbsp;Terminated&nbsp;</span>';
			else if(status == "20") value='<span class="label label-info">In progress</span>';
			else if(status == "10") value='<span class="label label-default">&nbsp;&nbsp;Started&nbsp;&nbsp;</span>';
			else if(status == "40") value='<span class="label label-danger">In progress with error</span>';
			else if(!angular.isUndefined(error_criticity)){
					switch(error_criticity){
						case "1" : value='<span class="label label-danger">&nbsp;&nbsp;&nbsp;CRITICAL&nbsp;&nbsp;&nbsp;</span>';break;
						case "2" : value='<span class="label label-warning">&nbsp;&nbsp;&nbsp;MAJOR&nbsp;&nbsp;&nbsp;</span>';break;
						case "3" : value='<span class="label label-warning">&nbsp;&nbsp;&nbsp;MINOR&nbsp;&nbsp;&nbsp;</span>';break;
						default : value='<span class="label label-default">No error level</span>'
					}
			}
			
			return value;
		}
	});
	/**
	*Use to provide the duration in format hh:mm:ss.sss

	mon.filter("msToTime", function(){
		return function(duration){
			var value = "";
			var mil = 0;
			var sec = 0; //1000ms
			var min = 0; //60 000 ms
			var hou = 0; //360 000 ms
			var rest = 0;
			
			if(duration >= 360000){
				hou =  Math.floor(duration/360000); duration = duration%360000;
			}
			if(duration >= 60000){
				min =  Math.floor(duration/60000); duration = duration%60000;
			}
			if(duration >= 1000){
				sec =  Math.floor(duration/1000); duration = duration%1000;
			}
			mil = duration;
			return new String("00" + hou).slice(-2) + ':' + new String("00" + min).slice(-2)  + ':' + new String("00" + sec).slice(-2)  +'.' + new String("000" + mil).slice(-3) ;
		}
	});
	
	/**
	*Use to get the detail about a services

	mon.controller('FlowDetailCtrl',['$scope', '$http', 'datas', function($scope, $http, datas){
		$scope.flow={};
		$scope.previousFlowId = '';
		$scope.previousTabs = '';
		$scope.$on('flowSelected', function(){
			$scope.flow = datas.getCurrentFlow();
			$scope.tab = datas.getActiveTab();
			console.log("FlowDetailCtrl will give following details :" + $scope.tab);
			switch($scope.tab){
				case 'error' : datas.loadErrors($scope.flow.id); break;
				case 'attribute' : datas.loadAttributes($scope.flow.id); break;
				case 'payload' : datas.loadPayloads($scope.flow.id);break;
				default : console.warn("FlowDetailCtrl something wrong append for selecting tab :" + $scope.tab);
			}
			if($scope.flow.id != $scope.previousFlowId || $scope.tab != $scope.previousTabs){
				detail_panel.open();
				$scope.previousFlowId = $scope.flow.id;
			}else{
				if($scope.tab == $scope.previousTabs)
					detail_panel.activate();
			}
			$scope.previousTabs = $scope.tab;
		});
		$scope.openPanel = function(tab){datas.setActiveTab(tab); datas.setCurrentFlowId($scope.flow.id);/*keep the call order};
		$scope.isActiveTab = function(tab){return ($scope.tab == tab ? 'active' : '')};
		$scope.flowHasErrors = function(){
			if(angular.isUndefined($scope.flow.errors))
				return false;
			else
				if(angular.isArray($scope.flow.errors))
					return $scope.flow.errors.length > 0;
				else
					return false;
		};
	}])
	mon.directive('custoPrism', function(){
		return {
			restrict : 'AEC',
			link : function(scope, element, attrs){
				try{
					element.html(Prism.highlight(scope.payload.payload.replace(new RegExp('<', 'g'), '&lt;'), Prism.languages.markup));
				}catch(e){
					element.html(scope.payload.payload.replace(new RegExp('<', 'g'), '&lt;'));// For freaking IE
				}
			}
		}
	});
	/**
	* Called when the button search is pushed

	mon.controller('SearchFormCrtl', ['$scope','datas', '$location','$http', function($scope, datas, $location, $http){
		console.log("SearchFormCrtl");
		$scope.$on('searchValuesChange',function(evt, values){
			console.log("SearchFormCrtl on searchValuesChange");
			$scope.fields = values;
			datas.loadFlows();
		});
		
		$scope.search = function(fields){
			/*Change the URL this will trigger the UrlCrtl but first we need to tokenize the fields
			
			console.log("SearchFormCrtl search");
			var searchString ='';
			for (name in fields){
				if(angular.isString(fields[name]))
					searchString+=name+'='+fields[name]+'|';
			}
			$location.path("/search/"+searchString);
		}
		//to fill the application with good value
		$scope.criticity = [ {'name':"High" , 'value':'1'}, 
				{'name':"Medium" , 'value':'2'}, 
		{'name':"Low" , 'value':'3'}];
		$scope.applications = [];
		$scope.attribute_names = [];
		$scope.transactions = [];
		$scope.error_categories = [];
		$scope.status = [ {'name':"Started" , 'value':'10'}, 
		{'name':"In Progress" , 'value':'20'}, 
		{'name':"Terminated" , 'value':'30'}, 
		{'name':"In Error" , 'value':'40'},
		{'name':"Terminated KO", 'value':'50'}];
		$http.get('/serviceDetails').success(function(content,status){
			console.log("SearchFormCrtl serviceDetails");
			$scope.applications = $.xml2json(content).application;
			$scope.attribute_names = $.xml2json(content).attribute;
			$scope.error_categories = $.xml2json(content).error_category;
			for(a in $scope.applications) for(b in $scope.applications[a].transaction)$scope.transactions.push($scope.applications[a].transaction	[b]);
		});
	}]);
	mon.controller('UrlCrtl', ['$scope','datas', '$routeParams', function($scope, datas, $routeParams){
		console.log('UrlCrtl');
		$scope.fields = {};
		if(!angular.isUndefined($routeParams.searchString)){ // automatically fill the form
			var arrayOfParamValue = $routeParams.searchString.split("|");
			console.log('arrayOfParamValue');console.log(arrayOfParamValue);
			if(arrayOfParamValue.length > 1){
				for ( el in arrayOfParamValue){
					 var split = arrayOfParamValue[el].split("=");
					 var fieldsplit = split[0].split(".");
					 if(fieldsplit.length > 1){
						$scope.fields[fieldsplit[0]] = $scope.fields[fieldsplit[0]] || {};
						$scope.fields[fieldsplit[0]][fieldsplit[1]] = split[1];
					 }else{
						$scope.fields[split[0]] = split[1];
					 }
				};
			}
			console.log("$scope.fields");
			console.log($scope.fields);
		}
		datas.setSearchValues($scope.fields);
	}]);
	
