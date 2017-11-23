var app = angular.module('booking',['ui.router','checklist-model','commonServices']);
app.controller('bookingController', function bookingController($scope, $http, $templateCache, $state, $rootScope, $filter,apis,$window) {
	$scope.loading = false;
	$scope.errors = {};
	$scope.error = "";
	$scope.Booking1 = {};
	$scope.Step2 = {};
	$scope.bookStep = 1;
	$scope.booking_hotel = [];
	$scope.booking_flight = [];
	$scope.gotoNext = function (){
		location.href = "#/booking-step1";
	}
	$scope.isValidStep1 = function(){
		$scope.booking1Submit();
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
	$scope.isValidStep2 = function(){
		$scope.errors = {};
	    $scope.error = "";
	    var isvalid = true;
	    var elems = ['card','card_number','card_holder','expiration_date','cv2_number'];
		for(var i in elems){
			if(!$scope.Step2[elems[i]]){
		      isvalid = false;
		      var label = elems[i].split("_").map(function(el){ 
		      	return el[0].toUpperCase()+el.slice(1);
		      }).join(" ");
		      $scope.errors[elems[i]] = label+" is required.";
		    }
		}
		if(!$scope.Step2.agreement){
			isvalid = false;
			$scope.errors.agreement = "Please accept agreement.";
		}
	    return isvalid;
	}
	$scope.booking1Submit = function(){
		var mp = "MainPassenger";
		var bookingObj = {
			MainPassengerTitle:"Mr",
			MainPassengerFirstName:"Ankit",
			MainPassengerLastName:"Kumar",
			MainPassengerEmail:"ankit@gmail.com",
			MainPassengerCoutryCode:"+44",
			MainPassengerPhoneNumber:"7867554433",
			MainPassengerpassportno:"",
			MainPassengerpassportexpdate:"",
			MainPassengercountry:"",
			MainPassengerseatpref:"",
			MainPassengermealpref:"",
			MainPassengerbookingpref:"",
			FromDate:"2017-12-01",
			ToDate:"2017-12-10",
			Adults:"1",
			Children:"1",
			Infant:"0",
			roomsearchid:$scope.booking.RoomSearchID,
			packagesessionid:"",
			idflights:"2002",
			idflights_RET:"",
			idrooms:"",
			transfer:false,
			total:"208",
			MainPassengerDOB:"02/12/2003",
			revalidate:false,
			main_title:false,
			main_firstname:false,
		}
		console.log("booking1Submit");
		apis.booking(bookingObj).then(function(response){
	        console.log(roomDetails);
	    }).catch(function(response) {
	        console.log("Sorry, there is a problem. Please, contact support.");
	    });

		//location.href = "#/booking-details";
		//$scope.bookStep = 2;
	}
	$scope.gotoStep = function(step){
		$scope.bookStep = step;
	}
	$scope.printBooking = function(){
		console.log("printBooking called");
	}
	$scope.addExtraInit = function (){
		$scope.booking_hotel = JSON.parse($window.localStorage.getItem("booking_hotel"));
		$scope.booking_flight = JSON.parse($window.localStorage.getItem("booking_flight"));
		console.log($scope.booking);
	}
$scope.goToFlightSearch = function (){	
	var dateObj = localStorage.getItem('fltdateObj');
	var tmpObj = JSON.parse(dateObj);
	setTimeout(function(){		
		$state.go('flight-search',tmpObj);
	},800);
}
$scope.goToHotelSearch = function (){	
	var dateObj = localStorage.getItem('htdateObj');
	var tmpObj = JSON.parse(dateObj);
	setTimeout(function(){		
		$state.go('hotal-search',tmpObj);
	},800);
}
$scope.isHotelFlight = false;
if (localStorage.getItem('fh-hotel')) {
  $scope.isHotelFlight = true;
  $scope.twotab = "";
  $scope.twotab1 = "";
}
$scope.twotab = "";
$scope.isHotel = false;
if (localStorage.getItem('booking_hotel')) {
  $scope.isHotel = true;
  $scope.twotab = "width:44%;";
  $scope.twotab1 = "";
}
$scope.isFlight = false;
if (localStorage.getItem('booking_flight')) {
  $scope.isFlight = true;
  $scope.twotab = "width:44%;";
  $scope.twotab1 = "";
}

	$scope.addExtraInit();
});