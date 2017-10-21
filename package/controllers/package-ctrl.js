var app = angular.module('package',['ui.router','checklist-model','commonServices','ngMap']);
app.controller('packageController', function($scope, $http, $templateCache, $state, $stateParams, $filter, apis,$location,$stateParams,NgMap) {
    $scope.packageDetails = {};
    $scope.roomDetails = {};
    $scope.loading = true;
    $scope.displaySectoin = "description";
    var packageObj = {LocationCode:"FAO",PackageCode:$stateParams.PackageCode};
    //var packageObj = {LocationCode:$stateParams.LocationCode,PackageCode:$stateParams.PackageCode};
    apis.packageDetail(packageObj).then(function(response){
        $scope.loading = false;
        $scope.packageDetails = response;
        //$scope.getAirLinesName();
        $scope.getAirPortsName(response.FlightDetails);
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

    $scope.getAirPortsName = function(FlightDetails){
        var ArrivalAirportLocationCode = FlightDetails.ArrivalAirportLocationCode;
        var ArrivalAirportLocationCode_RET = FlightDetails.ArrivalAirportLocationCode_RET;
        var DepartAirportLocationCode = FlightDetails.DepartAirportLocationCode;
        var DepartAirportLocationCode_RET = FlightDetails.DepartAirportLocationCode_RET;
        apis.airPorts().then(function(airPorts){
            for(var i in airPorts){
                if(i == ArrivalAirportLocationCode){
                    $scope.packageDetails.FlightDetails.ArrivalAirportLocation = airPorts[i][0].LocationName;
                }
                if(i == DepartAirportLocationCode){
                    $scope.packageDetails.FlightDetails.DepartAirportLocation = airPorts[i][0].LocationName;
                }
                if(i == ArrivalAirportLocationCode_RET){
                    $scope.packageDetails.FlightDetails.ArrivalAirportLocation_RET = airPorts[i][0].LocationName;
                }
                if(i == DepartAirportLocationCode_RET){
                    $scope.packageDetails.FlightDetails.DepartAirportLocation_RET = airPorts[i][0].LocationName;
                }
            }
        }).catch(function(response) {
            console.log("Sorry, there is a problem. Please, contact support.");
        });
    }

    /*$scope.getAirLinesName = function(shortcode){
        apis.airLines().then(function(airLines){
            console.log("Airlines", airLines);
            //pos = myArray.map(function(e) { return e.hello; }).indexOf(shortcode);
            var elem = airLines.findIndex(shortcode);
            $scope.packageDetails.FlightDetails.ArrivalAirportLocation = elem[0].LocationName;
        }).catch(function(response) {
            console.log("Sorry, there is a problem. Please, contact support.");
        });
    }*/

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
    $scope.goToResult = function (){
        window.location = "#/";
        setTimeout(function(){ 
          $('html, body').animate({scrollTop:$('.s-title').offset().top}, 'fast');
        },100);
    }
    $scope.getDate = function (datetime){
        var dateObj = new Date(datetime);
        var day = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][dateObj.getDay()];
        var date = dateObj.getDate();
        var month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][dateObj.getMonth()];
        var year = dateObj.getFullYear();
        return day+" "+date+" "+month+" "+year;
    }
    $scope.getTime = function (datetime){
        var dateObj = new Date(datetime);
        var hours = dateObj.getHours();
        var minutes = dateObj.getMinutes();
        return hours+":"+minutes;
    }
    $scope.minuteToHours = function(minutes) {
        var hours = parseInt(minutes/60);
        var minute = minutes%60;
        return hours+"h "+minute;
    }
    $scope.getArticle = function(article) {
        console.log(article);
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
