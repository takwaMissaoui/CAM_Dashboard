rxgbm.filter('rxgbmStatusLog', function(){
	return function(input){
		var cssPrefix = "label label-"
		switch(input){
			case 30 : 
				cssClass = cssPrefix +'success'
				text = "End OK"
				break;
			case 10 : 
				cssClass = cssPrefix +'info'
				text = "Started"
				break;
			case 11 : 
				cssClass = cssPrefix +'info'
				text = "in progress"
				break;
			case 50 : 
				cssClass = cssPrefix +'danger'
				text = "End KO"
				break;
			default :
				cssClass= cssPrefix +'default'
				text = "none" + input
		}
		return '<span class="'+cssClass+'">'+text+'</span>'
	}
})