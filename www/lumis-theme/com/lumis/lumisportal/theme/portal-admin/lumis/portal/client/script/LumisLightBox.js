// $Revision: 15477 $ $Date: 2013-06-14 09:25:11 -0300 (Fri, 14 Jun 2013) $
window.LumisLightBox = (function($)
{
	var $_LumDefaultFancyBoxOptions = 
	{
		'width'				: 900,
		'height'			: 600,
		'padding'			: 0,
	    'autoScale'     	: true,
	    'transitionIn'		: 'fade',
		'transitionOut'		: 'fade',
		'type'				: 'iframe',
		'showCloseButton'	: false,
		'hideOnOverlayClick': false
	};
	
	function lumCallLightBox_internal(custom_href, options) 
	{
		var id = "myLightBoxClicker" + (new Date().getTime());
		$('body').append('<a id="' + id + '" href="' + custom_href + '" style="display:none">Hidden Lightbox Clicker</a>');
		var lightboxclicker = $("#" + id);
		lightboxclicker.fancybox(options);
		lightboxclicker.trigger('click');
		lightboxclicker.remove();
	}

	return (
	{
		open : function(custom_href, options)
		{
			lumCallLightBox_internal(custom_href, $.extend({}, $_LumDefaultFancyBoxOptions, options));
		},
		close : function()
		{
			$.fancybox.close();
		}
	});
})(jQuery);
