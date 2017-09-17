var app = angular.module('aivApp', ['ui.router','checklist-model','home','flight','hotal','commonServices']);

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
        url:'/flight-search',
        data: {
            pageTitle:'All Inclusive Vacation'
        },
        params: {
            obj : null
        },
        views: {
            'flight-search': {
                templateUrl: 'flight/partials/flight-search.html',
                controller:'flightSearchController',
            },
        }
    })

    .state('hotal-search',{
        url:'/hotal-search',
        data: {
            pageTitle:'All Inclusive Vacation'
        },
        params: {
            obj : null
        },
        views: {
            'hotal-search': {
                templateUrl: 'hotal/partials/hotal-search.html',
                controller:'hotalSearchController',
            },
        }
    })  

    .state('package-details',{
        url:'/package-details',
        templateUrl:'package_detail.html',
        controller:'detailsController',
        data: {pageTitle:'Hotel Details'}
    });

    $urlRouterProvider.otherwise('/');
});

app.run(function($rootScope){
    $rootScope.isHome = false;
});
