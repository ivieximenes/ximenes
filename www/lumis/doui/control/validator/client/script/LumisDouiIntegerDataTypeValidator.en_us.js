function LumisValidateInteger_en_us(value, min, max)
{
	if (value.indexOf(".") > -1)
		return 1;
	var arrSegments = value.split(",");
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
	
	var pattern = new RegExp("\\.", "gi");
	var intValue = parseInt(value.replace(pattern, ""));
	if (isNaN(intValue))
		return 1;
	if (min != null && intValue < min)
		return 2;
	if (max != null && intValue > max)
		return 3;
	return 0;
}