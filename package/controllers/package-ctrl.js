var app = angular.module('package',['ui.router','checklist-model','commonServices','ngMap']);
app.controller('packageController', function($scope, $http, $templateCache, $state, $stateParams, $filter, apis,$location,$stateParams,NgMap) {
    $scope.packageDetails = {};
    $scope.roomDetails = {};
    $scope.loading = true;
    $scope.displaySectoin = "availability";
    var packageObj = {LocationCode:"FAO",PackageCode:$stateParams.PackageCode};
    //var packageObj = {LocationCode:$stateParams.LocationCode,PackageCode:$stateParams.PackageCode};
    apis.packageDetail(packageObj).then(function(response){
        $scope.loading = false;
        $scope.packageDetails = response;
        NgMap.getMap().then(function(map) {
            console.log(map.getCenter());
            console.log('markers', map.markers);
            console.log('shapes', map.shapes);
        });
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
    */
    $scope.getArticle = function(article) {
        $(".inner-nav ul li").removeClass('active');
        $("."+article).addClass('active');
        $scope.displaySectoin = article;
        /*$('html, body').animate({
            scrollTop: $("#"+article).offset().top
        }, 1000);*/
        //$location.hash('availibility');// id of div 'availibility'

    };
   /* $scope.setMap = function(){
        var mapProp= {
            center:new google.maps.LatLng(51.508742,-0.120850),
            zoom:5,
        };
        var map=new google.maps.Map(document.getElementById("pageDetailMap"),mapProp);
    };*/
    //$scope.setMap();
});

/*$(".inner-nav ul li").on("click",function(){
    $(".inner-nav ul li").removeClass('active');
    $(this).addClass('active');
});*/
