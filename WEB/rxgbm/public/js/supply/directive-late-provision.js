//***************************************************
// to add when update on Rexel order status is enabled
rxgbm.directive('rxgbmLateProvision',function(){
	return{

		scope:{},
		restrict:'A',
		controller:'lateProvisionCtrl',
		templateUrl:'partials/order/late-provision.html'
	}
})