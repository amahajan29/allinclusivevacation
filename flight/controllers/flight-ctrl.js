var app = angular.module('flight',['ui.router','checklist-model','commonServices']);
app.controller('flightSearchController', function($scope, $http, $templateCache, $state, $stateParams, $filter, apis) {

  $scope.departureTimes = ["Lowest fare","Morning","Midday","Afternoon ","Evening"];
  $scope.stops = [
    {key : 0, value: "Direct flights only"},
    {key : 1, value: "1 stop"},
    {key : 2, value: "2 stops"},
    {key : 3, value: "3 stops"},
    {key : 4, value: "4 stops"},
    {key : 5, value: "I don't mind"}
  ];
  $scope.airlineses = ["British Airways","airberlin","Lufthansa","SAS","Brussels Airlines","Include Low Cost", ];
  $scope.alliances = ["One World", "Sky Team", "Star Alliance"];
  $scope.priceRange = [
    {key : "0-99", value: "0 - 99 €"},
    {key : "100-299", value: "100 - 299 €"}, 
    {key : "300-499", value: "300 - 499 €"},
    {key : "500-699", value:  "500 - 699 €"},
    {key : "700", value:  "700 € +"}
  ];
  $scope.class = ["Economy","Business","First"];

  $scope.search= {
    "departureTimes" : [],
    "stops" : [],
    "airlines" : [],
    "alliances" : [],
    "priceRange" : [],
    "class" : []
  }
  
  $scope.flightList = null;
  $scope.airports = [];
  $scope.airlines = [];
  $scope.notFound = false;
  $scope.loading = true;

  var flightList = null;
  var obj = {
        FlightFrom: $stateParams.FlightFrom,
        FlightTo: $stateParams.FlightTo,
        StartDate: $stateParams.StartDate,
        ReturnDate: $stateParams.ReturnDate,
        Adults: $stateParams.Adults,
        Children: $stateParams.Children,
        Infants:$stateParams.Infants
      };
  
  apis.airports().then(function(response){
    if(response != ''){
      $scope.airports = response;
    }
  }).catch(function(response) {
    console.log("Sorry, there is a problem. Please, contact support.");
  });

  apis.airlines().then(function(response){
    if(response != ''){
      $scope.airlines = response;
    }
  }).catch(function(response) {
    console.log("Sorry, there is a problem. Please, contact support.");
  });
      
  apis.flightSearch(obj).then(function(response){
    $scope.loading = false;    
    if(response == ''){
      $scope.notFound = true;
    }else{
      $scope.flightList = response;
      flightList = $scope.flightList;
    }
  }).catch(function(response) {
    $scope.notFound = true;
    $scope.loading = false;
    console.log("Sorry, there is a problem. Please, contact support.");
  });


  $scope.filterStops = function() {
    $scope.newList = [];
    if($scope.search.stops.length > 0){
      for (var i = 0; i < $scope.search.stops.length; i++) {
        var l = $filter('filter')(flightList, { NumberofStops: $scope.search.stops[i] });
        $scope.newList = $scope.newList.concat(l);
      };
      $scope.flightList = $scope.newList;
    }else{
      $scope.flightList = flightList;
    }
  }

  setTimeout(function(){  
   initializeScript();
  },2000)
});

// if($scope.search.priceRange.length > 0){
//       for (var i = 0; i < $scope.search.priceRange.length; i++) {
//         var arr = $scope.search.priceRange.split('-');
//         for (var i = 0; i < $scope.newList.length; i++) {
//           if(arr[0] == 0 && arr[1] == 99){
//             console.log("1");
//           }else if(arr[0] == 100 && arr[1] == 299){
//             console.log("2");
//           }else if(arr[0] == 300 && arr[1] == 499){
//             console.log("3");
//           }else if(arr[0] == 500 && arr[1] == 699){
//             console.log("4");
//           }else{
//             console.log("4");
//           }
//         };
//       };
//     }

function initializeScript() {
      
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
        buttonImage: 'assets/images/ico/calendar.png',
        buttonImageOnly: true,
        dateFormat: "yyyy/mm/dd"
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
         
         $(function() {
          $('.lazy').lazy();
      });
      //   (function($) {
      //     $.Lazy('examplePlugin', function(element, response) {
      //         // just for demonstration, write some text inside element
      //         element.html('<div class="details new-design" style="position:relative;"> <div class="depart-wrap"> <h3>Easyjet - <span> Friday, 5 April </span> </h3> <div class="table-flight first frid"> <div class="f-wrap design"> <div class="flight-info"><strong>Franz Josef Strauss</strong> (MUC)<br/> 22:00 </div></div><div class="f-wrap design"> <div class="flight-info"><strong>Luton International</strong> (LTN)<br/>23:00 Friday,5 April </div></div></div><h3>Easyjet - <span> Friday, 5 April </span> </h3> <div class="table-flight"> <div class="f-wrap design"> <div class="flight-info"><strong>Franz Josef Strauss</strong> (MUC)<br/> 22:00 </div></div><div class="f-wrap design"> <div class="flight-info"><strong>Luton International</strong> (LTN)<br/>23:00 Friday,5 April </div></div></div></div><div class="depart-button"> <div class="arive-stop"> <p><strong>13h 5 / 1 Stop</strong><br/>EY 12 / 9W 589</p></div><a href="search_results-hotel.html" title="Book now" class="gradient-button book"> &euro; 53.22</a> <div class="return-stop"> <p><strong>13h 5 / 1 Stop</strong><br/>EY 12 / 9W 589</p></div></div></div>')
      //                .addClass("loaded");

      //         // return loaded state to Lazy
      //         response(true);
      //     });
      // })(window.jQuery || window.Zepto);
}