var app = angular.module('flight',['ui.router','checklist-model','commonServices']);
app.controller('flightSearchController', function($scope, $http, $templateCache, $state, $stateParams, $filter, apis) {

  $scope.departureTimes = [
    {key :"4-6", value:"Lowest fare (04:00 - 06:00)"},
    {key :"6-10", value:"Morning (06:00 - 10:00)"},
    {key :"10-13", value:"Midday (10:00 - 13:00)"},
    {key :"13-17", value:"Afternoon (13:00 - 17:00)"},
    {key :"17-24", value: "Evening (17:00 - 24:00)"}
  ];
  $scope.stops = [
    {key : 0, value: "Direct flights only"},
    {key : 1, value: "1 stop"},
    {key : 2, value: "2 stops"},
    {key : 3, value: "3 stops"},
    {key : 4, value: "4 stops"},
    {key : 5, value: "I don't mind"}
  ];

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
  $scope.showList = false;

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
      $scope.alliances = response;
    }
  }).catch(function(response) {
    console.log("Sorry, there is a problem. Please, contact support.");
  });

  apis.airlines().then(function(response){
    if(response != ''){
      $scope.airlineses = response;
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
      $scope.showList = true;
    }
  }).catch(function(response) {
    $scope.notFound = true;
    $scope.loading = false;
    console.log("Sorry, there is a problem. Please, contact support.");
  });


  $scope.filter = function() {
    var newList = [];
    var flag = 1;
    $scope.notFound = false;
    $scope.loading = true;
    $scope.showList = false;

    if($scope.search.stops.length > 0){
      var list = [];
      for (var i = 0; i < $scope.search.stops.length; i++) {
        var l = $filter('filter')(flightList, { NumberofStops: $scope.search.stops[i] });
        list = list.concat(l);
      };
      flag = 0;
      newList = list;
    }else{
      newList = flightList;
    }

    if($scope.search.departureTimes.length > 0){
      var list = [];
      for (var i = 0; i < $scope.search.departureTimes.length; i++) {
        if($scope.search.departureTimes[i] == '4-6'){
          var l = $filter('filter')(newList, function (item) {
             var departDatetime = new Date(item.DepartDatetime);
             return departDatetime.getHours() >= 4 && departDatetime.getHours() <= 6;
          });
          // list = list.concat(l);
        }else if($scope.search.departureTimes[i] == '6-10'){
          var l = $filter('filter')(newList, function (item) {
            var departDatetime = new Date(item.DepartDatetime);
            return departDatetime.getHours() > 6 && departDatetime.getHours() <= 10;
          });
          list = list.concat(l);
        }else if($scope.search.departureTimes[i] == '10-13'){
          var l = $filter('filter')(newList, function (item) {
            var departDatetime = new Date(item.DepartDatetime);
            return departDatetime.getHours() > 10 && departDatetime.getHours() <= 13;
          });
          list = list.concat(l);
        }else if($scope.search.departureTimes[i] == '13-17'){
          var l = $filter('filter')(newList, function (item) {
            var departDatetime = new Date(item.DepartDatetime);
            return departDatetime.getHours() > 13 && departDatetime.getHours() <= 17;
          });
          list = list.concat(l);
        }else if($scope.search.departureTimes[i] == '17-24'){
          var l = $filter('filter')(newList, function (item) {
            var departDatetime = new Date(item.DepartDatetime);
            return departDatetime.getHours() > 17 && departDatetime.getHours() <= 24;
          });
          list = list.concat(l);
        }
      };
      flag = 0;
      newList = list;
    }else{
      newList = flightList;
    }

    if($scope.search.airlines.length > 0){
      var list = [];
      for (var i = 0; i < $scope.search.airlines.length; i++) {
        var l = $filter('filter')(newList, { ValidatingAirlineCode : $scope.search.airlines[i] });
        list = list.concat(l);
      };
      flag = 0;
      newList = list;
    }else if(flag){
      newList = flightList; 
    }

    if($scope.search.alliances.length > 0){
      var list = [];
      for (var i = 0; i < $scope.search.alliances.length; i++) {
        var l = $filter('filter')(newList,  function(item) { 
          return (item.ArrivalAirportLocationCode == $scope.search.alliances[i]) || (item.DepartAirportLocationCode == $scope.search.alliances[i]) || (item.ArrivalAirportLocationCode_RET == $scope.search.alliances[i]) || (item.DepartAirportLocationCode_RET == $scope.search.alliances[i]);
        });
        list = list.concat(l);
      };
      flag = 0;
      newList = list;
    }else if(flag){
      newList = flightList; 
    }

    if($scope.search.priceRange.length > 0){
      var list = [];
      for (var i = 0; i < $scope.search.priceRange.length; i++) {
        var arr = $scope.search.priceRange[i].split('-');
        if(arr[0] == 0 && arr[1] == 99){
          var l = $filter('filter')(newList, function (item) {
            return parseFloat(item.TotalFareAmount) > 0 && parseFloat(item.TotalFareAmount) <= 99;
          });
          list = list.concat(l);
        }else if(arr[0] == 100 && arr[1] == 299){
          var l = $filter('filter')(newList, function (item) {
            return parseFloat(item.TotalFareAmount) > 100 && parseFloat(item.TotalFareAmount) <= 299;
          });
          list = list.concat(l);
        }else if(arr[0] == 300 && arr[1] == 499){
          var l = $filter('filter')(newList, function (item) {
            return parseFloat(item.TotalFareAmount) > 300 && parseFloat(item.TotalFareAmount) <= 499;
          });
          list = list.concat(l);
        }else if(arr[0] == 500 && arr[1] == 699){
          var l = $filter('filter')(newList, function (item) {
            return parseFloat(item.TotalFareAmount) >= 500 && parseFloat(item.TotalFareAmount) <= 699;
          });
          list = list.concat(l);
        }else{
          var l = $filter('filter')(newList, function (item) {
            return parseFloat(item.TotalFareAmount) > 700;
          });
          list = list.concat(l);
        }
      }
      flag = 0;
      newList = list;
    }else if(flag){
      newList = flightList; 
    }
    
    $scope.flightList = newList;

    setTimeout(function(){  
      if($scope.flightList.length == 0){
        $scope.notFound = true;
      }
      $scope.loading = false;
      $scope.showList = true;
      $scope.$apply();
    },1000)
  }

  setTimeout(function(){  
   initializeScript();
  },2000)
});



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
}