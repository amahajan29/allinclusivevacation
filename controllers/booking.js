var app = angular.module('booking',['ui.router','checklist-model','commonServices']);
app.controller('bookingController', function bookingController($scope, $http, $templateCache, $state, $rootScope, $filter) {
	$scope.loading = false;
	$scope.errors = {};
	$scope.error = "";
	$scope.Booking1 = {};
	$scope.gotoNext = function (){
		location.href = "#/booking-step1";
	}
	$scope.isValidBooking1 = function(){
		$scope.errors = {};
	    $scope.error = "";
	    var isvalid = true;
	    var elems = ['first_name','last_name','email','passport','address','city','zip','country'];
		for(var i in elems){
			if(!$scope.Booking1[elems[i]]){
		      isvalid = false;
		      var label = elems[i].split("_").map(function(el){ 
		      	return el[0].toUpperCase()+el.slice(1);
		      }).join(" ");
		      $scope.errors[elems[i]] = label+" is required.";
		    }	
		}
	    return isvalid;
	}
	$scope.booking1Submit = function(){
		location.href = "#/booking-details";
	}
});