var app = angular.module('commonServices', ['ui.router']);

app.service('apis', ['$http','$q', function ($http, $q) {

    var flightSearch = function(object) {
        var defer = $q.defer();
        ////?StartDate=20171010&ReturnDate=20171017&FlightFrom=LON&FlightTo=FAO&Adults=1&Children=0&Infants=0
        return $http.get('https://mgmpackageslive.azurewebsites.net/mgmpackageslive/API/FlightSearch', {
            params : object
        }).then(function(response){
            // Access granted
            if (response.status == 200 || response.status == 304) {
                defer.resolve(response.data);
            } else {
                // Access not granted
                defer.reject(false);
            }

            return defer.promise;
        });
    };

    var hotalSearch = function(object) {
        var defer = $q.defer();
        //?Location=FAO&sFrom=20171010&sTo=20171017&NoOfAdults=1&NoOfChildren=0
        return $http.get('https://mgmpackageslive.azurewebsites.net/mgmpackageslive/API/RoomSearch',{
            params : object
        }).then(function(response){
            // Access granted
            if (response.status == 200 || response.status == 304) {
                defer.resolve(response.data);
            } else {
                // Access not granted
                defer.reject(false);
            }

            return defer.promise;
        });
    };

    var airlines = function() {
        var defer = $q.defer();

        return $http.get('https://mgmpackageslive.azurewebsites.net/mgmpackageslive/API/DataSearch/?sType=Airlines').then(function(response){
            // Access granted
            if (response.status == 200 || response.status == 304) {
                defer.resolve(response.data);
            } else {
                // Access not granted
                defer.reject(false);
            }

            return defer.promise;
        });
    };

    var airports = function() {
        var defer = $q.defer();

        return $http.get('https://mgmpackageslive.azurewebsites.net/mgmpackageslive/API/DataSearch/?sType=Airports').then(function(response){
            // Access granted
            if (response.status == 200 || response.status == 304) {
                defer.resolve(response.data);
            } else {
                // Access not granted
                defer.reject(false);
            }

            return defer.promise;
        });
    };

    var packageDetail = function(object) {
        var defer = $q.defer();
        //?Location=FAO&sFrom=20171010&sTo=20171017&NoOfAdults=1&NoOfChildren=0
        return $http.get('https://mgmpackageslive.azurewebsites.net/mgmpackageslive/API/packages',{
            params : object
        }).then(function(response){
            // Access granted
            if (response.status == 200 || response.status == 304) {
                defer.resolve(response.data);
            } else {
                // Access not granted
                defer.reject(false);
            }

            return defer.promise;
        });
    };

    var roomDetail = function(object) {
        var defer = $q.defer();
        //?Location=FAO&sFrom=20171010&sTo=20171017&NoOfAdults=1&NoOfChildren=0
        return $http.get('http://mgmpackages.azurewebsites.net/mgmpackages/API/roomdetails',{
            params : object
        }).then(function(response){
            // Access granted
            if (response.status == 200 || response.status == 304) {
                defer.resolve(response.data);
            } else {
                // Access not granted
                defer.reject(false);
            }

            return defer.promise;
        });
    };

    return {
        flightSearch: flightSearch,
        hotalSearch: hotalSearch,
        airlines: airlines,
        airports: airports,
        packageDetail:packageDetail,
        roomDetail:roomDetail,
    };
}]);