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
setTimeout(function(){  
 initializeScript();
},2000)

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

function initializeScript(){

      
      //MAIN SEARCH 
      $('.main-search input[name=radio]').change(function() {
        var showForm = $(this).val();
        $('.form').hide();
        $("#"+showForm).show();
      }); 
      
      $('.form').hide();
      $('.form:first').show();
      $('.f-item:first').addClass("active");
      $('.f-item:first span').addClass("checked");
      
      $('.f-item .radio').click(function() {
        $('.f-item').removeClass("active");
        $(this).parent().addClass("active");
      }); 
      
      //SEARCH WIDGET
      //$('.refine-search-results dt').each(function() {
//      var tis = $(this), state = false, answer = tis.next('.refine-search-results dd').hide().css('height','auto').slideUp();
//      tis.click(function() {
//        state = !state;
//        answer.slideToggle(state);
//        tis.toggleClass('active',state);
//        });
//      });
      
      // MOBILE MENU
      $('#nav').slimmenu({
        resizeWidth: '1040',
        collapserTitle: 'Main Menu',
        animSpeed: 'medium',
        easingEffect: null,
        indentChildren: false,
        childrenIndenter: '&nbsp;',
        expandIcon:'<i class="material-icons">keyboard_arrow_right</i>',
        collapseIcon:'<i class="material-icons">expand_less</i>'
      });
      
      // CUSTOM FORM ELEMENTS
      $('input[type=radio], input[type=checkbox],input[type=number], select').uniform();
      
      //UI FORM ELEMENTS
      var spinner = $('.spinner input').spinner({ min: 0 });
      
      $('.datepicker-wrap input').datepicker({
        showOn: 'button',
        buttonImage: 'images/ico/calendar.png',
        buttonImageOnly: true
      });
      
      $( '#slider' ).slider({
        range: "min",
        value:1,
        min: 0,
        max: 10,
        step: 1
      });
      
      //SCROLL TO TOP BUTTON
      $('.scroll-to-top').click(function () {
        $('body,html').animate({
          scrollTop: 0
        }, 800);
        return false;
      });
      
      //HEADER RIBBON NAVIGATION
      $('.ribbon li').hide();
      $('.ribbon li.active').show();
      $('.ribbon li a').click(function() {
        $('.ribbon li').hide();
        if ($(this).parent().parent().hasClass('open'))
          $(this).parent().parent().removeClass('open');
        else {
          $('.ribbon ul').removeClass('open');
          $(this).parent().parent().addClass('open');
        }
        $(this).parent().siblings().each(function() {
          $(this).removeClass('active');
        });
        $(this).parent().attr('class', 'active'); 
        $('.ribbon li.active').show();
        $('.ribbon ul.open li').show();
        return true;
      });
      
      //TABS
      $('.tab-content').hide().first().show();
      $('.inner-nav li:first').addClass("active");

      $('.inner-nav a').on('click', function (e) {
        e.preventDefault();
        $(this).closest('li').addClass("active").siblings().removeClass("active");
        $($(this).attr('href')).show().siblings('.tab-content').hide();
        var currentTab = $(this).attr("href");
        if (currentTab == "#location")
        initialize();
      });

      var hash = $.trim( window.location.hash );
      if (hash) $('.inner-nav a[href$="'+hash+'"]').trigger('click');
      
      
      //ROOM TYPES MORE BUTTON
      $('.more-information').slideUp();
      $('.more-info').click(function() {
        var moreinformation = $(this).closest('li').find('.more-information');
        var txt = moreinformation.is(':visible') ? '<i class="fa fa-chevron-down" aria-hidden="true"></i>'  : '<i class="fa fa-chevron-down" aria-hidden="true"></i>' ;
        $(this).html(txt);
        moreinformation.stop(true, true).slideToggle('slow');
      });
          
      
      //LOGIN & REGISTER LIGHTBOX
      $('.close').click(function() {
        $('.lightbox').hide();
      });
      
      //MY ACCOUNT EDIT FIELDS
      $('.edit_field').hide();
      $('.edit').on('click', function (e) {
        e.preventDefault(); 
        $($(this).attr('href')).toggle('slow', function(){});
      });
      $('.edit_field a,.edit_field input[type=submit]').click(function() {
        $('.edit_field').hide(400);
      });
      
      //CONTACT FORM
      $('#contactform').submit(function(){
        var action = $(this).attr('action');
        $("#message").show(400,function() {
          $('#message').hide();
          
          $('#submit')
            .after('<img src="images/ajax-loader.gif" class="loader" />')
            .attr('disabled','disabled');
          
          $.post(action, { 
            name: $('#name').val(),
            email: $('#email').val(),
            phone: $('#phone').val(),
            //subject: $('#subject').val(),
            comments: $('#comments').val()
            //verify: $('#verify').val()
          },
          function(data){
            document.getElementById('message').innerHTML = data;
            $('#message').slideDown('slow');
            $('#contactform img.loader').fadeOut('slow',function(){$(this).remove()});
            $('#submit').removeAttr('disabled'); 
            //if(data.match('success') != null) $('#contactform').slideUp(3000);
            
          });
        });
        // return false; 
      });
      
      // PRELOADER
      $('.loading').fadeOut();
    

  $("#btnlogin").click(function() {
      $("#login").show(1000);
    });
    $("#forged-pass-but").click(function(){
      $("#forged-pass").show(1000);
      $("#login").hide(1000);
    });
    $("#btnregister").click(function() {
      $("#register").show(1000);
      $("#login").hide(1000);
    });

   $('.index-form li').on('click', function(){
      var tab_id = $(this).attr('data-tab');
      $('.index-form li.active-form-nav-indx').removeClass('active-form-nav-indx');
      $('.form-index').removeClass('active-form-indx');
      $(this).addClass('active-form-nav-indx');
      $("#"+tab_id).addClass('active-form-indx');
  });

   $('.tap-one').click(function(){$('.tapping.two').show();$('.book-trainer.one, .tapping.three').hide();}); 
    $('.tap-two').click(function(){$('.tapping.three').show();$('.book-trainer.one, .tapping.two').hide();}); 
    $('.tap-backtwo').click(function(){$('.book-trainer.one').show();$('.tapping.two, .tapping.three').hide();}); 
    $('.tap-backthree').click(function(){$('.tapping.two').show();$('.book-trainer.one, .tapping.three').hide();}); 
    
    
      var custom_fix = $('.custom-fix');
      var hieghtThreshold = (typeof $(".end-aside").offset()!=="undefined")?$(".end-aside").offset().top:0;
      $(window).scroll(function() {
        var scroll = $(window).scrollTop();
        if (scroll >= hieghtThreshold ) {
          custom_fix.addClass('mak-fix');
        } else {
          custom_fix.removeClass('mak-fix');
        }
      });

        $('.add').on('click',function(){
            var $qty=$(this).closest('p').find('.qty');
            var currentVal = parseInt($qty.val());
            if (!isNaN(currentVal)) {
                $qty.val(currentVal + 1);
            }
        });
        $('.minus').on('click',function(){
            var $qty=$(this).closest('p').find('.qty');
            var currentVal = parseInt($qty.val());
            if (!isNaN(currentVal) && currentVal > 0) {
                $qty.val(currentVal - 1);
            }
        });
         
}