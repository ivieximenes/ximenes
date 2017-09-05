/**
 * $Revision: 15411 $ $Date: 2013-05-31 16:39:34 -0300 (Fri, 31 May 2013) $
 */
//events toggle filter layer 
$(document).ready(function(){
	$(".jq-filter-toggle").click(function() {
		//toggle selected
		$(this).toggleClass("selected");
		//toggle layer visibility
		$(this).parent().find(".events-filter-layer").slideToggle(150);
	})
});
