 var aivApp = angular.module('aivApp', ["ui.router"]);
    aivApp.config(function($stateProvider, $urlRouterProvider){
      
     $urlRouterProvider.otherwise('/');

      $stateProvider.state('home',{
        url:'/',
        templateUrl: 'home.html',
        controller:'homeController',
        data: {pageTitle:'All Inclusive Vacation'},
      })  
      .state('package-details',{
        url:'/package-details',
        templateUrl:'package_detail.html',
        controller:'detailsController',
        data: {pageTitle:'Hotel Details'}
      });
})

// Define the `aivApp` module
// var aivApp = angular.module('aivApp', []);

aivApp.controller('homeController', ['$scope', '$http', '$templateCache', 
                function homeController($scope, $http, $templateCache) {

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

aivApp.controller('detailsController', ['$scope', '$http', '$templateCache',function detailsController($scope, $http, $templateCache) {
  $scope.getPackageDetails = function(countryCode) {
      $scope.url = 'https://mgmpackageslive.azurewebsites.net/mgmpackageslive/API/packages?LocationCode=FAO&PackageCode=MGMCPO003';
      $http({method: 'GET', url: $scope.url, cache: $templateCache}).
      then(function(response) {
        $scope.data = response.data;
      }, function(response) {
        console.log('Request failed');
      });
    }
    $scope.getPackageDetails();

    $scope.onContainereClick = function (where) {
       if(event.classList.contains('off')) {
          event.classList.remove('off');
        } else {
          event.classList.add('off');
        }
    }
    $scope.toggleSeeMore = function (where) {
       if(document.getElementById("textarea").style.display == 'none') {
          document.getElementById("textarea").style.display = 'block';
          document.getElementById("seeMore").innerHTML = 'See less';
      }
      else {
          document.getElementById("textarea").style.display = 'none';
          document.getElementById("seeMore").innerHTML = 'See more';        
      }
    };

    $scope.initialize = function (where) {

        var secheltLoc = new google.maps.LatLng(49.47216, -123.76307);

        var myMapOptions = {
           zoom: 15
          ,center: secheltLoc
          ,mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var theMap = new google.maps.Map(document.getElementById("map_canvas"), myMapOptions);


        var marker = new google.maps.Marker({
          map: theMap,
          draggable: true,
          position: new google.maps.LatLng(49.47216, -123.76307),
          visible: true
        });

        var boxText = document.createElement("div");
        boxText.innerHTML = "<strong>Best ipsum hotel</strong>1400 PennsylSUVia Ave,Washington DCwww.bestipsumhotel.com";

        var myOptions = {
           content: boxText
          ,disableAutoPan: false
          ,maxWidth: 0
          ,pixelOffset: new google.maps.Size(-140, 0)
          ,zIndex: null
          ,closeBoxURL: ""
          ,infoBoxClearance: new google.maps.Size(1, 1)
          ,isHidden: false
          ,pane: "floatPane"
          ,enableEventPropagation: false
        };

        google.maps.event.addListener(marker, "click", function (e) {
          ib.open(theMap, this);
        });

        var ib = new InfoBox(myOptions);
        ib.open(theMap, marker);
      
    }

    setTimeout(function(){

            $('#image-gallery').lightSlider({
                gallery:true,
                item:1,
                thumbItem:6,
                slideMargin: 0,
                speed:500,
                auto:true,
                loop:true,
                onSliderLoad: function() {
                   $('#image-gallery').removeClass('cS-hidden');
                }  
            });
      
      $('#gallery1,#gallery2,#gallery3,#gallery4').lightGallery({
        download:false
      });
    
    }, 1000)
}]);
