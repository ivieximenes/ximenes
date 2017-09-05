<%-- $Revision: 14807 $ $Date: 2012-10-09 16:16:15 -0300 (Tue, 09 Oct 2012) $ --%>
<%@ taglib uri="/WEB-INF/lumis/tld/lum.tld" prefix="lum" %>
<lum:addResource path="lumis/service/content/wizard/strings/strings"/>
<html>
<head>
<link ID="EztStylesheet" type="text/css" rel="stylesheet" href="webportal.css"/>
<link ID="EztStylesheet" type="text/css" rel="stylesheet" href="../../../portal/client/stylesheet/portaladmin.css"/>

<title><lum:message key="STR_ADVANCED_PROPERTY"/></title>
<script type="text/javascript" src="../../../tool/jquery/jquery.js"></script>
<script type="text/javascript"  language="JavaScript">
	var g_pGeneralTab; 
	var g_pOptionsTab; 
	var g_pForeignTableTab; 
	var caller;
	var fieldPrefix;
	var totalLines = 0;
	
	function initialize() 
	{
		//IE
		if(window.dialogArguments)
		{
			caller = window.dialogArguments[0];
			fieldPrefix = window.dialogArguments[1];
        }
		//FIREFOX
		else
		{
			caller = window.opener.fieldCaller;
			fieldPrefix = window.opener.fieldPrefix;
	    }
		g_pGeneralTab = document.getElementsByTagName("tabGeneral");
        g_pOptionsTab = document.getElementsByTagName("tabOptions");
        g_pForeignTableTab = document.getElementsByTagName("tabForeignTable");
        window.setTimeout(RefreshData, 1);
    } 
	
	function onTabClicked(strTabID) 
	{
        if (strTabID == "General") {
            g_pGeneralTab.style.display = "";
            g_pOptionsTab.style.display = "none";
            g_pForeignTableTab.style.display = "none";
        } else if (strTabID == "Options") {
            g_pGeneralTab.style.display = "none";
            g_pOptionsTab.style.display = "";
            g_pForeignTableTab.style.display = "none";
        } else if (strTabID == "ForeignTable") {
            g_pGeneralTab.style.display = "none";
            g_pOptionsTab.style.display = "none";
            g_pForeignTableTab.style.display = "";
        }
    } 
	
	function RefreshData() 
	{
		var displayName = caller.getFieldProperty(fieldPrefix, 'displayName').value;
        if (displayName) 
		{
           	document.getElementById("chkDisplayName").checked = true;
            document.getElementById("_EZTDisplayName_").value = displayName;
        } 
		else 
		{
            document.getElementById("_EZTDisplayName_").disabled = true;
        }
		var defaultValue = caller.getFieldProperty(fieldPrefix, 'defaultValue').value;
        if (defaultValue) {
            document.getElementById("chkDefaultValue").checked = true;
            document.getElementById("_EZTDefaultValue_").value = defaultValue;
        } 
		else 
		{
           document.getElementById("_EZTDefaultValue_").disabled = true;
        }

        var fieldType = caller.getFieldProperty(fieldPrefix, 'type').value;
        var bDisableFixedOpts = true;
        var bDisableTableOpts = true;
        var bCheckFixedOptsSource = false;
        var bCheckTableOptsSource = false;
        if (fieldType == "boolean" || fieldType == "integer" || fieldType == "string")
        {
        	bDisableFixedOpts = false;
			
			var valueOptions = caller.getFieldProperty(fieldPrefix, 'valueOptions').value;
	        if (valueOptions) {
	        	bCheckFixedOptsSource = true;
	            document.getElementById("chkValueOptions").checked = true;
	
				var values = valueOptions.split("#ITEM#");
				var numRows = values.length / 2;
	
				for(var x = 1; x <= numRows; x++)
				{
					addNewLine();
				}
				var nextValue = 0;
				
				for(var x = 1; x <= numRows; x++)
				{
					document.getElementById("_EZTValueOptionValue"+x+"_").value = values[nextValue];
					if (fieldType == "boolean")
					{
						document.getElementById("chkValueOptions").disabled = true;
						document.getElementById("_EZTValueOptionValue"+x+"_").disabled = true;
					}
					nextValue++;
					document.getElementById("_EZTValueOption"+x+"_").value = values[nextValue];
					nextValue++;
				}
	        } 
			else 
			{
			   addNewLine();	
	           document.getElementById("_EZTValueOptionValue1_").disabled = true;
	           document.getElementById("_EZTValueOption1_").disabled = true;
	           document.getElementById('_EZTValueOptionAddLine1_').style.display = "none";
	        }
        }

        if(fieldType == "guid" || fieldType == "integer" || fieldType == "string")
        {
        	bDisableTableOpts = false;
        	var fkTable = caller.getFieldProperty(fieldPrefix, 'dbvTblName').value;
        	var fkTxClName = caller.getFieldProperty(fieldPrefix, 'dbvTxClName').value;
        	var fkVlClName = caller.getFieldProperty(fieldPrefix, 'dbvVlClName').value;
			
        	document.getElementById("_EZTTableName_").value = fkTable;
        	document.getElementById("_EZTForeignTableTextColumnName_").value = fkTxClName;
        	document.getElementById("_EZTForeignTableValueColumnName_").value = fkVlClName;

        	if(fkTable)
        	{
        		bCheckTableOptsSource = true;
        	}
        }

    	if(bDisableTableOpts)
    	{
        	document.getElementById("_EZTValueOptionsTable_").style.display = "";
        	disableOptionsSource("database");
    	}

    	if(bDisableFixedOpts)
    	{
        	document.getElementById("_EZTValueOptionsTable_").style.display = "";
        	disableOptionsSource("fixed");
    	}
        
        if(bDisableFixedOpts && bDisableTableOpts)
        {
        	document.getElementById('trValueOptions').style.display = "none";
        }

        if(bCheckTableOptsSource)
        {
            checkOptionsSource("database");
        }
        else if(bCheckFixedOptsSource)
        {
            checkOptionsSource("fixed");
        }

        var required = caller.getFieldProperty(fieldPrefix, 'required').value;
        if (required == "true") 
			document.getElementById("chkRequired").checked = true;

		var pattern = caller.getFieldProperty(fieldPrefix, 'pattern').value;
        if (pattern) {
           document.getElementById("chkPattern").checked = true;
           document.getElementById("edtPattern").value = pattern;
        } 
		else 
		{
           document.getElementById("edtPattern").disabled = true;
        }

        onChangeOptionValueType();
    } 

	function disableOptionsSource(sourceType)
	{
		var arr = document.getElementsByName("optType");
		for(var i = 0; i < arr.length; i++)
		{
			if(arr[i].value == sourceType)
			{
				arr[i].disabled = true;
				arr[i].checked = false;
				break;
			}
		}
	}

	function checkOptionsSource(sourceType)
	{
		var arr = document.getElementsByName("optType");
		for(var i = 0; i < arr.length; i++)
		{
			if(arr[i].value == sourceType)
			{
				arr[i].checked = true;
				document.getElementById("chkValueOptions").checked = true;
				break;
			}
		}

		onValueOptionsClick();
	}
	
	function onOkClicked() 
	{
		var selectedOptionSource = getSelectedOptionSource();
    	if (document.getElementById("chkValueOptions").checked) 
        {
        	if(selectedOptionSource == null)
        	{
				alert("<lum:message key="STR_INVALID_OPTIONS_SOURCE"/>");
				return;
        	}
        	
    		if ("database" == selectedOptionSource)
    		{
    			var table = document.getElementById("_EZTTableName_").value;
    			var presentationColumn = document.getElementById("_EZTForeignTableTextColumnName_").value;
    		    var column = document.getElementById("_EZTForeignTableValueColumnName_").value;

    		    var regexp = /^[\w]+$/i;
    		    if(!regexp.test(table))
    		    {
					alert("<lum:message key="STR_INVALID_TABL_OPT_TABLE"/>");
					return;
    		    }

    		    if(!regexp.test(presentationColumn))
    		    {
					alert("<lum:message key="STR_INVALID_TABL_OPT_TXT_COLUMN"/>");
					return;
    		    }

    		    if(!regexp.test(column))
    		    {
					alert("<lum:message key="STR_INVALID_TABL_OPT_VAL_COLUMN"/>");
					return;
    		    }
    		}
        }
        
		var displayName;
        if (document.getElementById("chkDisplayName").checked) 
			displayName =document.getElementById("_EZTDisplayName_").value;
		else
			displayName = '';
		caller.getFieldProperty(fieldPrefix, 'displayName').value = displayName;

		var defaultValue;
        if (document.getElementById("chkDefaultValue").checked) 
			defaultValue = document.getElementById("_EZTDefaultValue_").value;
		else
			defaultValue = '';
		caller.getFieldProperty(fieldPrefix, 'defaultValue').value = defaultValue;

		var valueOptions = '';
		var optValSrc = '';

		caller.deleteForeignKeyIfExists(fieldPrefix);
		var bClearDbValues = true;
        if (document.getElementById("chkValueOptions").checked) 
        {
    		if("fixed" == selectedOptionSource)
    		{
	    		for(var x = 1; x <= totalLines; x++)
	    		{
	        		try
	        		{
	            		var key = document.getElementById("_EZTValueOptionValue"+x+"_").value;
	            		var value = document.getElementById("_EZTValueOption"+x+"_").value;
		        		if (valueOptions != '')
		        		{
		        			valueOptions +='#ITEM#';
		        		}
		        		valueOptions += key;
		        		valueOptions += '#ITEM#'+ value;
	        		}
	        		catch(e)
	        		{
	            		continue;
	        		}
	    		}
	    		optValSrc = "Fixed";
    		}
    		else if ("database" == selectedOptionSource)
    		{
    			bClearDbValues = false;
    			var table = document.getElementById("_EZTTableName_").value;
    			var presentationColumn = document.getElementById("_EZTForeignTableTextColumnName_").value;
    		    var column = document.getElementById("_EZTForeignTableValueColumnName_").value;

				caller.getFieldProperty(fieldPrefix, 'dbvTblName').value = table;
	    		caller.getFieldProperty(fieldPrefix, 'dbvTxClName').value = presentationColumn;
	    		caller.getFieldProperty(fieldPrefix, 'dbvVlClName').value = column;
	    		optValSrc = "Database";
	    		caller.addForeignKeyEntry(table, presentationColumn, column, fieldPrefix);
    		}
        }
        if(bClearDbValues)
        {
    		caller.getFieldProperty(fieldPrefix, 'dbvTblName').value = "";
    		caller.getFieldProperty(fieldPrefix, 'dbvTxClName').value = "";
    		caller.getFieldProperty(fieldPrefix, 'dbvVlClName').value = "";
        }
		caller.getFieldProperty(fieldPrefix, 'valueOptions').value = valueOptions;
		caller.getFieldProperty(fieldPrefix, 'optValSrc').value = optValSrc;

		var required;
        if (document.getElementById("chkRequired").checked) 
			required = true;
		else
			required = false;
		caller.getFieldProperty(fieldPrefix, 'required').value = required;

		var pattern;
        if (document.getElementById("chkPattern").checked) 
			pattern = document.getElementById("edtPattern").value;
		else
			pattern = '';
		caller.getFieldProperty(fieldPrefix, 'pattern').value = pattern;
		
		// Finally we need check if initial value is fine if default is enable
		if(	!document.getElementById("chkDefaultValue").checked ||
			IsDefaultValueValid(caller.getFieldProperty(fieldPrefix, 'type').value,defaultValue))
		{
        	window.close();
        }
        else
        {
        	alert("<lum:message key="STR_INVALID_DEFAULT_VALUE"/>");
        }
    } 
	
	function onCancelClicked() 
	{
        window.returnValue = "cancelled";
        window.close();
    } 
	
	function onDisplayNameClick() 
	{
        document.getElementById("_EZTDisplayName_").disabled = !(document.getElementById("chkDisplayName").checked);
    } 
	
	function onDefaultValueClick() 
	{
        document.getElementById("_EZTDefaultValue_").disabled = !(document.getElementById("chkDefaultValue").checked);
    } 
	
	function onValueOptionsClick() 
	{
		var chkOptionsElem = document.getElementById("chkValueOptions");
		var chkValueOptions = chkOptionsElem != null && chkOptionsElem.checked;
		if(chkValueOptions)
		{
			document.getElementById("trOptionsSrc").style.display = "";
		}
		else
		{
			document.getElementById("trOptionsSrc").style.display = "none";
		}
    } 

    function getSelectedOptionSource()
    {
    	var arrOptValRadio = document.getElementsByName("optType");
		var selected = null;
		for(var i = 0; i < arrOptValRadio.length; i++)
		{
			if(arrOptValRadio[i].checked)
			{
				selected = arrOptValRadio[i].value;
				break;
			}
		}
        return selected;
    }

    function onChangeOptionValueType()
    {
		var selected = getSelectedOptionSource();

		if("fixed" == selected)
		{
			onFixedValueOptionsClick(true);
			onDatabaseValueOptionsClick(false);
		}
		else if("database" == selected)
		{
			onFixedValueOptionsClick(false);
			onDatabaseValueOptionsClick(true);
		}
		else
		{
			onFixedValueOptionsClick(false);
			onDatabaseValueOptionsClick(false);
		}
    }

    $(document).ready(function(){
    	onValueOptionsClick();
    	onChangeOptionValueType();
    });
    	
	function onFixedValueOptionsClick(checked) 
	{
		var style = "block";
		if (!checked)
		{
			style = "none";
		}
        
		document.getElementById("optTypeFixed").style.display = style;
		for(var x = 1; x <= totalLines; x++)
		{
			if(caller.getFieldProperty(fieldPrefix, 'type').value != 'boolean')
			{
				//any type but boolean
				document.getElementById('_EZTValueOptionAddLine'+x+'_').style.display = style;
				document.getElementById("_EZTValueOptionValue"+x+"_").disabled = !checked;
		        document.getElementById("_EZTValueOption"+x+"_").disabled = !checked;
			}
			else
			{
				document.getElementsByName('optType')[0].disabled = true;
			}
		}

    } 
	
	function onDatabaseValueOptionsClick(enable) 
	{
		var style = "block";
		if (!enable)
		{
			style = "none";
		}

		document.getElementById("_EZTTableName_").style.display = style;
		document.getElementById("_EZTForeignTableTextColumnName_").style.display = style;
		document.getElementById("_EZTForeignTableValueColumnName_").style.display = style;
		
		document.getElementById("_EZTTableName_").disabled = !enable;
		document.getElementById("_EZTForeignTableTextColumnName_").disabled = !enable;
	    document.getElementById("_EZTForeignTableValueColumnName_").disabled = !enable;

		document.getElementById("optTypeDB").style.display = style;
    } 

	function onPatternClick() 
	{
        document.getElementById("edtPattern").disabled = !(document.getElementById("chkPattern").checked);
    } 
	
	function onEnableOptionsClick() 
	{
        document.getElementById("_EZTNewOptionValue_").disabled = !(document.getElementById("chkEnableOptions").checked);
        document.getElementById("_EZTNewOptionName_").disabled = !(document.getElementById("chkEnableOptions").checked);
    } 
	
	function onEnableForeignTableClick() 
	{
        document.getElementById("_EZTForeignTableName_").disabled = !(document.getElementById("chkEnableForeignTable").checked);
        document.getElementById("_EZTForeignTableColumn_").disabled = !(document.getElementById("chkEnableForeignTable").checked);
        document.getElementById("_EZTForeignTableDisplayColumn_").disabled = !(document.getElementById("chkEnableForeignTable").checked);
    } 
	
	function AddNewOption() 
	{
        var strNewOptionName = document.getElementById("_EZTNewOptionName_").value;
        var strNewOptionValue = document.getElementById("_EZTNewOptionValue_").value;
        document.getElementById("_EZTNewOptionName_").value = "";
        document.getElementById("_EZTNewOptionValue_").value = "";
        if (document.getElementById("chkEnableOptions").checked && strNewOptionName.length != 0 && strNewOptionValue.length != 0) AddNewOption2(strNewOptionName, strNewOptionValue);
    } 
	
	function AddNewOption2(strOptionName, strOptionValue) 
	{
        var pOptions = document.getElementById("_EZTOptionValues");
        var pRow = pOptions.insertRow(-1);
        pRow.insertCell(0)[0].innerHTML = strOptionName;
        pRow.insertCell(1)[0].innerHTML = strOptionValue;
        pRow.insertCell(1)[0].innerHTML = '<img src="images/excluir.gif" style="cursor:hand;" onClick="RemoveOptions(this)">';
        pRow.cells[0].width = "160px";
        pRow.cells[1].width = "160px";
        pRow.cells[2].width = "12px";
        pRow.cells[0].className = "cEZTFont11 cEZTBackground7";
        pRow.cells[1].className = "cEZTFont11 cEZTBackground7";
        pRow.cells[2].className = "cEZTFont11 cEZTBackground7";
        pRow.cells[0].style.paddingLeft = "5";
        pRow.cells[1].style.paddingLeft = "5";
        pRow.cells[2].style.paddingLeft = "3";
    } 
	
	function RemoveOptions(pObject) 
	{
        var rowIndex = pObject.parentElement.parentElement.rowIndex;
        var pRows = document.getElementById("_EZTOptionValues");
        pRows.deleteRow(rowIndex);
    } 
    
	function addNewLine()
	{
		tbl = document.getElementById("_EZTValueOptionsTable_");

		totalLines++;
		
		var newRow = tbl.insertRow(-1);
		
		var newCell;

		newCell = newRow.insertCell(0);
		newCell.innerHTML = '<input id="_EZTValueOptionValue'+totalLines+'_" name="_EZTValueOptionValue'+totalLines+'_" style="width:100%" class="cLumInputText" />';
		newCell.width = "35%";
		newCell.id = 'EZTValueOptionValue'+totalLines;
		newCell = newRow.insertCell(1);
		newCell.innerHTML = '<input id="_EZTValueOption'+totalLines+'_" name="_EZTValueOption'+totalLines+'_" style="width:100%" class="cLumInputText" />';
		newCell.width = "50%";
		newCell.id = 'EZTValueOption'+totalLines;

		if(caller.getFieldProperty(fieldPrefix, 'type').value != 'boolean')
		{
			newCell = newRow.insertCell(2);
			newCell.id = '_EZTValueOptionAddLine'+totalLines+'_';
			newCell.innerHTML = '<img src="../../../../lumis/portal/client/images/Add.gif" onclick="addNewLine();return false;"/> ';
			if(totalLines > 1)
			{
				document.getElementById('_EZTValueOptionAddLine'+(totalLines-1)+'_').innerHTML = '<img src="../../../../lumis/portal/client/images/Delete.gif" onclick="deleteRow(this.parentNode.parentNode.rowIndex);return false;"/> <img src="../../../../lumis/portal/client/images/moveDown.gif" onclick="moveRow(this.parentNode.parentNode,\'down\');return false;"/>';
				if(totalLines > 2)
				{
					document.getElementById('_EZTValueOptionAddLine'+(totalLines-1)+'_').innerHTML += ' <img src="../../../../lumis/portal/client/images/moveUp.gif" onclick="moveRow(this.parentNode.parentNode,\'up\');return false;"/>';
				}
			}
		}
	}

	function moveRow(curRow, direction)
	{
		if (curRow.previousSibling != null && direction == "up")
		{
			var previousSiblingCell0Id = curRow.previousSibling.cells[0].id;
			var previousSiblingCell1Id = curRow.previousSibling.cells[1].id;
			var currentCell0Id = curRow.cells[0].id;
			var currentCell1Id = curRow.cells[1].id;

			var previousSiblingCell0Value = document.getElementById('_'+previousSiblingCell0Id+'_').value;
			var previousSiblingCell1Value = document.getElementById('_'+previousSiblingCell1Id+'_').value;
			var currentCell0Value = document.getElementById('_'+currentCell0Id+'_').value;
			var currentCell1Value = document.getElementById('_'+currentCell1Id+'_').value;

			document.getElementById('_'+previousSiblingCell0Id+'_').value = currentCell0Value;
			document.getElementById('_'+previousSiblingCell1Id+'_').value = currentCell1Value;
			document.getElementById('_'+currentCell0Id+'_').value = previousSiblingCell0Value;
			document.getElementById('_'+currentCell1Id+'_').value = previousSiblingCell1Value;
		}
		else if (curRow.nextSibling != null && direction == "down")
		{
			var nextSiblingCell0Id = curRow.nextSibling.cells[0].id;
			var nextSiblingCell1Id = curRow.nextSibling.cells[1].id;
			var currentCell0Id = curRow.cells[0].id;
			var currentCell1Id = curRow.cells[1].id;

			var nextSiblingCell0Value = document.getElementById('_'+nextSiblingCell0Id+'_').value;
			var nextSiblingCell1Value = document.getElementById('_'+nextSiblingCell1Id+'_').value;
			var currentCell0Value = document.getElementById('_'+currentCell0Id+'_').value;
			var currentCell1Value = document.getElementById('_'+currentCell1Id+'_').value;

			document.getElementById('_'+nextSiblingCell0Id+'_').value = currentCell0Value;
			document.getElementById('_'+nextSiblingCell1Id+'_').value = currentCell1Value;
			document.getElementById('_'+currentCell0Id+'_').value = nextSiblingCell0Value;
			document.getElementById('_'+currentCell1Id+'_').value = nextSiblingCell1Value;
		}
	}

	function deleteRow(index)
	{
		document.getElementById('_EZTValueOptionsTable_').deleteRow(index);
	}
	
	function IsDefaultField() 
	{
        return false;
    }
     
	function IsDefaultValueValid(FieldType,FieldValue)
	{
		// This function has some hardcode limit please note
		// that this limits are the limits of database and
		// java language and not javascript limit
		switch(FieldType) 
		{
			case "date":
				var regExpDateISO8601 = new RegExp("\\d\\d\\d\\d-[0-1]\\d-[0-3]\\d"); // Just a subset of ISO8601;
				return (regExpDateISO8601.exec(FieldValue)!=null);
		
			case "time":
				var regExpTimeISO8601 = new RegExp("[0-1]\\d:[0-5]\\d:[0-5]\\d(\\.\\d\\d\\d(((\\+|-)[0-1]\\d:[0-5]\\d)|Z){0,1}|Z){0,1}"); 
				return (regExpTimeISO8601.exec(FieldValue)!=null);
					
			case "dateTime":
				var regExpDateTimeISO8601 = new RegExp("\\d\\d\\d\\d-[0-1]\\d-[0-3]\\dT[0-1]\\d:[0-5]\\d:[0-5]\\d(\\.\\d\\d\\d(((\\+|-)[0-1]\\d:[0-5]\\d)|Z){0,1}|Z){0,1}");
				return (regExpDateTimeISO8601.exec(FieldValue)!=null);
			case "money":
				var iFieldValue=parseFloat(FieldValue);
				// Check limit that database will store all digits without round
				// don't perfect need check less than cents. Please note that
				// trick Math.round(Num*100)/100==Num may fail(work for round but not in this case).
				// Remember, ten (our numeric base) is not a pure 2 power is 2*5
				return 	((iFieldValue>=-9999999999999.99) && (iFieldValue<=9999999999999.99)) && // check range
						!((iFieldValue>-0.01)&&(iFieldValue<0.01)&&(iFieldValue!=0));  // Underflow protect!
			case "double":
				// TODO: Better check. Note that 1e-250 will pass here but make a Underflow exception in Oracle
				// The problem is define a correct limits for all databases. Least Common Denominator, perhaps
			    return !isNaN(parseFloat(FieldValue));
			case "long":
				var iFieldValue=parseInt(FieldValue);
				return (iFieldValue>=-9223372036854775808) && (iFieldValue<9223372036854775808);
			case "integer":
				var iFieldValue=parseInt(FieldValue);
				return (iFieldValue>=-2147483648) && (iFieldValue<2147483648);				
			case "boolean":
				var strNormalize=FieldValue.toUppercase();
				return (strNormalize=="TRUE" || strNormalize=="FALSE");				
			case "string":
			case "text":
			case "html":
			case "image":
			case "document":
			case "file":
			case "files":
				return true; // For while this type don't have a real validation

			case "guid": // You are crazy man! guid is a kind of use once guy. Default value don't smell good! 
			default:
				// Unknow data type
				return false; // This will help to don't forget of include future new types validation
		}
	}
    
    
	</script>
    <script type="text/javascript" for="window" event="onload" language="JavaScript"> 
		window.returnValue = "cancelled"; 
		initialize(); 
	</script>
