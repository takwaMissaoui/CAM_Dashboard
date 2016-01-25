rxgbm.factory('dashboardContext', ['$rootScope', 'rxgbmCommon', function($rootScope, rxgbmCommon){
	var context = {
		index : rxgbmCommon.countries[0].index,
		country : {
			id : rxgbmCommon.countries[0].id,
			name : rxgbmCommon.countries[0].name,
			currency:rxgbmCommon.countries[0].currency,
			
		},
		date : {
 			from : moment().subtract(7, 'days'),
			to : moment()

		},
		customerId : null,
		orderId : null,
		productId : null
	}

	var logContext  = function(){
		console.log("New context is: ", context);
	}

	var action = {};


	action.setCountry = function(id){
		console.log('changing context country from:', context.country, 'to: ', id);
		//check validity of country
		var found = false;

		for (i in rxgbmCommon.countries){
			if(rxgbmCommon.countries[i].id == id){
				found = true;
				context.country.id = rxgbmCommon.countries[i].id;
				context.country.name = rxgbmCommon.countries[i].name;
				context.country.currency=rxgbmCommon.countries[i].currency;
				context.index = rxgbmCommon.countries[i].index;
				break;
			}
		}//for
		if (!found){
			console.warn('Cannot set new country because ', id, 'is unknow in rxgbm.countries id will set GLOBAL instead')
		}else{
			action.clearCustomer();
			action.clearProduct();
			logContext();
		}
			
	}//setCountry,
	action.clearCustomer = function(){
		console.log("clear customer id");
		action.clearOrder();
		context.customerId = null;
	}

	action.clearOrder = function(){
		console.log("clear customer order");
		context.orderId = null;
	}

	action.clearProduct = function(){
		console.log("clear product Id");
		context.productId = null;
	}

	action.setCustomer = function(id){
		console.log('changing context customer from:', context.customerId, 'to: ', id);
		action.clearOrder();
		context.customerId = id;
		logContext();
	};
	action.setOrder = function(id){
		console.log('changing context order from:', context.orderId, 'to: ', id);
		if(context.country == 'rx' && angular.isUndefined(context.customerId))
			console.warn('cannot set new order because country is global and customerId is not defined')
		else
			context.orderId = id;
		logContext();
	}
	action.setProduct = function(id){
		console.log('changing context product from:', context.productId, 'to: ', id);
		if(context.country == 'rx')
			console.warn('cannot set product when country is global')
		else
			context.productId = id;
		logContext();
	}

	action.setDate = function(from,to){
		
		context.date.from = moment(from);
		context.date.to = moment(to);
		console.log('using this date range : from :', context.date.from ,'to :',context.date.to);
		
	}

	action.getIndex = function(){
		return context.index;
	}
	action.getCustomer = function(){
		return context.customerId;
	}
	action.getOrder = function(){
		return context.orderId;
	}
	action.getProduct = function(){
		return context.productId;
	}
	action.getDateRange = function(){
		return context.date
	}
	action.getCountry = function(){
		return context.country;
	}
	action.triggerEndofUpdate = function(){ // used for controller-nav-index
		console.log(">triggerEndofUpdate")
		$rootScope.$broadcast('context-updated', action);
	}
	action.getFilter =  function(values,type,content){
		var filters = [];
		if (angular.isUndefined(values))
			values = []; 

		if(values.indexOf("customerId") >= 0)
			if(angular.isDefined(context.customerId) && context.customerId!=null)
				filters.push({term : {"customerId" : context.customerId}})
			else // if customerid is not define we want to avoid to have PO with Customer REXEL
				//not bug corrected should use small letters
				filters.push({not:{term : {"customerId" : "rexel"}}}) 

		if(values.indexOf("productId") >= 0 && angular.isDefined(context.productId) && context.productId!=null)
			if(angular.isUndefined(type) || type == 'order')
				filters.push({term : {"Lines.code" : context.productId}})
			else if (type == 'product')
				filters.push({term : {"productCode" : context.productId}})

		if(values.indexOf("orderId") >= 0 && angular.isDefined(context.orderId) && context.orderId!=null)
			filters.push({term : {"_id" : context.orderId}})

		if(values.indexOf("Delivery")>=0 && angular.isDefined(content) && content!=null ){
			
			filters.push({term : {"Delivery.mode":content}} )
		}
		if(values.indexOf("Events")>=0 && angular.isDefined(content)&& content!=null ){
			for(var i=0;i<content.length;i++){
				filters.push({term : {"Events.type":content[i]}})} 
		}
		if(values.indexOf("notEvents")>=0 && angular.isDefined(content) && content!=null){
			for(var i=0;i<content.length;i++){
				filters.push({not:{term : {"Events.type":content[i]}}})} 
		}


		filters.push({
			range : {
				"date" : {
		            "gte": context.date.from.format("YYYY-MM-DD"),
		            "lte": context.date.to.format("YYYY-MM-DD")
		        }
		    }
		})

		var filter = {};
		
		if(filters.length == 1)
			filter = filters[0];
		else if(filters.length > 1)
			filter = {  
				and :{
					 filters:filters//filters
				}//and
			}
		return filter;
	}

	return action;
}]);