var app = angular.module('booking',['ui.router','checklist-model','commonServices']);
app.controller('bookingController', function bookingController($scope, $http, $templateCache, $state, $rootScope, $filter) {
	$scope.loading = false;
	$scope.gotoNext = function (){
		console.log("gotoNext");
	}
});