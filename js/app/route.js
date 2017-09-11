var aivApp = angular.module('aivApp', ['ui.router','ngAnimate']);

aivApp.config(['$stateProvider', '$locationProvider', '$httpProvider', '$urlRouterProvider', function($stateProvider, $locationProvider, $httpProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise('/');

	$stateProvider.state('home',{
		url:'/',
		templateUrl: 'home.html',
		controller:'homeController',
		data: {pageTitle:'All Inclusive Vacation'},
	})	
	.state('hotel-details',{
		url:'/hotel-details',
		templateUrl:'./home.html',
		controller:'detailsController',
		data: {pageTitle:'Hotel Details'}
	});

	$httpProvider.interceptors.push(['$q','$location','$rootScope', function($q, $location, $rootScope) {
		return {
			request: function(config)
			{
				angular.element($rootScope.current_loader).parent().addClass('loaderBtn');
				return config;
			},
			response: function(response) {
				angular.element($rootScope.current_loader).parent().removeClass('loaderBtn');
				return response || $q.state(response);
			},
			responseError: function(rejection) {
				angular.element($rootScope.current_loader).parent().removeClass('loaderBtn');
				if(rejection.data.ResponseCode == 401)
				{
					sessionStorage.clear();
					window.location.href=site_url+'auth/logout';
				}
				return $q.reject(rejection);
			}
		};
	}]);

	$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

	$locationProvider.html5Mode(true);
		
}]);


aivApp.run(['$rootScope', '$location' , '$state', function ($rootScope, $location, $state) {

	$rootScope.notification_count = '';
	
	$rootScope.userlogin              = false;
	/*if(sessionStorage.getItem(AUTH_KEY)!=null && sessionStorage.getItem(AUTH_KEY)!=''){
		$rootScope.userlogin           = true;
	}*/

	$rootScope.update_notification = function ($event) {
	
	// if(!sessionStorage.getItem(AUTH_KEY))return;
		/*dataSavingHttp({
			url: site_url+"update_notification_count",
		}).success(function (response) {
			$rootScope.notification_count = response.Data.notification_count;
		}).error(function (error) {});*/
	};

	$rootScope.$on('$stateChangeSuccess', function(event, current, previous){		
		$rootScope.is_visible_chat = false;
		if (current.name == "scoring") {
			$rootScope.is_visible_chat = true;	
			// $scope.chatscrolldown();		
		}
		angular.element("#fade").hide();
		$rootScope.location = $location;
		$rootScope.update_notification();
		if (angular.element("#errorMessage").attr('alert_page')=='lineup') 
		{
			angular.element("#errorMessage").hide();
			$rootScope.alert_error="";
		}
	});
	$rootScope.$state = $state;

	$rootScope.alert_success='';
	$rootScope.alert_warning='';
	$rootScope.alert_error='';
	$rootScope.improtLineupId = '';

	
}]);