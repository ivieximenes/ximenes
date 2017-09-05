// $Revision: 7530 $ $Date: 2007-06-21 16:29:36 -0300 (Thu, 21 Jun 2007) $
function LumisValidateNumber(value, min, max, decimalSeparator, thousandsSeparator)
{
	// verify thousand separators
	var decimalSplit = value.split(decimalSeparator);
	if (decimalSplit.length == 0 || decimalSplit.length > 2)
		return 1;
	var arrSegments = decimalSplit[0].split(thousandsSeparator);
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

	// remove thousand separators	
	var thousandsPattern = new RegExp("\\"+thousandsSeparator, "gi");
	var value = value.replace(thousandsPattern, "");

	// replace decimal separator by '.'
	var decimalPattern = new RegExp("\\"+decimalSeparator, "gi");
	var value = value.replace(decimalPattern, ".");

	if (isNaN(value))
		return 1;
	if (min != null && parseFloat(value) < parseFloat(min))
		return 2;
	if (max != null && parseFloat(value) > parseFloat(max))
		return 3;
	return 0;
}