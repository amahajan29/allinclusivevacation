// Define the `aivApp` module
var aivApp = angular.module('aivApp', []);

// Define the `PhoneListController` controller on the `aivApp` module
aivApp.controller('LandingPageController', ['$scope', '$http', '$templateCache', 
                function LandingPageController($scope, $http, $templateCache) {

  $scope.limit = 4;
  $scope.begin = 0;
  $scope.packagebtn = true;
  // $scope.url = 'data.json';

  $scope.makeApiCall = function(countryCode) {
    $scope.url = 'https://mgmpackageslive.azurewebsites.net/mgmpackageslive/API/packages?LocationCode='+countryCode+'&PackageCode=ALL';
    $http({method: 'GET', url: $scope.url, cache: $templateCache}).
    then(function(response) {
      $scope.data = response.data;
    }, function(response) {
      console.log('Request failed');
    });
  }

  

  $scope.ViewAllPackages = function () {
    $scope.packagebtn = false;
    $scope.limit = 8;
  };

  $scope.PaginatePackages = function (where) {
    var total = $scope.data.length;
    if(where==='next')
    {
    	if(($scope.begin + $scope.limit)<total)
    	{
    		$scope.begin = $scope.begin + $scope.limit;
    	}
    }
    else
    {
    	if(($scope.begin - $scope.limit)>0)
    	{
    		$scope.begin = $scope.begin - $scope.limit;
    	}
    	else
    	{
    		$scope.begin = 0;
    	}
    }
  };

$("#destination6").on("change", function(){
  var selected_country = $(this).val();
  $scope.makeApiCall(selected_country);
  console.log(selected_country);
});
$scope.makeApiCall('FAO');

}]);