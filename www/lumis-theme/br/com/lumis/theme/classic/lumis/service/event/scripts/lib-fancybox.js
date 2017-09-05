/**
 * $Revision: 15411 $ $Date: 2013-05-31 16:39:34 -0300 (Fri, 31 May 2013) $
 */
// fancybox links
$(document).ready(function() {
	// pop-calendar
	$("a.jq-pop-calendar").fancybox({
		'padding'		    : 0,
		'titleShow'		    : false,
		'overlayColor'		: '#ccc',
		'overlayOpacity'	: 0.5
	});	
	
	// pop1
	$("a.jq-pop1").fancybox({
		'padding'		    : 0,
		'titleShow'		    : false,
		'overlayColor'		: '#ccc',
		'overlayOpacity'	: 0.5
	});					
						   
	// generic data
	$("a.jq-fancy-gen").fancybox({
		'titlePosition'		: 'inside',
		'overlayColor'		: '#333',
		'overlayOpacity'	: 0.85 // attention: never leave a ',' on last items or it will break ie6 and ie7!
	});
	
	// embeeded videos
	$("a.jq-fancy-vid").fancybox({
		'transitionOut'		: 'none',
		'titlePosition'		: 'inside',
		'overlayColor'		: '#333',
		'overlayOpacity'	: 0.85,
		'onComplete'	    : function() {
			// force show title (chrome/safari)
			$("#fancybox-wrap").hover(function() {
				$("#fancybox-title").show();
			}, function() {
				$("#fancybox-title").show();
			});
		}
	});
	
	// helpful text
	$("a.jq-fancy-help").fancybox({
		'titleShow'		    : false,
		'overlayColor'		: '#333',
		'overlayOpacity'	: 0.85
	});
	
	// images with title toggle
	$("a.jq-fancy-img").fancybox({
		'titlePosition'	    : 'over',
		'overlayColor'		: '#333',
		'overlayOpacity'	: 0.85,
		'onComplete'	    : function() {
			// hide title
			$("#fancybox-title").hide();
			// toggle title
			$("#fancybox-wrap").hover(function() {
				$("#fancybox-title").show();
			}, function() {
				$("#fancybox-title").hide();
			});
		}
	});
	
	// image group with title toggle
	$("a[rel=jq-fancy-img-grp]").fancybox({
		'titlePosition' 	: 'over',
		'overlayColor'		: '#333',
		'overlayOpacity'	: 0.85,
		'onComplete'	    : function() {
			// toggle title
			$("#fancybox-wrap").hover(function() {
				$("#fancybox-title").show();
			}, function() {
				$("#fancybox-title").hide();
			});
		},
		'titleFormat'		: function(title, currentArray, currentIndex, currentOpts) {
			return '<span id="fancybox-title-over">(' + (currentIndex + 1) + '/' + currentArray.length + ') ' + (title.length ? ' &#160; ' + title : '') + '</span>';
		}
	});
});

// fancybox close button
$(document).ready(function() {
	$(".jq-pop-close").click(function() {					   
		$.fancybox.close();
	});
});		


