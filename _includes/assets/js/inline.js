$(document).ready(function(){
	
	//Check to see if the window is top if not then display button
	$(window).scroll(function(){
		if ($(this).scrollTop() > 100) {
			$('.scrollToTop').fadeIn();
		} else {
			$('.scrollToTop').fadeOut();
		}
	});
	
	//Click event to scroll to top
	$('.scrollToTop').click(function(){
		$('html, body').animate({scrollTop : 0},800);
		return false;
	});
	
});	  


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
