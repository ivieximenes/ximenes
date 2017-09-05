// $Revision: 14351 $ $Date: 2012-06-01 16:36:54 -0300 (Fri, 01 Jun 2012) $
$(document).ready(function() {
	var lightboxclicker = $('#lumHiddenLightBoxClicker');
	if(lightboxclicker.length <= 0){
		$('body').append('<a id="lumHiddenLightBoxClicker" href="http://asdf.com" style="display:none">Hidden Lightbox Clicker</a>');
	}
	 
	$("#lumHiddenLightBoxClicker").fancybox({
		'width'				: 850,
		'height'			: 600,
	    'autoScale'     	: false,
	    'transitionIn'		: 'none',
		'transitionOut'		: 'none',
		'type'				: 'iframe'
	});
});

function lumCallLightBox(custom_href){
	window.setTimeout('lumCallLightBox_internal(\''+custom_href+'\')', 1000);
}

function lumCallLightBox_internal(custom_href) 
{
	var lightboxclicker = $('#lumHiddenLightBoxClicker');
	if(lightboxclicker.length > 0){
		lightboxclicker.attr("href", custom_href);
		lightboxclicker.trigger('click');
	}
	
}
		
