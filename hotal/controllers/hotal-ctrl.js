var app = angular.module('hotal',['ui.router','checklist-model','commonServices']);
app.controller('hotalSearchController', function($scope, $http, $templateCache, $state, $stateParams, $filter, apis,$window) {
  $scope.bestPackage = {};
   $scope.starfilter = {};
   $scope.starfilter.startscore = '';

  $scope.bestPackageCode = ["MGMCPO003","MGMCPO004"];
  var obj = {
    Location: $stateParams.Location,
    sFrom: $stateParams.sFrom,
    sTo: $stateParams.sTo,
    NoOfAdults: $stateParams.NoOfAdults,
    NoOfChildren: $stateParams.NoOfChildren,
  };

  $scope.dateFrom = createDate($stateParams.sFrom).format;  
  $scope.sTo = createDate($stateParams.sTo).format;  
  $scope.NoOfAdults = $stateParams.NoOfAdults; 
  var timeDiff = Math.abs(createDate($stateParams.sFrom).dt.getTime() - createDate($stateParams.sTo).dt.getTime());
  $scope.diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
/*get all hotels list*/
  var packageObj = {};
  var allHotels;
    apis.allHotels(packageObj).then(function(response){
      allHotels = response;
    }).catch(function(response) {
      console.log("Sorry, there is a problem. Please, contact support.");
    });

  var packageObj = {LocationCode:"FAO",PackageCode:"MGMCPO003"};
    apis.packageDetail(packageObj).then(function(response){
      $scope.bestPackage = response;
    }).catch(function(response) {
      console.log("Sorry, there is a problem. Please, contact support.");
    });

  $scope.hotalList = null;
  //var hotalList = null;
  apis.hotalSearch(obj).then(function(response){

    var r = response.reduce(function (obj, room) {
      obj[room.Code] = obj[room.Code] || [];
      for (var k in allHotels) {
          if (allHotels.hasOwnProperty(room.Code)) {
             room['hoteldetails'] = allHotels[room.Code]
          }
      }
      obj[room.Code].push(room);
      return obj
    }, {});

    $scope.hotalList = Object.keys(r).map(function(key) {
    return r[key];
    });

    // $scope.hotalList = response;
    for(var i in $scope.hotalList){
      $scope.getRoomDetail(i, {categoryname:$scope.hotalList[i][0].CategoryCode,resort:$scope.hotalList[i][0].Code});
    }
    console.log($scope.hotalList);
    //hotalList = $scope.hotalList;
  }).catch(function(response) {
    console.log("Sorry, there is a problem. Please, contact support.");
  });

  
  $scope.getRoomDetail = function (index,roomObj){
    apis.roomDetail(roomObj).then(function(response){
        var roomDetails = Array.isArray(response)?response[0]:response;
        //console.log(roomDetails);
        $scope.hotalList[index].RoomFacility = roomDetails;
    }).catch(function(response) {
        console.log("Sorry, there is a problem. Please, contact support.");
    });
  }

  $scope.toggleSeeMore = function(index){
    //$().toogleClass("hide");
    document.querySelector(".facility_"+index).classList.toggle('hide');
    //console.log(index);
  }

  $scope.goToExtra = function (index){
      //console.log($scope.hotalList[0][index]);
      $window.localStorage.setItem("booking",JSON.stringify($scope.hotalList[0][index]));
      //console.log($window.localStorage.getItem("booking"));
      window.location = "/#/add-extra";
  }

  $scope.ShowHideDate = function(actionFor){
    if (actionFor == "show") {
      $(".dt-filter").show();
      // $(".dt-filter-btn2").show();
      // $(".dt-filter-btn1").hide();
    }else if(actionFor == "hide"){
      $(".dt-filter").hide();
      // $(".dt-filter-btn2").hide();
      // $(".dt-filter-btn1").hide();
    }
  }

$scope.fromDt = $scope.toDt = "";
  $scope.changeSearchDate = function(){ 
    var fromDt = $("#datepicker1").val().replace("/","");
    var toDt = $("#datepicker2").val().replace("/","");
    var tmp1 = fromDt.replace("/","");
    var tmp2 = toDt.replace("/","");
    $state.go('hotal-search',{
        sFrom: fromDt.replace("/",""),
        sTo: toDt.replace("/",""),
        Location: $stateParams.Location,
        NoOfAdults: $stateParams.NoOfAdults,
        NoOfChildren: $stateParams.NoOfChildren,
      });
  }


$scope.onContainereClick = function(){
    if($("#containere").hasClass('off')) {
      $("#containere").removeClass('off');
      $('.day-amt').show();
      $('.price-per-person-amt').hide();
    } else {
      $("#containere").addClass('off');
      $('.day-amt').hide();
      $('.price-per-person-amt').show();
    }
}
  
});

