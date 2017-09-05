/**
 * @version $Revision: 14020 $ $Date: 2012-02-09 19:09:17 -0200 (Thu, 09 Feb 2012) $ 
 */ 
function LumisValidateInteger(value, min, max, decimalSeparator, thousandsSeparator)
{
	if (value.indexOf(decimalSeparator) > -1)
		return 1;

	var arrSegments = value.split(thousandsSeparator);
	var i;

	if(arrSegments.length > 1)
	{
		for (i = 0; i < arrSegments.length; i++)
		{
			if (arrSegments[i].length > 3)
				return 1;
			if (arrSegments[i].length < 3 && i > 0)
				return 1;
		}
	}
	
	var pattern = new RegExp("\\"+thousandsSeparator, "gi");
	
	var partialValue = value.replace(pattern, "");
	if (isNaN(partialValue))
	{
		return 1;
	}	
	
	var intValue = parseInt(partialValue);
	if (isNaN(intValue))
		return 1;
	if (min != null && intValue < min)
		return 2;
	if (max != null && intValue > max)
		return 3;
	return 0;
}