/* $Revision: 17445 $ $Date: 2015-06-24 14:29:22 -0300 (Wed, 24 Jun 2015) $ */
(function($)
{
	// if doesn't have an opener, do nothing
	if(window.opener == null || window.opener == undefined)
		return;
	
	$(document).ready(function() // after the DOM is ready
	{
		// the amount of time (in milliseconds) the script will be executed
		var scriptDuration = 2000;
		
		// the amount of time (in milliseconds) the script will wait before run again
		var pauseBetweenExecutions = 100;

		// the last size the window assumed
		var lastResizeToW = -1;
		var lastResizeToH = -1;
		
		var lastMoveToX = -1;
		var lastMoveToY = -1;
		
		// the script body
		var f = function()
		{
			// window's current width
			var currentW;
			
			// resize target size
			var resizeToW;
			var resizeToH;
			
			// content delta to fit window's outer size
			var deltaW;
			var deltaH;
			
			// window current position
			var windowX;
			var windowY;
			
			// user's screen size
			var screenW;
			var screenH;
			
			// page's content size
			var contentW;
			var contentH;
			
			// translation position
			var translationX;
			var translationY;
			
			// calculate currentW, deltaW and deltaH
			if (window.outerWidth && window.outerHeight && window.innerWidth && window.innerHeight)
			{
				deltaW = window.outerWidth - window.innerWidth;
				deltaH = window.outerHeight - window.innerHeight;
				currentW = window.outerWidth;
			}
			else
			{
				// it is a try to make the window size correct for IE 8
				deltaW = 0;
				deltaH = 160;
				
			 	if(document.documentElement && document.documentElement.offsetWidth)
			 	{
			 		currentW = document.documentElement.offsetWidth;
			 	}
			 	else if(document.body && document.body.offsetWidth)
			 	{
			 		currentW = document.body.offsetWidth;
			 	}
 				else
					return;
			}

			// calculate windowW and windowH
			if(window.screenX && window.screenY)
			{
				windowX = window.screenX;
				windowY = window.screenY;
			}
			else if(window.screenLeft && window.screenTop)
			{
				windowX = window.screenLeft;
				windowY = window.screenTop;
			}
			else
			{
				// consider the window to be at (0, 0)
				windowX = 0;
				windowY = 0;
			}

			// initializes the translation position as the window's current position
			translationX = windowX;
			translationH = windowY;
			
			// calculate screenW and screenH
			screenW = window.screen.availWidth;
			screenH = window.screen.availHeight;
			
			// calculate contentW and contentH
			contentW = $(document).width();
			contentH = $(document).height();
			
			// checks whether a horizontal resize should be performed
			resizeToW = currentW;
			if(resizeToW < contentW + deltaW)
			{
				resizeToW = contentW + deltaW;
			}
			
			resizeToH = contentH + deltaH;
			
			// checks whether the resize target size is bigger than the user's screen
			if(resizeToW > screenW)
			{
				resizeToW = screenW;
			}
			if(resizeToH > screenH)
			{
				resizeToH = screenH;
			}
			
			// fix for IE 8: never decrease the window width
			if(resizeToW < lastResizeToW)
				resizeToW = lastResizeToW;
			
			// checks whether a translation should be performed
			var translate = false;
			if(windowX + resizeToW > screenW)
			{
				translate = true;
				translationX = Math.floor((screenW - resizeToW) / 2);
			}
			if(windowY + resizeToH > screenH)
			{
				translate = true;
				translationY = Math.floor((screenH - resizeToH) / 2);
			}
			
			// if the window size should be changed
			if(resizeToW != lastResizeToW || resizeToH != lastResizeToH)
			{
				// execute in try-catch because IE throws an exception if resizeTo or moveTo 
				// is invoked while user is pressing mouse button
				try
				{
					// perform translation if needed
					if(translate)
					{
						if(translationX != lastMoveToX || translationY != lastMoveToY)
						{
							window.moveTo(translationX, translationY);
							lastMoveToX = translationX;
							lastMoveToY = translationY;
						}
					}

					// perform the resize
					if (screenH != resizeToH || screenW != resizeToW)
					{
						window.resizeTo(resizeToW, resizeToH);
					}
				}
				catch(e)
				{
				}
			}

			// update the last window size
			lastResizeToW = resizeToW;
			lastResizeToH = resizeToH;
			
			// if the script execution hasn't reach the script duration yet, schedule a new execution
			if(new Date().getTime() < beginOfExecution + scriptDuration)
				window.setTimeout(f, pauseBetweenExecutions);
		};
		
		// the start time of script execution
		var beginOfExecution = new Date().getTime();
		
		// start the script
		f();
	});
})($);