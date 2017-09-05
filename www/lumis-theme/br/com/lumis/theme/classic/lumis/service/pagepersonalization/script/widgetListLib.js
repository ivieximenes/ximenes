// $Revision: 15676 $ $Date: 2013-08-01 18:24:35 -0300 (Thu, 01 Aug 2013) $
(function($)
		{
	$.fn.infiniteCarousel = function () 
	{

    function repeat(str, num) 
    {
        return new Array( num + 1 ).join( str );
    }
  
    return this.each(function () 
	{
        var $wrapper = $('> div', this).css('overflow', 'hidden'),
            $slider = $wrapper.find('> ul'),
            $items = $slider.find('> li'),
            $single = $items.filter(':first'),
            
            singleWidth = $single.outerWidth(), 
            visible = Math.ceil($wrapper.innerWidth() / singleWidth), // note: doesn't include padding or border
            currentPage = 1,
            pages = Math.ceil($items.length / visible);            


        // 1. Pad so that 'visible' number will always be seen, otherwise create empty items
        if (($items.length % visible) != 0) 
        {
            $slider.append(repeat('<li class="empty" />', visible - ($items.length % visible)));
            $items = $slider.find('> li');
        }

        // 2. Top and tail the list with 'visible' number of items, top has the last section, and tail has the first
        $items.filter(':first').before($items.slice(- visible).clone().addClass('cloned'));
        $items.filter(':last').after($items.slice(0, visible).clone().addClass('cloned'));
        $items = $slider.find('> li'); // reselect
        
        // 3. Set the left position to the first 'real' item
        $wrapper.scrollLeft(singleWidth * visible);
        
        // 4. paging function
        function gotoPage(page) 
        {
            var dir = page < currentPage ? -1 : 1,
                n = Math.abs(currentPage - page),
                left = singleWidth * dir * visible * n;
            
            $wrapper.filter(':not(:animated)').animate(
            {
                scrollLeft : '+=' + left
            }, 500, function () 
            {
                if (page == 0) 
                {
                    $wrapper.scrollLeft(singleWidth * visible * pages);
                    page = pages;
                } 
                else if (page > pages) 
                {
                    $wrapper.scrollLeft(singleWidth * visible);
                    // reset back to start position
                    page = 1;
                } 

                currentPage = page;
            }
            );                
            
            return false;
        }
        
        $wrapper.after('<a href="javascript:;" class="arrow back">&lt;</a><a href="javascript:;" class="arrow forward">&gt;</a>');
        
        // 5. Bind to the forward and back buttons
        $('a.back', this).click(function () 
        {
            return gotoPage(currentPage - 1);                
        }
        );
        
        $('a.forward', this).click(function () 
        {
            return gotoPage(currentPage + 1);
        }
        );
        
        // create a public interface to move to a specific page
        $(this).bind('goto', function (event, page) 
        {
            gotoPage(page); 
        }
        );
    }
    );  
};
}
)(jQuery);

//toggle widgets
/*
raph: as chamadas para infiniteCarousel() estao sendo feitas abaixo porque esse script tem algum conflito com o script de infinite carousel, de modo que sempre entrava na segunda pagina do scrolling
*/

function f_scrollTop() 
{
	return f_filterResults (
	window.pageYOffset ? window.pageYOffset : 0,
	document.documentElement ? document.documentElement.scrollTop : 0,
	document.body ? document.body.scrollTop : 0
	);
}

function f_filterResults(n_win, n_docel, n_body) 
{
	var n_result = n_win ? n_win : 0;
	if (n_docel && (!n_result || (n_result > n_docel)))
	{
		n_result = n_docel;
	}
	return n_body && (!n_result || (n_result > n_body)) ? n_body : n_result;
}

