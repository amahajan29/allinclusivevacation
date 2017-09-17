var app = angular.module('commonServices', ['ui.router']);

app.service('flightSearch', ['$http','$q', function ($http, $q) {

    var flightSearch = function(object) {
        var defer = $q.defer();
        //
        return $http.get('https://mgmpackageslive.azurewebsites.net/mgmpackageslive/API/FlightSearch?StartDate=20171010&ReturnDate=20171017&FlightFrom=LON&FlightTo=FAO&Adults=1&Children=0&Infants=0'
            ).then(function(response){
            // Access granted
            if (response.status == 200 || response.status == 304) {
                defer.resolve(response.data);
            } else {
                // Access not granted
                defer.reject(false);
            }

            return defer.promise;
        });
    }

    return {
        flightSearch: flightSearch
    };
}]);

app.service('hotalSearch', ['$http','$q', function ($http, $q) {

    var hotalSearch = function(object) {
        var defer = $q.defer();
        return $http.get('https://mgmpackageslive.azurewebsites.net/mgmpackageslive/API/RoomSearch?Location=FAO&sFrom=20171010&sTo=20171017&NoOfAdults=1&NoOfChildren=0'
            ).then(function(response){
            // Access granted
            if (response.status == 200 || response.status == 304) {
                defer.resolve(response.data);
            } else {
                // Access not granted
                defer.reject(false);
            }

            return defer.promise;
        });
    }

    return {
        hotalSearch: hotalSearch
    };
}]);