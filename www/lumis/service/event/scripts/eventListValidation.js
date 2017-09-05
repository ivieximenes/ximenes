/*
 * $Revision: 14237 $ $Date: 2012-04-24 19:01:42 -0300 (Tue, 24 Apr 2012) $
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