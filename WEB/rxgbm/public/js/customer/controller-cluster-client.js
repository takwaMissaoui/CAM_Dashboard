rxgbm.controller('clusterCtrl',['$scope','dashboardContext','$http',function($scope,dashboardContext,$http){

	
$scope.country=dashboardContext.getIndex();

var metrics = [{
    number: 1,
    value: "nb_order"
}, {
    number: 2,
    value: "nb_product_perOrder"
}, {
    number: 3,
    value: "avg_amount"
}, {
    number: 4,
    value: "nb_online_order"
}, {
    number: 5,
    value: "avg_orderPerMonth"
}, {
    number: 6,
    value: "total_amount"
}, {
    number: 7,
    value: "nb_offline_order"
}, {
    number: 8,
    value: "offline_amount"
}, {
    number: 9,
    value: "online_amount"
}, {
    number: 10,
    value: "Time_Preference"
}, {
    number: 11,
    value: "nb_product"
}, {
    number: 12,
    value: "nb_direct"
}, {
    number: 13,
    value: "nb_price"
}, {
    number: 14,
    value: "nb_search"
}, {
    number: 15,
    value: "nb_stock"
}];

$scope.xValues=metrics;
$scope.yValues=metrics;
$scope.selectedX=metrics[7];
$scope.selectedY=metrics[13];



$scope.displayGraph=function(){

    
 
$http.get($scope.country+"/img/"+$scope.selectedX.number+"/"+$scope.selectedY.number).then(function(resp){
    console.log("!!!"+resp.data);
    $scope.image=resp.data;
})

};

$scope.downloadCsv=function(){

$http.get($scope.country+"/files/"+$scope.selectedX.number+"/"+$scope.selectedY.number).then(function(resp){
    console.log("!!!"+resp.data);
    $scope.file=resp.data;
})

}

$scope.displayGraph();




}])