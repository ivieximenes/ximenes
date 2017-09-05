/**
 * $Revision: 14030 $ $Date: 2012-02-13 13:44:24 -0200 (Mon, 13 Feb 2012) $
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
