function LumisValidateLength(value, min, max)
{
	if (min != null && value.length < min)
		return 1;
	if (max != null && value.length > max)
		return 2;
	return 0;
}