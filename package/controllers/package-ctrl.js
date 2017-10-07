var app = angular.module('package',['ui.router','checklist-model','commonServices']);
app.controller('packageController', function($scope, $http, $templateCache, $state, $stateParams, $filter, apis) {
    $scope.packageDetails = {};
    $scope.roomDetails = {};
    var packageObj = {LocationCode:"FAO",PackageCode:"MGMCPO003"};
    apis.packageDetail(packageObj).then(function(response){
        $scope.packageDetails = response;
        console.log("packageDetails", response);
    }).catch(function(response) {
        console.log("Sorry, there is a problem. Please, contact support.");
    });
    var roomObj = {categoryname:"T0I",resort:"FDV"};
    apis.roomDetail(roomObj).then(function(response){
        $scope.roomDetails = Array.isArray(response)?response[0]:response;
        console.log("roomDetails", response);
    }).catch(function(response) {
        console.log("Sorry, there is a problem. Please, contact support.");
    });

    /*$scope.packageDetails = "111";
    $scope.testg = "222";
    $scope.spicy = function() {
        $.ajax({
            method: "GET",
            url: "https://mgmpackageslive.azurewebsites.net/mgmpackageslive/API/packages",
            data: { LocationCode:"FAO", PackageCode:"MGMCPO003" }
        }).done(function( response ) {
            $scope.packageDetails = response;
            $scope.testg = response.PackageCode;

            console.log(response.PackageCode);
        });
    };
    $scope.spicy();
    $scope.getArticle = function(menu) {
        if(menu==2){
            $location.hash('availibility');// id of div 'availibility'
        }else{
            console.log(menu);
        }
    };*/
    //
});
    