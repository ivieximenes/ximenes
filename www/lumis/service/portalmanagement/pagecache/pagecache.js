// $Revision: 13134 $ $Date: 2011-06-13 18:33:38 -0300 (Mon, 13 Jun 2011) $
function loadValues(id)
{
	var arrayValues = new Array();
	var value = $('#'+id).val();
	if(value.length > 0)
	{
		var newValue = value.substring(10, (value.length-11));
		arrayValues = newValue.split('</itemName><itemName>');
	}
	
	return arrayValues;
}