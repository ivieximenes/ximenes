// $Revision: 15132 $ $Date: 2013-02-19 17:55:39 -0300 (Tue, 19 Feb 2013) $
window.LumisLightBox = (function($)
{
	var $_LumDefaultFancyBoxOptions = 
	{
		'width'				: 850,
		'height'			: 600,
	    'autoScale'     	: true,
	    'transitionIn'		: 'fade',
		'transitionOut'		: 'fade',
		'type'				: 'iframe'	
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
