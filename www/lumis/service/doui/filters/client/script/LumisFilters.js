/** 
 * $Revision: 13971 $ $Date: 2012-01-26 15:06:24 -0200 (Thu, 26 Jan 2012) $
 */

var LumisFilters = new LumisFilters();

$(document).ready(function(){
	LumisFilters.usingOriginalConfigClick();
});

function LumisFilters()
{
	this.checkNewFilterId = checkNewFilterId;
	this.addFilter = addFilter;
	this.addFilterRow = addFilterRow;
	this.editFilter = editFilter;
	this.editFilterRow = editFilterRow;
	this.removeSelectedFilters = removeSelectedFilters;
	this.usingOriginalConfigClick = usingOriginalConfigClick;
	this.moveUp = moveUp;
	this.moveDown = moveDown;
	this.setRowClass = setRowClass;
	
	function checkNewFilterId(newFilterId)
	{
		var $pSameIdFilterNode = '';
		if(newFilterId != '')
		{
			var $filters = getNodeFromXML(pForm.elements['filtersDefinition'].value, 'filters');
			$pSameIdFilterNode = $filters.find('#'+newFilterId);
		}
		return $pSameIdFilterNode.length == 0;
	}
	
	function addFilter(strXmlFilter, strNewFilterFieldName)
	{
		var $xmlDoc = $.parseXML( pForm.elements['filtersDefinition'].value );
		var $filters = getNodeFromXML($xmlDoc, 'filters');

		var $filter = getNodeFromXML(strXmlFilter, "filter");
		$filters.append($filter);
		
		pForm.elements['filtersDefinition'].value = getXMLString($xmlDoc);
		addFilterRow(strXmlFilter, strNewFilterFieldName);
		
		pForm.elements['usingOriginalConfig'].checked = false;
		
		usingOriginalConfigClick();
	}
	
	function addFilterRow(strXmlFilter, strNewFilterFieldName)
	{
		var $filter = getNodeFromXML(strXmlFilter, "filter");
		var strNewFilterId = $filter.attr("id");
				
		var strNewFilterFieldId = $filter.attr("fieldId");
		if(strNewFilterFieldId == null)
			strNewFilterFieldId = strNewFilterId;
		
		var strNewFilterDefaultValue = $filter.attr("defaultValue");
		if(strNewFilterDefaultValue == null)
			strNewFilterDefaultValue = "";
		else if(arrDefaultValue[strNewFilterDefaultValue])
			strNewFilterDefaultValue = arrDefaultValue[strNewFilterDefaultValue];
		
		var strNewFilterHidden = $filter.attr("hidden");
		if(strNewFilterHidden != "true")
			strNewFilterHidden = arrStrings["no"];
		else
			strNewFilterHidden = arrStrings["yes"];
		
		var strNewFilterOperator = $filter.attr("operator");
		strNewFilterOperator = arrOperator[strNewFilterOperator];
	
		var rowContent = '<tr>' +
				'<td class="cLumTableAdminCell"><input type="checkbox" name="filterAdminList.tabulardata" value="'+strNewFilterId+'"/></td>' +
				'<td class="cLumTableAdminCell">'+strNewFilterFieldName+'</td>' +
				'<td class="cLumTableAdminCell">'+strNewFilterDefaultValue+'</td>' +
				'<td class="cLumTableAdminCell">'+strNewFilterHidden+'</td>' +
				'<td class="cLumTableAdminCell">'+strNewFilterOperator+'</td></tr>';
		
		$('#filtersTable tbody').append(rowContent);
		
		setRowClass();
	}
	
	function editFilter(strXmlFilter, strNewFilterFieldName)
	{
		var $xmlDoc = $.parseXML( pForm.elements['filtersDefinition'].value );
		var $filters = getNodeFromXML($xmlDoc, 'filters');

		var $filter = getNodeFromXML(strXmlFilter, "filter");
		var $pOldFilterNode = $filters.find('#' + $filter.attr("id"));
		
		$pOldFilterNode.replaceWith($filter);
		$pOldFilterNode.remove();
		
		pForm.elements['filtersDefinition'].value = getXMLString($xmlDoc);
		
		editFilterRow(strXmlFilter, strNewFilterFieldName);
		
		pForm.elements['usingOriginalConfig'].checked = false;
		
		usingOriginalConfigClick();
	}
	
	function editFilterRow(strXmlFilter, strNewFilterFieldName)
	{
		var $filter = getNodeFromXML(strXmlFilter, "filter");
	
		var strEditedFilterId = $filter.attr("id");
		
		var strEditedFilterFieldId = $filter.attr("fieldId");
		if(strEditedFilterFieldId == null)
			strEditedFilterFieldId = strEditedFilterId;
		
		var strEditedFilterDefaultValue = $filter.attr("defaultValue");
		if(strEditedFilterDefaultValue == null)
			strEditedFilterDefaultValue = "";
		else if(arrDefaultValue[strEditedFilterDefaultValue])
			strEditedFilterDefaultValue = arrDefaultValue[strEditedFilterDefaultValue];
		
		var strEditedFilterHidden = $filter.attr("hidden");
		if(strEditedFilterHidden != "true")
			strEditedFilterHidden = arrStrings["no"];
		else
			strEditedFilterHidden = arrStrings["yes"];
		
		var strEditedFilterOperator = $filter.attr("operator");
		strEditedFilterOperator = arrOperator[strEditedFilterOperator];
	
		var $pElements = document.getElementsByName("filterAdminList.tabulardata");
		if(!$pElements.length)
		{
			var $pFilterFieldCell = $(this).parent().next();
			var $pDefaultValueCell = $pFilterFieldCell.next();
			var $pHiddenCell = $pDefaultValueCell.next();
			var $pOperatorCell = $pHiddenCell.next();
			
			$pFilterFieldCell.html(strNewFilterFieldName);
			$pDefaultValueCell.html(strEditedFilterDefaultValue);
			$pHiddenCell.html(strEditedFilterHidden);
			$pOperatorCell.html(strEditedFilterOperator);
		}
		else
		{
			$($pElements).each(function(){
				if($(this).val() == strEditedFilterId)
				{											
					var $pFilterFieldCell = $(this).parent().next();
					var $pDefaultValueCell = $pFilterFieldCell.next();
					var $pHiddenCell = $pDefaultValueCell.next();
					var $pOperatorCell = $pHiddenCell.next();
					
					$pFilterFieldCell.html(strNewFilterFieldName);
					$pDefaultValueCell.html(strEditedFilterDefaultValue);
					$pHiddenCell.html(strEditedFilterHidden);
					$pOperatorCell.html(strEditedFilterOperator);
					
					return false;
				}
			});
		}
	}
	
	function removeSelectedFilters()
	{
		var $xmlDoc = $.parseXML( pForm.elements['filtersDefinition'].value );
		var $filters = getNodeFromXML($xmlDoc, 'filters');
		
		var $pElements = document.getElementsByName("filterAdminList.tabulardata");
		$($pElements).each(function()
		{
			if(this.checked)
			{
				var $pFilterNode = $filters.find('#'+this.value);
				$pFilterNode.remove();
			
				var $pRow = $(this).parent().parent();
				$pRow.remove();
			}
		});
		
		pForm.elements['filtersDefinition'].value = getXMLString($xmlDoc);
		setRowClass();
		
		pForm.elements['usingOriginalConfig'].checked = false;
		usingOriginalConfigClick();
	}
	
	function usingOriginalConfigClick()
	{
		var $pElements = document.getElementsByName("filterAdminList.tabulardata");
	
		var bDisabled = false;
		if($('#usingOriginalConfig').prop("checked"))
			bDisabled=true;
		
		var toggleSelectionChk = document.getElementById('filterAdminList.tabulardata.toggleSelection');
		if(toggleSelectionChk != null)
			toggleSelectionChk.disabled = bDisabled;
		
		if(bDisabled && toggleSelectionChk != null)
			toggleSelectionChk.checked = false;
		
		if($pElements.length > 0)
		{
			$($pElements).each(function()
			{
				this.disabled = bDisabled;
				if(bDisabled)
				{
					this.checked = false;
				}
			});
		}
	}
	
	function moveUp()
	{
		var $pElements = document.getElementsByName("filterAdminList.tabulardata");
		var $xmlDoc = $.parseXML( pForm.elements['filtersDefinition'].value );
		var $filters = getNodeFromXML($xmlDoc, 'filters');
		
		$($pElements).each(function()
		{
			if(this.checked)
			{
				var $pFilterNode = $filters.find('#'+this.value);
				var $pPreviousFilterNode = $pFilterNode.prev();
				
				if($pPreviousFilterNode.is('filter'))
				{
					$pFilterNode.insertBefore($pPreviousFilterNode);
				}
				
				var $pRow = $(this).parent().parent();
				var $pPreviousRow = $pRow.prev();
				
				if($pPreviousRow)
				{
					$pRow.insertBefore($pPreviousRow);
				}
			}
		});
		
		pForm.elements['filtersDefinition'].value = getXMLString($xmlDoc);
		setRowClass();
		
		pForm.elements['usingOriginalConfig'].checked = false;
		usingOriginalConfigClick();
	}
	
	function moveDown()
	{
		var $pElements = document.getElementsByName("filterAdminList.tabulardata");
		var $xmlDoc = $.parseXML( pForm.elements['filtersDefinition'].value );
		var $filters = getNodeFromXML($xmlDoc, 'filters');
		
		$($pElements).each(function()
		{
			if(this.checked)
			{
				var $pFilterNode = $filters.find('#'+this.value);
				var $pNextFilterNode = $pFilterNode.next();

				if($pNextFilterNode.is('filter'))
				{
					$pFilterNode.insertAfter($pNextFilterNode);
				}
			
				var $pRow = $(this).parent().parent();
				var $pNextRow = $pRow.next();
				
				if($pNextRow.is('tr'))
				{
					$pRow.insertAfter($pNextRow);
				}
				return false;
			}
		});
		
		pForm.elements['filtersDefinition'].value = getXMLString($xmlDoc);
		setRowClass();
		
		pForm.elements['usingOriginalConfig'].checked = false;
		usingOriginalConfigClick();
	}
	
	function setRowClass()
	{
		var $pElements = $('#filtersTable tbody').children();
		$($pElements).each(function(i)
		{
			if(i%2 != 0)
			{
				this.className = "cLumEvenRow";
			}
			else
			{
				this.className = "";
			}
		});
	}
	
	function getNodeFromXML(xmlDoc, Node)
	{
		var $Node;
		if($.type(xmlDoc) == 'string')
		{
			$Node = $( $.parseXML( xmlDoc ) ).find( Node );
		}
		else
		{
			$Node = $( xmlDoc ).find( Node );
		}		    
		return $Node;
	}
	
	function getXMLString(xmlDoc)
	{
		var xmlString;
		//for IE
		if (window.ActiveXObject) 
		{
		    xmlString = xmlDoc.xml;
		 }
		// code for Mozilla, Firefox, Opera, etc.
		else 
		{
		   xmlString = (new XMLSerializer()).serializeToString(xmlDoc);
		}
		return xmlString;
	}
}