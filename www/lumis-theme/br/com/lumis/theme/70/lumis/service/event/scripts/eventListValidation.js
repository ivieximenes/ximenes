/*
 * $Revision: 15411 $ $Date: 2013-05-31 16:39:34 -0300 (Fri, 31 May 2013) $
 */
$(document).ready(function()
{
	$('.day-box .day-list').each(function()
	{
		if($(this).children().length != 0)
		{
			if($(this).outerHeight() > $(this).parent().height())
			{
				$(this).next().show(0);
			}
		}
	});
});