(function($)
{
	$(document).ready(function()
	{
	$(".lum-widget-toggle a.hide").hide();
	
	//fix the widget bar in the corret place considering the current perspective.
	if(g_LumisDisplayMode == g_LumisViewMode)
	{
		$("#lumfixed").prependTo($("body"));
	}
	else if(g_LumisDisplayMode == g_LumisAdminMode)
	{
		$("#lumfixed").prependTo($("#LumisAdminWorkPaneBody"));
	}
	else
	{
		$("#lumfixed").prependTo("#lumDivContainer");
	}
	
	var lumPersonalizationModeBarHeight = 29;
	var lumPublisherPerspectiveBarHeight = 29;
	
	$(".lum-widget-toggle a.show").click(function() 
	{
		// show widgets
		// ie6/ie7 has bug with slideDown()
		if ( $.browser.msie && parseInt($.browser.version, 10)=='6' ) 
		{
			$("#lumwidget").show();
		} 
		else if ( $.browser.msie && parseInt($.browser.version, 10)=='7' ) 
		{
			$("#lumwidget").show();
		} 
		else 
		{
			$("#lumwidget").slideDown(350);
		}
		if(g_LumisDisplayMode == g_LumisPersonalizationMode)
		{
			var positionTop = f_scrollTop();
			if(g_LumisDisplayMode == g_LumisPersonalizationMode)
				positionTop -= (lumPersonalizationModeBarHeight + lumPublisherPerspectiveBarHeight);
			else
				positionTop -= lumPublisherPerspectiveBarHeight;
			$("#lumfixed").css('top', positionTop);
		}
		// hide/show links
		$(".lum-widget-toggle a.show").hide();
		$(".lum-widget-toggle a.hide").show();

		LumisPagePersonalizationFrontend.enableDragability();
		
		if(g_LumisDisplayMode == g_LumisPersonalizationMode)
		{
			$("#lumSubBar").show("blind");
		}
		
		$(".back").click();
		$(".forward").click();
	}
	);
	
	$(".lum-widget-toggle a.hide").click(function() 
	{
		// hide widgets		
		// ie6/ie7 has bug with slideDown()
		if ( $.browser.msie && parseInt($.browser.version, 10)=='6' ) 
		{
			$("#lumwidget").hide();
		} 
		else if ( $.browser.msie && parseInt($.browser.version, 10)=='7' ) 
		{
			$("#lumwidget").hide();
		} 
		else 
		{
			$("#lumwidget").slideUp(100);
		}
		if(g_LumisDisplayMode == g_LumisPersonalizationMode)
		{
			var positionTop = f_scrollTop();
			$("#lumfixed").css('top', positionTop-= lumPublisherPerspectiveBarHeight);
		}
		// hide/show links
		$(".lum-widget-toggle a.hide").hide();
		$(".lum-widget-toggle a.show").show();

		LumisPagePersonalizationFrontend.disableDragability();
		
		if(g_LumisDisplayMode == g_LumisPersonalizationMode)
		{
			$("#lumSubBar").css('display','none');
		}
	}
	);
	
	$("#lumfixed").css('display', 'block');
	
	$(window).scroll(function () 
	{
		$(".lum-widget-toggle").hide();
		var positionTop = f_scrollTop();
		
		if (g_LumisDisplayPerspective == g_LumisPublisherPerspective)
		{
			if(g_LumisDisplayMode == g_LumisPersonalizationMode)
			{
				if($_pagePersonalizationInEditMode)
					positionTop -= (lumPersonalizationModeBarHeight + lumPublisherPerspectiveBarHeight);
				else
					positionTop -= lumPublisherPerspectiveBarHeight;
			}
			else
				positionTop -= lumPublisherPerspectiveBarHeight;
		}

		if (positionTop > 0)
		{	
			$("#lumfixed").css('position', 'absolute');
		}
		else
		{
			positionTop = 0;
			$("#lumfixed").css('position', '');
		}
		$("#lumfixed").css('top', positionTop+'px');
		$(".lum-widget-toggle").show();
	}
	);
	if(g_LumisDisplayMode == g_LumisPersonalizationMode)
		$("#originalConfiguration").css('display', 'none');
	//call iCar script
	$('.jq-icar').infiniteCarousel();
}
);
}
)(jQuery);
