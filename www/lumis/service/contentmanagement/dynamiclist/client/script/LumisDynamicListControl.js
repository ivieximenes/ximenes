var curItem = null;

// $Revision: 7021 $ $Date: 2007-05-25 11:05:31 -0300 (Fri, 25 May 2007) $

function AddItem(strFormName, strControlId, strItemId, strItemName)
{
	var pTable = document.getElementById(strControlId+".list");
	
	// make sure the element does not already exist
	if(itemExists(strFormName, strControlId+".list", strItemId))
		return;
	
	var newRow = document.createElement("tr");
	
	pTable.firstChild.appendChild(newRow);
	
	var newCell1 = document.createElement("td");

	newRow.appendChild(newCell1);
	newCell1.width = "20";
	
	var cell1HTML = '<input type="checkbox" name="'+strControlId+'.list" value="'+strItemId+'"/>';
	cell1HTML += '<input type="hidden" name="'+strControlId+'.list.item" value="'+strItemId+'"/>';
	cell1HTML += '<input type="hidden" name="'+strControlId+'.list.itemName" value="'+strItemName+'"/>';
	
	newCell1.innerHTML = cell1HTML;
	
	var newCell2 = document.createElement("td");
	
	newRow.appendChild(newCell2);
	
	newCell2.innerHTML = strItemName;
}

function itemExists(strFormName, strListControlName, strItemId)
{
	var pForm = document.forms[strFormName];
	
	pElements = pForm.elements[strListControlName];
	
	if(pElements && !pElements.length)
	{
		if(pElements.value == strItemId)
			return true;
	}
	else if(pElements)
	{
		for(var i=0; i<pElements.length; i++)
		{
			if(pElements[i].value == strItemId)
				return true;
		}
	}
	
	return false;
}

function RemoveSelectedItems(strFormName, strListControlName)
{
	// TODO: VALIDATE SELECTION
	//LumisContentValidateSelection("selectedMany", strFormName, strListControlName, "STR_NONE_SELECTED");

	var pForm = document.forms[strFormName];
	
	pElements = pForm.elements[strListControlName];
	
	if(pElements && !pElements.length)
	{
		if(pElements.checked)
		{
			var pRow = pElements.parentElement.parentElement;
			pRow.parentElement.removeChild(pRow);
		}
	}
	else if(pElements)
	{
		for(var i=pElements.length-1; i>=0; i--)
		{
			if(pElements[i].checked)
			{
				var pRow = pElements[i].parentElement.parentElement;
				pRow.parentElement.removeChild(pRow);
			}
		}
	}
}

function MoveUp(strFormName, strListControlName)
{
	// TODO: VALIDATE SELECTION
	//LumisContentValidateSelection("selectedOne", strFormName, strListControlName, "STR_NONE_OR_TOO_MANY_ITEMS_SELECTED");
	
	var pForm = document.forms[strFormName];
	
	pElements = pForm.elements[strListControlName];
	
	if(pElements && pElements.length)
	{
		for(var i=pElements.length-1; i>0; i--)
		{
			if(pElements[i].checked)
			{
				var pRow = pElements[i].parentElement.parentElement;
				var pPreviousRow = pRow.previousSibling;
				var pTable = pRow.parentElement;

				pTable.removeChild(pRow);
				pTable.insertBefore(pRow,pPreviousRow);
				
				pElements[i-1].checked = true;
				
				break;
			}
		}
	}
}

function MoveDown(strFormName, strListControlName)
{
	// TODO: VALIDATE SELECTION
	//LumisContentValidateSelection("selectedOne", strFormName, strListControlName, "STR_NONE_OR_TOO_MANY_ITEMS_SELECTED");
	
	var pForm = document.forms[strFormName];
	
	pElements = pForm.elements[strListControlName];
	
	if(pElements && pElements.length)
	{
		for(var i=0; i<pElements.length-1; i++)
		{
			if(pElements[i].checked)
			{
				var pRow = pElements[i].parentElement.parentElement;
				var pNextRow = pRow.nextSibling.nextSibling;
				var pTable = pRow.parentElement;

				pTable.removeChild(pRow);
				pTable.insertBefore(pRow,pNextRow);
				
				pElements[i+1].checked = true;
				
				break;
			}
		}
	}
}