function createDate(dtStr){
  var str = dtStr;
  var resObj = {};
  var yr = str.substring(0, 4);
  var mon = str.substring(4, 6);
  var dt = str.substring(6, 8);
  var completeDate = yr+"-"+mon+"-"+dt
  var res = new Date(completeDate);
  resObj.format = res.getDate()+" "+res.getMonth()+" "+res.getFullYear();
  resObj.dt =res
  return resObj;  
}

function initializeScript() {
      
      $('#star').raty({
        score    : 3,
        path     : 'assets/images/ico/',
        starOff  : 'star-rating-off.png',
        starOn  : 'star-rating-on.png',
        click: function(score, evt) {
          var scope = angular.element(document.getElementById("hotelparent")).scope();
          scope.starfilter.startscore = score;
          scope.$apply();          
        }
      });

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
        dateFormat: "yy/mm/dd",
        setDate: 'today'
      }).datepicker("setDate", new Date());
      
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
         
       $(document).ready(function() {
            $('#image-gallery, #image-gallerys').lightSlider({
                gallery:true,
                item:1,
                thumbItem:6,
                slideMargin: 0,
                speed:500,
                auto:true,
                loop:true,
                onSliderLoad: function() {
                   $('#image-gallery').removeClass('cS-hidden');
             $('#image-gallerys').removeClass('cS-hidden');
                }  
            });
      
      /*$('#gallery1,#gallery2,#gallery3,#gallery4').lightGallery({
        download:false
      });*/

              
    });

  function onContainereClick (event) {
  if(event.classList.contains('off')) {
    event.classList.remove('off');
  } else {
    event.classList.add('off');
  }
}

<!-- more and less -->

/*function toggleSeeMore() {
    if(document.getElementById("textarea").style.display == 'none') {
        document.getElementById("textarea").style.display = 'block';
        document.getElementById("seeMore").innerHTML = 'See less';
    }
    else {
        document.getElementById("textarea").style.display = 'none';
        document.getElementById("seeMore").innerHTML = 'See more';        
    }
}*/
}

app.filter('payfilter', function() {
   return function( items, types) {    
    var filtered = [];
    var tmp = [];
    if (types) {
      
      for (var key in types) {
          if(types[key] == true){
            tmp.push(key);
         }
      }
    }
    
    angular.forEach(items, function(item) {      
      if (item.RoomFacility) {
        if (tmp.length>0) {
          for (var i = 0; i < tmp.length; i++) {
            if (item.RoomFacility.AcceptedCC.indexOf(tmp[i]) != -1) {
                filtered.push(item);       
            }
          }
        }else{
          filtered.push(item);
        }      
      }      
    });
  
    return filtered;
  };
});



app.filter('amtfilter', function() {
   return function( items, types) {
    var filtered = [];
    var tmp = [];
    if (types) {
      
      for (var key in types) {
          if(types[key] == true){
            tmp.push(key);
         }
      }
    }
    
    angular.forEach(items, function(item) {
      if (item.length>0&&tmp.length>0) {   
      var itemAvailable = false;     
        for (var i = 0; i < item.length; i++) {
          if (item[i].hasOwnProperty('RoomRate')) {
              for (var j = 0; j < tmp.length; j++) {
                var minMaxAmt = tmp[j].split('z');
                if (item[i].RoomRate >= minMaxAmt[1] && item[i].RoomRate <= minMaxAmt[2]) {
                    itemAvailable = true;  
                     break;     
                }
              }            
          }
        }
        if (itemAvailable == true) {
          filtered.push(item);  
        }
      }else{
        filtered.push(item);
      }      
    });        
    // $('.loading').fadeIn();
    // $('.loading').fadeOut();
    return filtered;
  };
});


app.filter('starfilter', function() {
   return function( items, types) {
    var filtered = [];
    var tmp = [];
    
    angular.forEach(items, function(item) {
      if (types) {   
      var itemAvailable = false;     
        for (var i = 0; i < item.length; i++) {
          if (item[i].hasOwnProperty('StarRating')) {
              if (item[i].StarRating == types) {              
                itemAvailable = true;  
                break;          
              }
          }
        }
        if (itemAvailable == true) {
          filtered.push(item);  
        }
      }else{
        filtered.push(item);
      }      
    });        
    // $('.loading').fadeIn();
    // $('.loading').fadeOut();
    return filtered;
  };
});


app.directive('myPostRepeatDirective', function() {
  return function(scope, element, attrs) {
    if (scope.$first){
      $('.loading').fadeIn();
    }
    if (scope.$last){
        setTimeout(function(){  
         initializeScript();
          $('.loading').fadeOut();
        },1000)   
    }
  };
});

app.directive('lightgallery', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      if (scope.$last) {
        // ng-repeat is completed
        $('[data-fancybox]').fancybox({
          protect: true
        });        
      }
    }
  };
});