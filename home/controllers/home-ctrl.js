var app = angular.module('home',['ui.router']);
app.controller('homeController', function homeController($scope, $http, $templateCache, $state, $rootScope, $filter, $window) {

  $rootScope.isHome = true;
  $scope.limit = 4;
  $scope.begin = 0;
  $scope.packagebtn = true;
  date = new Date();
  date = new Date();
  var today = $filter('date')(date, 'yyyy/MM/dd');
  var afterSeven = $filter('date')(addDays(date,7), 'yyyy/MM/dd');
  var nxtFriday = getNextDayOfWeek(date,5)
  // var formatFriday = $filter('date')(nxtFriday, 'yyyy/MM/dd');
  console.log('nxtFriday', nxtFriday);
  $scope.flight = {
    FlightFrom : "LON",
    FlightTo : "FAO",
    StartDate :today,
    //depart: "",
    // ReturnDate : $filter('date')(addDays(date,7), 'yyyy/MM/dd'),    
    //return : "",
    Adults : 1,
    Children : 0,
    Infants : 0
  };

  $scope.package = {
    destination: "FAO",
    // depart: formatFriday,
    Adults : 1,
    Children : 0,
    Infants : 0,
  }
  $scope.errors = {};
  $scope.error = "";
  $scope.loading = false;

  $scope.hotal = {
    Location : "LON",
    sFrom : today,
    // sTo : $filter('date')(addDays(date,7), 'yyyy/MM/dd'),
    // sTo : today,
    Rooms : 1,
    NoOfAdults : 1,
    NoOfChildren : 0
  };
  $scope.flight_hotel = {
    FlightFrom : "LON",
    FlightTo : "FAO",
    depart : today,
    // "return" : $filter('date')(addDays(date,7), 'yyyy/MM/dd'),
    // "return" : today,
    NoOfAdults : 0,
    NoOfChildren : 0,
    Rooms : 0,
    Children : 0,
    Infants : 0
  };

  setTimeout(function(){

    $scope.hotal.sTo = afterSeven;
    $scope.flight_hotel.return = afterSeven;
    $scope.flight.ReturnDate = afterSeven;
    // $scope.package.depart= nxtFriday;
  },1000);

  $scope.isValidPackage = function(){
      $scope.errors = {};
      $scope.error = "";
      var isvalid = true;
      if(!$scope.package.destination){
        isvalid = false;
        $scope.errors.pkg_destination = "Destination is required.";
      }
      if(!$scope.package.depart){
        isvalid = false;
        $scope.errors.pkg_depart = "Departure is required.";
      }
      if($scope.package.Adults < 1){
        isvalid = false;
        $scope.errors.pkg_Adults = "At least one adult is required.";
      }
      return isvalid;
  }
  $scope.packageSubmit = function(){
      $scope.makeApiCall();
      $scope.setOffersAtTop();
  }
  $scope.isValidFlight = function(){
    $scope.errors = {};
    $scope.error = "";
    var isvalid = true;
    if(!$scope.flight.StartDate){
      isvalid = false;
      $scope.errors.F_StartDate = "Depart Date is required.";
    }
    if(!$scope.flight.ReturnDate){
      isvalid = false;
      $scope.errors.F_ReturnDate = "Return Date is required.";
    }
    if(isvalid){
      var StartDate = new Date($scope.flight.StartDate);
      var ReturnDate = new Date($scope.flight.ReturnDate);
      if(StartDate.getTime() >= ReturnDate.getTime()){
        isvalid = false;
        $scope.errors.F_ReturnDate = "ReturnDate should be greater than Depart date.";
      }
    }
    if($scope.flight.Adults < 1){
      isvalid = false;
      $scope.errors.F_Adults = "At least one adult is required.";
    }
    return isvalid;
  };

  $scope.isValidHotel = function(){
    $scope.errors = {};
    $scope.error = "";
    var isvalid = true;
    if(!$scope.hotal.sFrom){
      isvalid = false;
      $scope.errors.H_sFrom = "Check-in date is required.";
    }
    if(!$scope.hotal.sTo){
      isvalid = false;
      $scope.errors.H_sTo = "Check-out date is required.";
    }
    if(isvalid){
      var StartDate = new Date($scope.hotal.sFrom);
      var ReturnDate = new Date($scope.hotal.sTo);
      if(StartDate.getTime() >= ReturnDate.getTime()){
        isvalid = false;
        $scope.errors.H_sTo = "Check-out date can't be less than check-in.";
      }
    }
    if($scope.hotal.NoOfAdults < 1){
      isvalid = false;
      $scope.errors.H_Adults = "At least one adult is required.";
    }
    return isvalid;
  };

  $scope.isValidFH = function(){
    $scope.errors = {};
    $scope.error = "";
    var isvalid = true;
    if(!$scope.flight_hotel.sFrom){
      isvalid = false;
      $scope.errors.FH_sFrom = "From city is required.";
    }
    if(!$scope.flight_hotel.sTo){
      isvalid = false;
      $scope.errors.FH_sTo = "To city is required.";
    }
    if(!$scope.flight_hotel.depart){
      isvalid = false;
      $scope.errors.FH_depart = "Departure date is required.";
    }
    if(!$scope.flight_hotel["return"]){
      isvalid = false;
      $scope.errors.FH_return = "Return date is required.";
    }
    if(isvalid){
      var StartDate = new Date($scope.flight_hotel.depart);
      var ReturnDate = new Date($scope.flight_hotel["return"]);
      if(StartDate.getTime() >= ReturnDate.getTime()){
        isvalid = false;
        console.log("Departure date can't be less than return.");
        $scope.errors.FH_return = "Departure date can't be less than return.";
      }
    }
    if($scope.flight_hotel.NoOfAdults < 1){
      isvalid = false;
      $scope.errors.FH_Adults = "At least one adult is required.";
    }
    return isvalid;
  };

  $scope.flightSubmit = function(){
    localStorage.removeItem('fh-hotel');    
    localStorage.removeItem('booking_hotel');
    localStorage.removeItem('booking_flight');
    $scope.flight.StartDate = $scope.flight.StartDate.replace("/","");
    $scope.flight.StartDate = $scope.flight.StartDate.replace("/","");
    $scope.flight.ReturnDate = $scope.flight.ReturnDate.replace("/","");
    $scope.flight.ReturnDate = $scope.flight.ReturnDate.replace("/","");
    //console.log($scope.flight)
    $state.go('flight-search',{
        FlightFrom: $scope.flight.FlightFrom,
        FlightTo: $scope.flight.FlightTo,
        StartDate: $scope.flight.StartDate,
        ReturnDate: $scope.flight.ReturnDate,
        Adults: $scope.flight.Adults,
        Children: $scope.flight.Children,
        Infants:$scope.flight.Infants
      });
  }

  $scope.hotalSubmit = function(){
    localStorage.removeItem('fh-hotel');
    localStorage.removeItem('booking_hotel');
    localStorage.removeItem('booking_flight');
    $scope.hotal.sFrom = $scope.hotal.sFrom.replace("/","");
    $scope.hotal.sFrom = $scope.hotal.sFrom.replace("/","");
    $scope.hotal.sTo = $scope.hotal.sTo.replace("/","");
    $scope.hotal.sTo = $scope.hotal.sTo.replace("/","");
    $state.go('hotal-search',{
        sFrom: $scope.hotal.sFrom,
        sTo: $scope.hotal.sTo,
        Location: $scope.hotal.Location,
        NoOfChildren: $scope.hotal.NoOfChildren,
        NoOfAdults: $scope.hotal.NoOfAdults,
      });
  }

  $scope.FHSubmit = function(){
    localStorage.removeItem('booking_hotel');
    localStorage.removeItem('booking_flight');
    localStorage.removeItem('fh-hotel');
    $scope.errors = {};
    $scope.error = "";
    var isvalid = true;
    
    if(!$scope.flight_hotel.depart){
      isvalid = false;
      $scope.errors.FH_depart = "Departure date is required.";
    }
    if(!$scope.flight_hotel["return"]){
      isvalid = false;
      $scope.errors.FH_return = "Return date is required.";
    }
    if(isvalid){
      var StartDate = new Date($scope.flight_hotel.depart);
      var ReturnDate = new Date($scope.flight_hotel["return"]);
      if(StartDate.getTime() >= ReturnDate.getTime()){
        isvalid = false;
        console.log("Departure date can't be less than return.");
        $scope.errors.FH_return = "Departure date can't be less than return.";
      }
    }
    if($scope.flight_hotel.NoOfAdults < 1){
      isvalid = false;
      $scope.errors.FH_Adults = "At least one adult is required.";
    }
    if (!isvalid) {
      return false;
    }
    $scope.flight_hotel.sFrom = $scope.flight_hotel.depart.replace("/","");
    $scope.flight_hotel.sFrom = $scope.flight_hotel.depart.replace("/","");
    $scope.flight_hotel.sTo = $scope.flight_hotel.return.replace("/","");
    $scope.flight_hotel.sTo = $scope.flight_hotel.return.replace("/","");

    var FHhotelObj = {
      sFrom: $scope.flight_hotel.sFrom,
      sTo : $scope.flight_hotel.sTo,
      Location : $scope.flight_hotel.FlightTo,
      NoOfChildren : $scope.flight_hotel.NoOfChildren,
      NoOfAdults : $scope.flight_hotel.NoOfAdults
    };

    $window.localStorage.setItem("fh-hotel",JSON.stringify(FHhotelObj));

    $scope.flight_hotel.depart = $scope.flight_hotel.depart.replace("/","");
    $scope.flight_hotel.depart = $scope.flight_hotel.depart.replace("/","");
    $scope.flight_hotel.return = $scope.flight_hotel.return.replace("/","");
    $scope.flight_hotel.return = $scope.flight_hotel.return.replace("/","");
    //console.log($scope.flight)
    $state.go('flight-search',{
        FlightFrom: $scope.flight_hotel.FlightFrom,
        FlightTo: $scope.flight_hotel.FlightTo,
        StartDate: $scope.flight_hotel.depart,
        ReturnDate: $scope.flight_hotel.return,
        Adults: $scope.flight_hotel.NoOfAdults,
        Children: $scope.flight_hotel.Children,
        Infants:$scope.flight_hotel.Infants
      });
    
  }

  $scope.setOffersAtTop = function(){
    $('html, body').animate({scrollTop:$('.s-title').offset().top}, 'fast');
  }
var tmpdt = "";
  // $scope.url = 'data.json';
  $scope.makeApiCall = function() {
    $scope.loading = true;
    var countryCode = $scope.package.destination;
    var Adults = $scope.package.Adults;
    var Children = $scope.package.Children;
    var sTo = '';
    if ($scope.package.depart) {      
      sTo = $scope.package.depart.replace(/\//g,"");
    }
    var params = 'LocationCode='+countryCode+'&PackageCode=ALL'+'&NoOfAdults='+Adults+'&NoOfChildren='+Children+'&sTo='+sTo;
    $scope.url = 'https://mgmpackageslive.azurewebsites.net/mgmpackageslive/API/packages?'+params;
    $http({method: 'GET', url: $scope.url, cache: $templateCache}).
    then(function(response) {
      $scope.loading = false;

     if (response.data.length > 0) {
        var tmparr = [];
        var mintmparr = [];
        for (var i = 0; i < response.data.length; i++) {
          var formatdt = $filter('date')(response.data[i].ValidFrom, 'dd-MM-yyyy');
          tmparr.push(formatdt);
          mintmparr.push(new Date(response.data[i].ValidFrom));
        }
        var minDate=new Date(Math.min.apply(null,mintmparr));
        var minformatDT = $filter('date')(minDate, 'yyyy/MM/dd');
        $scope.package.depart = minformatDT;
        tmpdt = minformatDT;
        

        $('.datepicker-wraps input').datepicker({
            showOn: 'button',
            buttonImage: 'assets/images/ico/calendar.png',
            buttonImageOnly: true,
            dateFormat: "yy/mm/dd",
            // setDate: 'today',
            minDate: new Date(),
            beforeShowDay: function(d) {
              var dmy = "";
              dmy += ("00" + d.getDate()).slice(-2) + "-";
              dmy += ("00" + (d.getMonth() + 1)).slice(-2) + "-";
              dmy += d.getFullYear();
              return [$.inArray(dmy, tmparr) >= 0 ? true : false, ""];
                /*var day = date.getDay();
                if(day == 5)
                    return [5, ''];
                else
                    return ['', ''];*/
            }
        }).datepicker("setDate", new Date());
     }
     $scope.data = response.data;
     setTimeout(function(){
      $scope.package.depart = tmpdt;
      $("#datepicker66").val(tmpdt).change();
    },2000);
      
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
    if(where==='next'){
        if(($scope.begin + $scope.limit)<total){
            $scope.begin = ($scope.begin == 0) ? 
                          $scope.limit - 1 
                        : $scope.begin + $scope.limit;
        }
    }
    else{
        if(($scope.begin - $scope.limit)>0){
            $scope.begin = $scope.begin - $scope.limit;
        }
        else{
            $scope.begin = 0;
        }
    }
  };

  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  /*$("#destination6").on("change", function(){
    var selected_country = $(this).val();
    $scope.makeApiCall(selected_country);
    console.log(selected_country);
  });*/
  $(".index-form li").click(function(){
        console.log('tttttttttttt')
        $("#destination5, #destination6").change()
      }); 

  setTimeout(function(){  
   initializeScript();
  },2000);

  $scope.makeApiCall();

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
      
 // only for home page packages 
      

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
      var dateToday = new Date();
      $('.datepicker-wrap input').datepicker({
        showOn: 'button',
        buttonImage: 'assets/images/ico/calendar.png',
        buttonImageOnly: true,
        dateFormat: "yy/mm/dd",
        minDate: dateToday
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

        // $('.add').on('click',function(){
        //     var $qty=$(this).closest('p').find('.qty');
        //     var currentVal = parseInt($qty.val());
        //     if (!isNaN(currentVal)) {
        //         $qty.val(currentVal + 1);
        //     }
        // });
        // $('.minus').on('click',function(){
        //     var $qty=$(this).closest('p').find('.qty');
        //     var currentVal = parseInt($qty.val());
        //     if (!isNaN(currentVal) && currentVal > 0) {
        //         $qty.val(currentVal - 1);
        //     }
        // });
         
}

function getNextDayOfWeek(date, dayOfWeek) {
    // Code to check that date and dayOfWeek are valid left as an exercise ;)

    var resultDate = new Date(date.getTime());

    resultDate.setDate(date.getDate() + (7 + dayOfWeek - date.getDay()) % 7);

    return resultDate;
}