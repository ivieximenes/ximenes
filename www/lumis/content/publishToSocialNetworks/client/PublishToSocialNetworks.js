// $Revision: 13719 $ $Date: 2011-10-10 10:19:23 -0300 (Mon, 10 Oct 2011) $
/**
 * Add a row into a control.
 * @param controlId control identifier.
 * @param rowNode value to set.
 */
function addDataToControl(controlId, rowNode)
{
	var controlValue = $('#'+controlId).val();
	if(controlValue == '' || /<data\s*\/>/.test(controlValue))
		controlValue = "<data></data>";
	
	$('#'+controlId).val(controlValue.replace("<data>", "<data>"+rowNode));
}

/**
 * Update a row into a control.
 * @param controlId control identifier.
 * @param rowNode value to set.
 * @param rowId row identifier. 
 */
function updateDataFromControl(controlId, rowNode, rowId)
{
	removeRow(controlId, rowId);
	addDataToControl(controlId, rowNode);
}

/**
 * Updates the publish date of the selected data from control data.
 * @param controlId control identifier.
 * @param checkedName name of check boxes to get value. 
 */
function updatePublishDateDataFromControl(controlId, checkedName, time)
{
	$('input[name='+checkedName+']:checked').each(function(){
		var rowId = $(this).val();
		updatePublishDateRow(controlId, rowId, time);
	});
}

/**
 * Updates the publish date of a specific row from control data.
 * @param controlId control identifier.
 * @param rowId the row to be removed.
 */
function updatePublishDateRow(controlId, rowId, time)
{
	var dataNode = null;
	var xmlParsed = $.parseXML($('#'+controlId).val());
	$(xmlParsed).find("data row[id="+rowId+"]").each(function(){
		if(dataNode == null)
			dataNode = this.parentNode;
		
		$(this).find('date').each(function(){
			$(this).text(time);
		});
	});
	$('#'+controlId).val(documentToString(dataNode));
}

/**
 * Remove the selected data from control data.
 * @param controlId control identifier.
 * @param checkedName name of check boxes to get value. 
 */
function removeDataFromControl(controlId, checkedName)
{
	$('input[name='+checkedName+']:checked').each(function(){
			var rowId = $(this).val();
			removeRow(controlId, rowId);
		});
}

/**
 * Remove a specific row from control data.
 * @param controlId control identifier.
 * @param rowId the row to be removed.
 */
function removeRow(controlId, rowId)
{
	var dataNode = null;
	var xmlParsed = $.parseXML($('#'+controlId).val());
	$(xmlParsed).find("data row[id="+rowId+"]").each(function(){
		if(dataNode == null)
			dataNode = this.parentNode;
		
		$(this).remove();
	});
	$('#'+controlId).val(documentToString(dataNode));
}

/**
 * Returns the selected data from control data.
 * @param controlId control identifier.
 * @param checkedName name of check boxes to get value. 
 */
function getDataFromControl(controlId, checkedName)
{
	var result = "<data>";
	$('input[name='+checkedName+']:checked').each(function(){
			var rowId = $(this).val();
			result += getRow(controlId, rowId);
		});
	result += "</data>";
	return result;
}

/**
 * Gets a specific row from control data.
 * @param controlId control identifier.
 * @param rowId the row to be removed.
 */
function getRow(controlId, rowId)
{
	var result = "";
	var xmlParsed = $.parseXML($('#'+controlId).val());
	$(xmlParsed).find("data row[id="+rowId+"]").each(function(){
		result = documentToString(this);
	});
	return result;
}

/**
 * Serializes a XML data, converts the XML document object into XML string.
 * @param xmlData the XML to serializes.
 * @return a XML string. 
 */
function documentToString(xmlData)
{
	var string;
	if(typeof(XMLSerializer) != "undefined")
	{
		string = (new XMLSerializer()).serializeToString(xmlData);
	}
	else if (xmlData.xml)
	{
		string = xmlData.xml;
	} 
	else 
	{
		throw "Unsupported browser";
	}
	
	return string;
}
