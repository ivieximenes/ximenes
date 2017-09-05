// $Revision: 16136 $ $Date: 2014-02-13 18:57:25 -0200 (Thu, 13 Feb 2014) $
(function($)
{
	$(document).ready(function($)
	{
		var $widgetList = $(".lumis-service-pagepersonalization-widgetList");
		
		if(g_LumisDisplayMode == "3") // edição em contexto
			return;
		
		//fix the widget bar in the correct place considering the current mode
		if(g_LumisDisplayMode == g_LumisViewMode)
		{
			$widgetList.prependTo($("body"));
		}
		else if(g_LumisDisplayMode == g_LumisAdminMode)
		{
			$widgetList.prependTo($("#LumisAdminWorkPaneBody"));
		}
		else
		{
			$widgetList.prependTo("#lumDivContainer");
		}
		
		$widgetList.find(".lum-expand").click(function() 
		{
			$widgetList.addClass('lum-expanded');
			$widgetList.removeClass('lum-collapsed');
	
			LumisPagePersonalizationFrontend.enableDragability();
			
			if(g_LumisDisplayMode == g_LumisPersonalizationMode)
			{
				$("#lumSubBar").show("blind");
			}
			
			return false;
		});
		
		$widgetList.find(".lum-collapse").click(function() 
		{
			$widgetList.removeClass('lum-expanded');
			$widgetList.addClass('lum-collapsed');
	
			LumisPagePersonalizationFrontend.disableDragability();
			
			if(g_LumisDisplayMode == g_LumisPersonalizationMode)
			{
				$("#lumSubBar").hide("blind");
			}
			
			return false;
		});
		
		$(window).scroll(function () 
		{
			var positionTop = $(document).scrollTop() - $widgetList.offsetParent().offset().top;
			if (positionTop > 0)
				$widgetList.css('top', positionTop+'px').css('position', 'relative');
			else
				$widgetList.css('position', 'static');
		});
		
		$widgetList.show();
	});
})(jQuery);