</head>
<body>

<div style="padding:8px;">

  <div id="LumisProgressDiv" style="display:none;padding:30px;color:#777777;text-align:center;border:1px solid #777777;width:180;height:100;position:absolute;background-color:#FFFFFF">
    <div><img src="lumis/service/contentmanagement/wizard/images/progress.gif"/></div>
    <div class="cEZTLabelText" style="padding-top:15px"><lum:message key="STR_ADVANCED_PROPERTY"/></div>
  </div>

  <div class="cLumPropertyPage">
  
	<div id="LumInterfaceHeader_top">
		<div class="cLumBrdLeft"><img src="images/pix.gif" alt=" " title=""/></div>
		<div class="cLumBrdRight"><img src="images/pix.gif" alt=" " title=""/></div>
	</div>
	<div id="LumInterfaceHeader">
		<div class="tit"><lum:message key="STR_ADVANCED_PROPERTY"/></div>
		<br style="clear: both" />
	</div>

	<div id="_EZTLocalizerElement_" style="display:none"></div>

  
  
<!------------------------------------------ Inicio da Tabela com TAB GERAL -->
              <div id="tabGeneral">
                <div style="padding:10px;" class="cLumTabBox">
                	<div style="height:350px;" class="cLumControlGroup"> 
                	<br clear="none" />
                        <table>
                          <tr>
                            <td><input type="checkbox" id="chkDisplayName" onClick="onDisplayNameClick()" />
                            </td>
                            <td nowrap class="cEZTFont11"><lum:message key="STR_TYTLE"/>:&nbsp;</td>
                            <td width="100%"><input id="_EZTDisplayName_" name="_EZTDisplayName_" style="width:100%" class="cLumInputText" />
                            </td>
                          </tr>
                          <tr>
                            <td><input type="checkbox" id="chkDefaultValue" onClick="onDefaultValueClick()" />
                            </td>
                            <td nowrap class="cEZTFont11"><lum:message key="STR_INITIAL_VALUE"/>:&nbsp;</td>
                            <td width="100%"><input id="_EZTDefaultValue_" name="_EZTDefaultValue_" style="width:100%" class="cLumInputText" />
                            </td>
                          </tr>
                          <tr>
                            <td><input type="checkbox" id="chkRequired" onClick="" />
                            </td>
                            <td nowrap class="cEZTFont11"><lum:message key="STR_REQUIRED"/>&nbsp;</td>
                            <td>&nbsp;</td>
                          </tr>
                          <tr>
                            <td><input type="checkbox" id="chkPattern" onClick="onPatternClick()" />
                            </td>
                            <td nowrap class="cEZTFont11"><lum:message key="STR_FORMAT_PATTERN"/>:&nbsp;</td>
                            <td width="100%"><input id="edtPattern" name="edtPattern" style="width:100%" class="cLumInputText"/></td>
                          </tr>
                          <tr style="display:none;">
                            <td><input type="checkbox" id="chkUnique" onClick="" />
                            </td>
                            <td nowrap class="cEZTFont11"><lum:message key="STR_AVOID_DUPLICITY"/>&nbsp;</td>
                            <td></td>
                          </tr>
                          <tr style="display:none;">
                            <td><input type="checkbox" id="chkFormatNumber" onClick="" />
                            </td>
                            <td nowrap class="cEZTFont11"><lum:message key="STR_NUMERIC_FORMAT"/>&nbsp;</td>
                            <td></td>
                          </tr>
                          <tr style="display:none;">
                            <td><input type="checkbox" id="chkTrackInComments" onClick="" />
                            </td>
                            <td nowrap class="cEZTFont11"><lum:message key="STR_ADD_NEW_COMMENT"/>&nbsp;</td>
                            <td></td>
                          </tr>
                          <tr id="trValueOptions">
                          	<td style="vertical-align:top;"><input type="checkbox" id="chkValueOptions" onClick="onValueOptionsClick()" />
                            </td>
                            <td nowrap class="cEZTFont11" style="vertical-align:top;padding-top:5px;" colspan="2"><lum:message key="STR_VALUES_OPTIONS"/></td>
                          </tr>
                          <tr id="trOptionsSrc">
                            <td width="100%" colspan="3">
                            	<div style="border: 1px solid #CCC;">
                            	<input type="radio" name="optType" value="fixed" onclick="onChangeOptionValueType();"><lum:message key="STR_ENABLE_OPTIONS"/></input>
                            	<div style="height:150px;overflow:auto;" id="optTypeFixed">
		                            <table id="_EZTValueOptionsTable_" style="width:100%">
			                            <tr>
			                            	<td style="width:35%"><strong><lum:message key="STR_VALUE"/></strong></td><td colspan="2" style="width:65%"><strong><lum:message key="STR_LABEL"/></strong></td><td></td>
			                            </tr>
									</table>
	                            </div>
	                            <br style="clear: all;" />
                            	<input type="radio" name="optType" value="database" onclick="onChangeOptionValueType();"><lum:message key="STR_FOREING_TABLE"/></input>
                            	<div style="height:150px;overflow:auto;" id="optTypeDB">
		                            <table id="_EZTValueOptionsTable_" style="width:100%">
			                            <tr>
			                            	<td nowrap class="cEZTFont11"><lum:message key="STR_TABLE_NAME"/>:&nbsp;</td>
				                            <td width="100%"><input id="_EZTTableName_" name="_EZTTableName_" style="width:100%" class="cLumInputText" />
				                            </td>
			                            </tr>
			                            <tr>
			                            	<td nowrap class="cEZTFont11"><lum:message key="STR_PRESENTATION_COLUMN"/>:&nbsp;</td>
				                            <td width="100%"><input id="_EZTForeignTableTextColumnName_" name="_EZTForeignTableTextColumnName_" style="width:100%" class="cLumInputText" />
				                            </td>
			                            </tr>
			                            <tr>
			                            	<td nowrap class="cEZTFont11"><lum:message key="STR_COLUMN"/>:&nbsp;</td>
				                            <td width="100%"><input id="_EZTForeignTableValueColumnName_" name="_EZTForeignTableValueColumnName_" style="width:100%" class="cLumInputText" />
				                            </td>
			                            </tr>
									</table>
	                            </div>
	                            </div>
                            </td>
                          </tr>
                        </table>
                      </div>
                   </div>
                
              </div>
              <!------------------------------------------ Fim da Tabela com TAB GERAL -->
              <!------------------------------------------ Inicio da Tabela com TAB OPTIONS -->
              <div id="tabOptions" style="display:none;">
                <table width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td colspan="7" class="cEZTBackground4"><img src="images/pix.gif" alt=" " title=""></td>
                    <td width="100%"><img src="images/pix.gif" alt=" " title=""></td>
                  </tr>
                  <tr>
                    <td class="cEZTBackground4"><img src="images/pix.gif" alt=" " title=""></td>
                    <td class="cEZTBackground7" style="padding:2px;padding-right:34px;padding-left:34px;" onClick="onTabClicked('General');" onMouseOver="this.style.cursor='hand'"><b class="cEZTFont11"><lum:message key="STR_GENERAL"/></b></td>
                    <td class="cEZTBackground4"><img src="images/pix.gif" alt=" " title=""></td>
                    <td class="cEZTBackground9" style="padding:2px;padding-right:20px;padding-left:20px;" onClick="onTabClicked('Options');" onMouseOver="this.style.cursor='hand'"><b class="cEZTFont11"><lum:message key="STR_OPTIONS"/></b></td>
                    <td class="cEZTBackground4"><img src="images/pix.gif" alt=" " title=""></td>
                    <td class="cEZTBackground7" style="padding:2px;padding-right:20px;padding-left:20px;" nowrap="1" onClick="onTabClicked('ForeignTable');" onMouseOver="this.style.cursor='hand'"><b class="cEZTFont11"><lum:message key="STR_FOREING_TABLE"/></b></td>
                    <td class="cEZTBackground4"><img src="images/pix.gif" alt=" " title=""></td>
                  </tr>
                  <tr>
                    <td class="cEZTBackground4" colspan="3"><img src="images/pix.gif" alt=" " title=""></td>
                    <td class="cEZTBackground9"><img src="images/pix.gif" alt=" " title=""></td>
                    <td class="cEZTBackground4" colspan="5"><img src="images/pix.gif" alt=" " title=""></td>
                  </tr>
                </table>
                <table width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td class="cEZTBackground4"><img src="images/pix.gif" alt=" " title=""></td>
                    <td class="cEZTBackground9" width="100%" style="padding:6px;"><div style="height:250px;"> <BR>
                        <table width="100%" cellspacing="0" cellpadding="0" border="0">
                          <tr>
                            <td><input type="checkbox" id="chkEnableOptions" onClick="onEnableOptionsClick()" /></td>
                            <td class="cEZTFont11" width="100%"><lum:message key="STR_ENABLE_OPTIONS"/></td>
                          </tr>
                          <tr>
                            <td colspan="2"><img src="images/pix.gif" alt=" " title="" height="10"></td>
                          </tr>
                          <tr>
                            <td colspan="2" class="cEZTBackground4"><img src="images/pix.gif" alt=" " title=""></td>
                          </tr>
                          <tr>
                            <td colspan="2"><img src="images/pix.gif" alt=" " title="" height="10"></td>
                          </tr>
                        </table>
                        <table width="100%" cellspacing="0" cellpadding="0" border="0">
                          <tr>
                            <td width="200px" class="cEZTFont11"><lum:message key="STR_NAME"/></td>
                            <td width="200px" class="cEZTFont11"><lum:message key="STR_VALUE"/></td>
                            <td width="20px">&nbsp;</td>
                          </tr>
                          <tr>
                            <td><input type="text" id="_EZTNewOptionName_" name="_EZTNewOptionName_" style="width:200px" class="cInputText" /></td>
                            <td><input type="text" id="_EZTNewOptionValue_" name="_EZTNewOptionValue_" style="width:200px" class="cInputText" /></td>
                            <td align="left"><img src="images/incluir.gif" style="cursor:hand;" onClick="AddNewOption()"></td>
                          </tr>
                        </table>
                        <BR>
                        <table width="100%" align="center" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td><div style="height:140;overflow:auto;">
                                <table ID="_EZTOptionValues" class="cEZTBackground4" cellpadding="0" cellspacing="1" align="left" border="0" width="425">
                                </table>
                              </div></td>
                        </table>
                      </div></td>
                    <td class="cEZTBackground4"><img src="images/pix.gif" alt=" " title=""></td>
                  </tr>
                </table>
                
              </div>
          </div>
              <!------------------------------------------ Fim da Tabela com TAB OPTIONS -->
              <!------------------------------------------ Inicio da Tabela com TAB FOREIGN TABLE -->
              <div id="tabForeignTable" style="display:none;">
                <table width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td colspan="7" class="cEZTBackground4"><img src="images/pix.gif" alt=" " title=""></td>
                    <td width="100%"><img src="images/pix.gif" alt=" " title=""></td>
                  </tr>
                  <tr>
                    <td class="cEZTBackground4"><img src="images/pix.gif" alt=" " title=""></td>
                    <td class="cEZTBackground7" style="padding:2px;padding-right:34px;padding-left:34px;" onClick="onTabClicked('General');" onMouseOver="this.style.cursor='hand'"><b class="cEZTFont11"><lum:message key="STR_GENERAL"/></b></td>
                    <td class="cEZTBackground4"><img src="images/pix.gif" alt=" " title=""></td>
                    <td class="cEZTBackground7" style="padding:2px;padding-right:20px;padding-left:20px;" onClick="onTabClicked('Options');" onMouseOver="this.style.cursor='hand'"><b class="cEZTFont11"><lum:message key="STR_OPTIONS"/></b></td>
                    <td class="cEZTBackground4"><img src="images/pix.gif" alt=" " title=""></td>
                    <td class="cEZTBackground9" style="padding:2px;padding-right:20px;padding-left:20px;" nowrap="1" onClick="onTabClicked('ForeignTable');" onMouseOver="this.style.cursor='hand'"><b class="cEZTFont11"><lum:message key="STR_FOREING_TABLE"/></b></td>
                    <td class="cEZTBackground4"><img src="images/pix.gif" alt=" " title=""></td>
                  </tr>
                  <tr>
                    <td class="cEZTBackground4" colspan="5"><img src="images/pix.gif" alt=" " title=""></td>
                    <td class="cEZTBackground9"><img src="images/pix.gif" alt=" " title=""></td>
                    <td class="cEZTBackground4" colspan="3"><img src="images/pix.gif" alt=" " title=""></td>
                  </tr>
                </table>
                <table width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                  
                  <td class="cEZTBackground4"><img src="images/pix.gif" alt=" " title=""></td>
                  <td class="cEZTBackground9" width="100%" style="padding:6px;"><div style="height:250px;"> <BR>
                      <table width="100%" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td><input type="checkbox" id="chkEnableForeignTable" onClick="onEnableForeignTableClick()" /></td>
                          <td class="cEZTFont11" width="100%"><lum:message key="STR_FOREING_TABLE"/></td>
                        </tr>
                        <tr>
                          <td colspan="2"><img src="images/pix.gif" alt=" " title="" height="10"></td>
                        </tr>
                        <tr>
                          <td class="cEZTBackground4" colspan="2"><img src="images/pix.gif" alt=" " title=""></td>
                        </tr>
                        <tr>
                          <td colspan="2"><img src="images/pix.gif" alt=" " title="" height="10"></td>
                        </tr>
                      </table>
                      <table width="100%" cellspacing="0" cellpadding="5" border="0">
                        <tr>
                          <td class="cEZTFont11"><lum:message key="STR_TABLE"/>:</td>
                          <td width="100%"><input id="_EZTForeignTableName_" type="text" name="_EZTForeignTableName_" value="" style="width:100%" class="cInputText" /></td>
                        <tr>
                          <td class="cEZTFont11"><lum:message key="STR_COLUMN"/>:</td>
                          <td width="100%"><input type="text" id="_EZTForeignTableColumn_" name="_EZTForeignTableColumn_" value="" style="width:100%" class="cInputText" /></td>
                        </tr>
                        <tr>
                          <td class="cEZTFont11"><lum:message key="STR_PRESENTATION_COLUMN"/>:</td>
                          <td width="100%"><input type="text" id="_EZTForeignTableDisplayColumn_" name="_EZTForeignTableDisplayColumn_" value="" style="width:100%" class="cInputText" /></td>
                        </tr>
                      </table>
                    </div></td>
                  <td class="cEZTBackground4"><img src="images/pix.gif" alt=" " title=""></td>
                  </tr>
                </table>
                <table width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td class="cEZTBackground4"><img src="images/pix.gif" alt=" " title=""></td>
                  </tr>
                </table>
              </div>
              <!------------------------------------------ Fim da Tabela com TAB FOREIGN TABLE -->
              <img src="images/pix.gif" alt=" " title="" height="6"><br>
    
			  <div id="LumButton1" style="_height:1%" class="cInterfaceButtons">
					<ul style="float:right;">
						<li>
							<span class="brdleft"></span>
							<a href="#" onClick="javascript:onOkClicked();">
								<img align="absmiddle" src="images/Ok.gif" border="0" alt="Ok"/>Ok
							</a>
							<span class="brdright"></span>
							<div class="spacer"></div>
						</li>
						<li>
						<span class="brdleft"></span>
						<a onClick="javascript:onCancelClicked();">
							<img href="#" align="absmiddle" src="images/Cancel.gif" border="0" alt="Cancelar"/><lum:message key="STR_CANCEL"/>
						</a><span class="brdright"></span>
						</li>
					</ul>
				<br style="clear: both" />
				</div>
	</div>

</body>
</html>
