 $(document).on('ready', function() {
              $(".regular").slick({
                dots: true,
                infinite: true,
                slidesToShow: 3,
                slidesToScroll: 3,
            autoplay: true,
                autoplaySpeed: 1500,
            arrows: false,
            dots: false,
            responsive: [
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
                infinite: true,
                dots: false
              }
            },
            {
              breakpoint: 600,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2
              }
            }
            // You can unslick at a given breakpoint now by adding:
            // settings: "unslick"
            // instead of a settings object
          ]
              });
           });  
            (function( $ ) {
                $(document).ready(function(){
                    $('.form').hide();
                    $('#form4').show();
                    $('.f-item:nth-child(1)').addClass('active');
                    $('.f-item:nth-child(1) span').addClass('checked');     
         
                    $('#hero-gallery').lightSlider({
                        gallery:true,
                        item:1,
                        pager:false,
                        gallery:false,
                        slideMargin: 0,
                        speed:2000,
                        pause:6000,
                        mode: 'fade',
                        auto:true,
                        loop:true,
                        onSliderLoad: function() {
                            $('#hero-gallery').removeClass('cS-hidden');
                        }  
                    });         
                });
            })(jQuery);