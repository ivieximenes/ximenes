/**
 * @version $Revision: 16310 $ $Date: 2014-06-30 13:26:43 -0300 (Mon, 30 Jun 2014) $ 
 * Returns true if the given control is visible to the end user.
*/
function LumisIsControlVisible(controlElement)
{
	var curElement = controlElement;
	
	if(curElement != null && !curElement.tagName && curElement.length > 0)
		curElement = curElement[0];
	
	while(curElement != null && curElement.tagName.toUpperCase() != "BODY")
	{
		if(curElement.style.display == "none" && !(curElement.tagName.toUpperCase() == "INPUT" && curElement.type.toUpperCase() == "HIDDEN"))
		{
			return false;
		}
			
		curElement = curElement.parentNode;
	}
	
	return true;
}
	