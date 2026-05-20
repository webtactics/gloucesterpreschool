
 	  
$(document).foundation();
$('.off-canvas a').on('click', function() {
  $('.off-canvas').foundation('close');
});

$(function() {
    var header = $(".navbackground");
  
    $(window).scroll(function() {    
        var scroll = $(window).scrollTop();
        if (scroll >= 56) {
            header.addClass("scrolled");
        } else {
            header.removeClass("scrolled");
        }
    });
  
});

$('.home-slide').slick({
autoplay: true,
infinite: true,
pauseOnHover: true,
swipeToSlide: true,
autoplaySpeed: 6000,
speed: 3000,
arrows: false,
dots: true,
fade: true,
cssEase: 'ease'
  });
