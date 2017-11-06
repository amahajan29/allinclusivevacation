var app = angular.module('aivApp', ['ui.router','checklist-model','home','flight','hotal','package','booking','commonServices']);

app.config(function($stateProvider, $urlRouterProvider){
    
    $stateProvider

    .state('home',{
        url:'/',
        data: {
            pageTitle:'All Inclusive Vacation'
        },
        views: {
            'home': {
                templateUrl: 'home/partials/home.html',
                controller:'homeController',
            },
        }
    })

    .state('flight-search',{
        url:'/flight-search/:FlightFrom/:FlightTo/:StartDate/:ReturnDate/:Adults/:Children/:Infants',
        data: {
            pageTitle:'All Inclusive Vacation'
        },
        views: {
            'flight-search': {
                templateUrl: 'flight/partials/flight-search.html',
                controller:'flightSearchController',
            },
        }
    })

    .state('hotal-search',{
        url:'/hotal-search/:Location/:sFrom/:sTo/:NoOfAdults/:NoOfChildren',
        data: {
            pageTitle:'All Inclusive Vacation'
        },
        views: {
            'hotal-search': {
                templateUrl: 'hotal/partials/hotal-search.html',
                controller:'hotalSearchController',
            },
        }
    })  
    .state('package-details',{
        url:'/package-details/:LocationCode/:PackageCode',
        data: {
            pageTitle:'Package Details'
        },
        views: {
            'package-details': {
                templateUrl: 'package/partials/package-detail.html',
                controller:'packageController',
            },
        }
    })
    .state('add-extra',{
        url:'/add-extra',
        data: {
            pageTitle:'Add Extra Details'
        },
        views: {
            'booking': {
                templateUrl: 'add_extras.html',
                controller:'bookingController',
            },
        }
    })
    .state('booking-step1',{
        url:'/booking-step1',
        data: {
            pageTitle:'Booking Step 1'
        },
        views: {
            'booking': {
                templateUrl: 'booking-step1.html',
                controller:'bookingController',
            },
        }
    })
    .state('booking-details',{
        url:'/booking-details',
        data: {
            pageTitle:'Booking Details'
        },
        views: {
            'booking': {
                templateUrl: 'booking-details.html',
                controller:'bookingController',
            },
        }
    })
    /*.state('package-details',{
        url:'/package-details',
        templateUrl:'package_detail.html',
        controller:'detailsController',
        data: {pageTitle:'Hotel Details'}
    });*/

    $urlRouterProvider.otherwise('/');
});

app.run(function($rootScope){
    $rootScope.isHome = false;
});
