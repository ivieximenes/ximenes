/** 
 * $Revision: 13971 $ $Date: 2012-01-26 15:06:24 -0200 (Thu, 26 Jan 2012) $
 */

var currentFilterType = -1;

$(document).ready(function(){
	onFilterTypeClicked(true);	
	onDefaultValueChanged();
});

function onFilterTypeClicked(renderingInterface)
{
	var pFilterType = document.getElementsByName("filterType");
		
	$(pFilterType).each(function(){
		if(this.checked){
			if(this.value == 'basic'){
				var currentFilterType = 0;
				if(!renderingInterface)
				{
					try
					{
						$filter = getNodeFromXML($('#filterXml').val(), 'filter');
						if(!window.confirm(arrStrings["advancedToBasic"]))
						{
							pFilterType[1].checked = "true";
							currentFilterType = 1;
							return;
						}
						
						copyFilterXmlToBasic();
					}
					catch(e)
					{
						alert(arrStrings["invalidXML"]);
						pFilterType[1].checked = "true";
						currentFilterType = 1;
						return;
					}
				}
				
				$('#basicFilterDiv').css('display','');
				$('#advancedFilterDiv').css('display','none');
			}
			else if (this.value == 'advanced')
			{
				currentFilterType = 1;
				copyFilterBasicToXml();
			
				$('#basicFilterDiv').css('display','none');
				$('#advancedFilterDiv').css('display','');
			}
		}
	});
	return;
}

function copyFilterXmlToBasic()
{
	$filter = getNodeFromXML($('#filterXml').val(), 'filter');

	if($filter.attr("id"))
		$('#filterId').val($filter.attr("id"));
	
	if($filter.attr("fieldId"))
		$('#filterField').val($filter.attr("fieldId"));
	
	if($filter.attr("operator"))	
		$('#operator').val($filter.attr("operator"));

	if($filter.attr("showItems"))								
		$('#showItems').val($filter.attr("showItems"));
	
	if($filter.attr("defaultValue"))
		$('#defaultValue').val($filter.attr("defaultValue"));
		
	if(!$('#defaultValue').val())
	{
		$('#defaultValueSelection').val("none");
		$('#defaultValue').css('visibility','hidden');
	}
	else if($('#defaultValue').val().substr(0,4) != "lum_")
	{
		$('#defaultValueSelection').val("other");
		$('#defaultValue').css('visibility','');
	}
	else
	{
		$('#defaultValueSelection').val($('#defaultValue').val());
		$('#defaultValue').css('visibility','hidden');
	}
	
	if($filter.attr("size"))
		$('#size').val($filter.attr("size"));
		
	if($filter.attr("hidden") && $filter.attr("hidden") == "true")
	{
		$('#hidden').prop('checked', true);
	}
	else
	{
		$('#hidden').prop('checked', false);
	}
}

function copyFilterBasicToXml()
{
	var strXmlFilter = '<filter';
	
	if($('#filterId').val())
		strXmlFilter += ' id="'+$('#filterId').val()+'"';
	
	if($('#filterField').val())
		strXmlFilter += ' fieldId="'+$('#filterField').val()+'"';
		
	if($('#operator').val())
		strXmlFilter += ' operator="'+$('#operator').val()+'"';
		
	if($('#showItems').val() && $('#showItems').val() != 'no')
		strXmlFilter += ' showItems="'+$('#showItems').val()+'"';
	
	if($('#defaultValueSelection').val() && $('#defaultValueSelection').val() != 'none')
		strXmlFilter += ' defaultValue="'+$('#defaultValue').val()+'"';
	
	if($('#size').val() && $('#size').val() != '')
		strXmlFilter += ' size="'+$('#size').val()+'"';
		
	if($('#hidden').prop('checked'))
		strXmlFilter += ' hidden="true"';
	
	strXmlFilter += "/>";
	
	$('#filterXml').val(strXmlFilter);
}

function onDefaultValueChanged()
{
	var pDefaultValueSelection = $('#defaultValueSelection').val();
	
	if(pDefaultValueSelection == "none")
	{
		$('#defaultValue').val('');
		$('#defaultValue').css('visibility','hidden');
	}
	else if(pDefaultValueSelection == "other")
	{
		$('#defaultValue').val('');
		$('#defaultValue').css('visibility','');
	}
	else
	{
		$('#defaultValue').val(pDefaultValueSelection);
		$('#defaultValue').css('visibility','hidden');
	}
}

function getNodeFromXML(xmlDoc, Node)
{
	var $Node = $( $.parseXML( xmlDoc ) ).find( Node );
	
	return $Node;
}