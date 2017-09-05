<%-- $Revision: 15327 $ $Date: 2013-05-16 16:48:00 -0300 (Thu, 16 May 2013) $ --%>
<%@ taglib uri="/WEB-INF/lumis/tld/lum.tld" prefix="lum" %>
<%@page import="lumis.portal.manager.ManagerFactory"%>
<%@page import="lumis.util.IResource"%>
<%@page import="lumis.portal.PortalStringResource"%>
<%@page import="lumis.portal.authentication.SessionConfig"%>
<%response.setCharacterEncoding("UTF-8");%>
<lum:addResource path="lumis/service/content/wizard/strings/strings"/>
var g_arrDataTypes = new Array();
var arrIndex = 0;
var fieldCaller = null;
var fieldPrefix = null;
var pObj;
pObj = new Object();
pObj.dataType = 'string';
pObj.hasSize = true;
pObj.name = 'string'
g_arrDataTypes[arrIndex++] = pObj;
pObj = new Object();
pObj.dataType = 'guid';
pObj.hasSize = false;
pObj.name = 'guid'
g_arrDataTypes[arrIndex++] = pObj;
pObj = new Object();
pObj.dataType = 'boolean';
pObj.hasSize = false;
pObj.name = 'boolean'
g_arrDataTypes[arrIndex++] = pObj;
pObj = new Object();
pObj.dataType = 'integer';
pObj.hasSize = false;
pObj.name = 'inteiro'
g_arrDataTypes[arrIndex++] = pObj;
pObj = new Object();
pObj.dataType = 'long';
pObj.hasSize = false;
pObj.name = 'long';
g_arrDataTypes[arrIndex++] = pObj;
pObj = new Object();
pObj.dataType = 'double';
pObj.hasSize = false;
pObj.name = 'double'
g_arrDataTypes[arrIndex++] = pObj;
pObj = new Object();
pObj.dataType = 'money';
pObj.hasSize = false;
pObj.name = 'dinheiro'
g_arrDataTypes[arrIndex++] = pObj;
pObj = new Object();
pObj.dataType = 'dateTime';
pObj.hasSize = false;
pObj.name = 'data-hora'
g_arrDataTypes[arrIndex++] = pObj;
pObj = new Object();
pObj.dataType = 'date';
pObj.hasSize = false;
pObj.name = 'data'
g_arrDataTypes[arrIndex++] = pObj;
pObj = new Object();
pObj.dataType = 'time';
pObj.hasSize = false;
pObj.name = 'hora'
g_arrDataTypes[arrIndex++] = pObj;
pObj = new Object();
pObj.dataType = 'text';
pObj.hasSize = false;
pObj.name = 'texto'
g_arrDataTypes[arrIndex++] = pObj;
pObj = new Object();
pObj.dataType = 'html';
pObj.hasSize = false;
pObj.name = 'html'
g_arrDataTypes[arrIndex++] = pObj;
pObj = new Object();
pObj.dataType = 'image';
pObj.hasSize = false;
pObj.name = 'imagem'
g_arrDataTypes[arrIndex++] = pObj;
pObj = new Object();
pObj.dataType = 'document';
pObj.hasSize = false;
pObj.name = 'documento'
g_arrDataTypes[arrIndex++] = pObj;
pObj = new Object();
pObj.dataType = 'file';
pObj.hasSize = false;
pObj.name = 'arquivo'
g_arrDataTypes[arrIndex++] = pObj;
pObj = new Object();
pObj.dataType = 'files';
pObj.hasSize = false;
pObj.name = 'arquivos'
g_arrDataTypes[arrIndex++] = pObj;
pObj = new Object();
pObj.dataType = 'email';
pObj.hasSize = false;
pObj.name = 'email'
g_arrDataTypes[arrIndex++] = pObj;

var m_xmlHttp = LumisPortalUtil.getXmlHttpObject();
var m_sessionKeepAliveTimeout = setTimeout('keepSessionAlive()', 30000);

var foreignKeysTd = document.getElementById("foreignKeysTd");

<% 
	IResource resource = new PortalStringResource();
	resource.addResourcePath("lumis/service/content/wizard/strings/strings");
%>
function doNothing() {}

function deleteForeignKeyIfExists(prefix)
{
	var currentDiv = document.getElementById(prefix + "fkDiv");
	
	// removes current div if it exists
	if(currentDiv != null)
	{
		currentDiv.parentNode.removeChild(currentDiv);
	}
}

function addForeignKeyEntry(foreignTableName, textColumnName, valueColumnName, prefix)
{
	deleteForeignKeyIfExists(prefix);
	
	// add a new div with contents
	var createFKChecked = document.getElementsByName("_Properties_CreateFKs")[0].checked;
	var html = foreignKeysTd.innerHTML;
	
	var disable = "";
	if(!createFKChecked)
		disable += ' disabled="disabled"';
	
	html += '<div id="' + prefix + 'fkDiv"><input type="checkbox" id="' + prefix + 'dbvCrFk" name="' + prefix + 'dbvCrFk" value="true"' + disable + '>';
	
	var fieldName = document.getElementById(prefix + "name").value;
	var tableName = document.getElementsByName("_Properties_TableName")[0].value;
	var fkName = tableName.toUpperCase() + "_FK";
	
	html += fieldName + " -&gt; " + "(" + foreignTableName + ", " + valueColumnName + ")";
	
	var node = foreignKeysTd.firstChild;
	var i = 0;
	while(node != null)
	{
		i++;
		node = node.nextSibling;
	}
	i++;
	
	html += '</input>&nbsp;<input id="' + prefix + 'dbvFkName" name="' + prefix + 'dbvFkName" type="text" value="' + fkName + i + '" /></div>';
	foreignKeysTd.innerHTML = html;
}

function toggleCreateFKs()
{
	var checked = document.getElementsByName("_Properties_CreateFKs")[0].checked;
	
	var disabled = !checked;
	var bUncheck;
	if(checked)
	{
		bUncheck = false;
		document.getElementById("foreignKeysTr").style.display = "";
	}
	else
	{
		bUncheck = true;
		document.getElementById("foreignKeysTr").style.display = "none";
	}
	
	for(var i=0; i < arrIndex; i++)
	{
		var id = "field" + (i + 1) + "_dbvCrFk";
		var checkbox = document.getElementById(id);
		if(checkbox != null)
		{
			if(bUncheck)
				checkbox.checked = false;
			checkbox.disabled = disabled;
		}
	}
}

function toggleCreateTable()
{
	var checked = document.getElementsByName("_Properties_CreateTable")[0].checked;
	if(!checked)
	{
		document.getElementsByName("_Properties_CreateFKs")[0].checked = false;
		document.getElementById("createForeignKeysTr").style.display = "none";
		document.getElementById("foreignKeysTr").style.display = "none";
	}
	else
	{
		document.getElementById("createForeignKeysTr").style.display = "";
		document.getElementById("foreignKeysTr").style.display = "";
	}
	
	toggleCreateFKs();
}

function keepSessionAlive()
{
	if(m_sessionKeepAliveTimeout != null)
	{
		window.clearTimeout(m_sessionKeepAliveTimeout);
		m_sessionKeepAliveTimeout = null;
	}
	
	LumisPortalUtil.makeHttpRequest("lumis/portal/authentication/keepalive.jsp", null, doNothing, false, m_xmlHttp);
	m_sessionKeepAliveTimeout = setTimeout('keepSessionAlive()', 30000);
}

function RenderDataTypeOptions() 
{
	var strOptions = "";
    for (var i = 0; i < g_arrDataTypes.length; i++)
		strOptions += '<option value="' + g_arrDataTypes[i].dataType + '">' + g_arrDataTypes[i].name + '</option>';
    return strOptions;
}

var fieldNumber = 0;
var g_iScreenIndex = 0; 
var g_arrScreens = new Array();
function onBodyLoadHandler() 
{
    g_arrScreens[0] = document.getElementById("_EZTScreen1");
    g_arrScreens[1] = document.getElementById("_EZTScreen2");
    g_arrScreens[2] = document.getElementById("_EZTScreen3");
    g_arrScreens[3] = document.getElementById("_EZTScreenN");
	createDefaultTable();
}
onBodyLoadHandler();

function onNextClick() 
{
    var iCurScreen = g_iScreenIndex;
    if (iCurScreen < g_arrScreens.length-1)
	{
		var iNextScreen = iCurScreen + 1;

        if (!onScreenLoseFocus(iCurScreen)) return;
        
		g_arrScreens[iCurScreen].style.display = "none";
        g_arrScreens[iNextScreen].style.display = "";
        
		if (!onScreenFocus(iNextScreen)) 
		{
            g_arrScreens[iNextScreen].style.display = "none";
            g_arrScreens[iCurScreen].style.display = "";
            return;
        }
        
		g_iScreenIndex = iNextScreen;
 	}
} 

function onBackClick() 
{
    var iCurScreen = g_iScreenIndex;
	if (iCurScreen > 0)
	{
		var iNextScreen = iCurScreen-1;

		g_bIgnoreValidation = true;
		if (!onScreenLoseFocus(iCurScreen)) return;
		g_bIgnoreValidation = false;
		g_arrScreens[iCurScreen].style.display = "none";
		g_arrScreens[iNextScreen].style.display = "";
		if (!onScreenFocus(iNextScreen)) 
		{
			g_arrScreens[iNextScreen].style.display = "none";
			g_arrScreens[iCurScreen].style.display = "";
			return;
		}
		g_iScreenIndex = iNextScreen;
	}
}

function onScreenFocus(i) 
{
    var bReturn = true;
    if (g_arrScreens[i].getAttribute('EZTOnScreenFocus')) 
	    bReturn = eval(g_arrScreens[i].getAttribute('EZTOnScreenFocus'));
    return bReturn;
} 

function onScreenLoseFocus(i) 
{
    var bReturn = true;
    if (g_arrScreens[i].getAttribute('EZTOnScreenLoseFocus')) bReturn = eval(g_arrScreens[i].getAttribute('EZTOnScreenLoseFocus'));
    return bReturn;
}

function onServicePropertiesScreenFocus() 
{
    LumisPortalUtil.getElementChildrenWithName(document, '_Properties_Name')[0].focus();
    return true;
} 

function onServicePropertiesLoseScreenFocus() 
{
	return ValidateProperties();
}

function onPublishPropertiesScreenFocus()
{
	// remove not normal fields
	var pFieldList = LumisPortalUtil.getElementChildrenWithName(document, '_DataFieldID')[0];
	var pRows = document.getElementById("_Data_Fields");
	var arrRemoveObjects = new Array();
	if (pFieldList && !pFieldList.length) 
	{
		if (pFieldList.checked) arrRemoveObjects[arrRemoveObjects.length] = pRows.rows[0];
	} 
	else if (pFieldList) 
	{
		for (var i = 0; i < pFieldList.length; i++) 
		{
			if (pFieldList[i].kind != 'normal') arrRemoveObjects[arrRemoveObjects.length] = pRows.rows[i];
		}
	}
	for (var i = 0; i < arrRemoveObjects.length; i++) 
	{
		var rowIndex = arrRemoveObjects[i].rowIndex;
		pRows.deleteRow(rowIndex);
	}
	
	return true;
}

function onPublishPropertiesScreenLoseFocus()
{
	return true;
}

function onTableInfoScreenFocus() 
{

    if (LumisPortalUtil.getElementChildrenWithName(document, '_Properties_TableName')[0].value.length == 0) 
		LumisPortalUtil.getElementChildrenWithName(document, '_Properties_TableName')[0].value = LumisPortalUtil.getElementChildrenWithName(document, '_Properties_Name')[0].value.replace(/ /gi, "_");
    LumisPortalUtil.getElementChildrenWithName(document, '_Properties_TableName')[0].focus();
    return true;
} 

function onTableInfoScreenLoseFocus() 
{
	return ValidateTableInfo();
}

function createDefaultTable() 
{
	var pForm = document.forms['FormProperties'];

	DeleteFieldsHTML();

	AddField('id', 'STR_ID', 'guid', true, false, false, false, 'normal');
	AddField('title', 'STR_TITLE', 'string', false, true, false, true, 'normal');
	AddField('introduction', 'STR_INTRODUCTION', 'text', false, false, true, true, 'normal');
	AddField('content', 'STR_CONTENT', 'html', false, false, false, true, 'normal');
}

function DeleteFieldsHTML() 
{
	var pDataFields = document.getElementById("_Data_Fields");
	while (pDataFields.rows.length) pDataFields.deleteRow(pDataFields.rows.length - 1);
}

function AddField(fName, fDisplayName, fDataType, fIsPK, fIsPN, fIsIN, fIsIS, fKind)
{
	AddBlankField();
	
	var pFieldID;
	var pFieldIDs = LumisPortalUtil.getElementChildrenWithName(document, '_DataFieldID');
	if (pFieldIDs.length)
		pFieldID = pFieldIDs[pFieldIDs.length-1];
	else
		pFieldID = pFieldIDs;
	
	var prefix = pFieldID.getAttribute('prefix');
	var pFieldKind = getFieldProperty(prefix, 'kind');
	var pFieldName = getFieldProperty(prefix, 'name');
	var pFieldDisplayName = getFieldProperty(prefix, 'displayName');
	var pFieldType = getFieldProperty(prefix, 'type');
	var pFieldPK = getFieldProperty(prefix, 'pk');
	var pFieldPN = getFieldProperty(prefix, 'pn');
	var pFieldIN = getFieldProperty(prefix, 'in');
	var pFieldIS = getFieldProperty(prefix, 'is');

	pFieldID.kind = fKind;
	pFieldKind.value = fKind;
	pFieldName.value = fName;
	pFieldDisplayName.value = fDisplayName;
	pFieldType.value = fDataType;
	pFieldPK.checked = fIsPK;
	pFieldPN.checked = fIsPN;
	pFieldIN.checked = fIsIN;
	pFieldIS.checked = fIsIS;
	if (fKind != 'normal') 
	{
		pFieldName.disabled = true;
		pFieldType.disabled = true;
		pFieldPK.disabled = true;
		pFieldPN.disabled = true;
		pFieldIN.disabled = true;
		pFieldIS.disabled = true;
	}
}

function onDataTypeChange(prefix)
{
	//if datatype boolean, fills the options with default values
	if(document.getElementsByName(prefix + 'type')[0].value == 'boolean')
	{
		document.getElementsByName(prefix + "valueOptions")[0].value = "true#ITEM#<%=ManagerFactory.getLocalizationManager().localize("STR_YES", resource, SessionConfig.getCurrentSessionConfig().getLocale())%>#ITEM#false#ITEM#<%=ManagerFactory.getLocalizationManager().localize("STR_NO", resource, SessionConfig.getCurrentSessionConfig().getLocale())%>";
		document.getElementsByName(prefix + "optValSrc")[0].value = "Fixed";
	}
	else
	{
		document.getElementsByName(prefix + "valueOptions")[0].value = "";
		document.getElementsByName(prefix + "optValSrc")[0].value = "";
	}
	// clears all the value options
	document.getElementsByName(prefix + "dbvTblName")[0].value = "";
	document.getElementsByName(prefix + "dbvTxClName")[0].value = "";
	document.getElementsByName(prefix + "dbvVlClName")[0].value = "";
	
	// removes fk div if it exists
	var div = document.getElementById(prefix + "fkDiv");
	if(div != null)
	{
		div.parentNode.removeChild(div);
	}
}

function AddBlankField()
{
	var pDataFields = document.getElementById("_Data_Fields");
	var pRow = pDataFields.insertRow(-1);
	pRow.height = "25";
	
	fieldNumber++;
	var prefix = 'field' + fieldNumber + '_';
	
	pRow.insertCell(0).innerHTML = '&nbsp;';
	pRow.insertCell(1).innerHTML = 	'<input type="hidden" name="fields" value="' + prefix + '"/>' + 
									'<input type="hidden" name="' + prefix + 'displayName" />' + 
									'<input type="hidden" name="' + prefix + 'defaultValue" />' + 
									'<input type="hidden" name="' + prefix + 'valueOptions" />' + 
									'<input type="hidden" name="' + prefix + 'optValSrc" />' + 
									'<input type="hidden" name="' + prefix + 'dbvTblName" />' + 
									'<input type="hidden" name="' + prefix + 'dbvTxClName" />' + 
									'<input type="hidden" name="' + prefix + 'dbvVlClName" />' + 
									'<input type="hidden" name="' + prefix + 'required" />' + 
									'<input type="hidden" name="' + prefix + 'pattern" />' + 
									'<input type="hidden" name="' + prefix + 'kind" />' + 
									'<INPUT  NAME="_DataFieldID" TYPE="checkbox" prefix="' + prefix + '" kind="normal" />';
	pRow.insertCell(2).innerHTML = '<INPUT  NAME="' + prefix + 'name" ID="' + prefix + 'name" class="cInputText" TYPE="text" VALUE="" style="width:165" />';
	pRow.insertCell(3).innerHTML = '<SELECT NAME="' + prefix + 'type" class="cInputText" style="width:130" onchange="onDataTypeChange(\'' + prefix + '\');">' + RenderDataTypeOptions() + '</SELECT>';
	pRow.insertCell(4).innerHTML = '<INPUT  NAME="' + prefix + 'pk" TYPE="checkbox" value="true" onClick="onPKClick(this);" />';
	pRow.insertCell(5).innerHTML = '<INPUT  NAME="' + prefix + 'pn" TYPE="checkbox" value="true" onClick="onPNClick(this);" />';
	pRow.insertCell(6).innerHTML = '<INPUT  NAME="' + prefix + 'in" TYPE="checkbox" value="true" onClick="onINClick(this);" />';
	pRow.insertCell(7).innerHTML = '<INPUT  NAME="' + prefix + 'is" TYPE="checkbox" value="true" />';
	pRow.insertCell(8).innerHTML = '&nbsp;';
	pRow.cells[0].width = "10px";
	pRow.cells[1].width = "40px";
	pRow.cells[2].width = "180px";
	pRow.cells[3].width = "160px";
	pRow.cells[4].width = "30px";
	pRow.cells[5].width = "30px";
	pRow.cells[6].width = "30px";
	pRow.cells[7].width = "30px";
	pRow.cells[8].width = "";
	try { pRow.cells[2].childNodes[0].focus(); } catch (e) { }
}

function getFieldProperty(fieldPrefix, propertyName)
{
	return LumisPortalUtil.getElementChildrenWithName(document, fieldPrefix + propertyName)[0];;
}

function RemoveFields() 
{
	var pFieldList = LumisPortalUtil.getElementChildrenWithName(document, '_DataFieldID');
	var pRows = document.getElementById("_Data_Fields");
	var arrRemoveObjects = new Array();
	if (pFieldList && !pFieldList.length) {
		if (pFieldList.checked) arrRemoveObjects[arrRemoveObjects.length] = pRows.rows[0];
	} else if (pFieldList) {
		for (var i = 0; i < pFieldList.length; i++) {
			if (pFieldList[i].checked) arrRemoveObjects[arrRemoveObjects.length] = pRows.rows[i];
		}
	}
	if (!arrRemoveObjects.length) {
		alert("<%=ManagerFactory.getLocalizationManager().localize("STR_NO_FIELD_SELECTED_TO_REMOVE", resource, SessionConfig.getCurrentSessionConfig().getLocale())%>");
	}
	for (var i = 0; i < arrRemoveObjects.length; i++) 
	{
		var rowIndex = arrRemoveObjects[i].rowIndex;
		var pField = LumisPortalUtil.getElementChildrenWithName(document, '_DataFieldID')[rowIndex];
		if (pField.kind == 'normal') 
		{
			pRows.deleteRow(rowIndex);
			
			// removes fk div (if it exists)
			var prefix = pField.prefix;
			if(prefix != null)
			{
				var div = document.getElementById(prefix + "fkDiv");
				if(div != null)
				{
					div.parentNode.removeChild(div);
				}
			}
		} 
		else 
		{
			var strFieldName = LumisPortalUtil.getElementChildrenWithName(document, pField.getAttribute('prefix') + 'name')[0].value;
			alert("<%=ManagerFactory.getLocalizationManager().localize("STR_STR_FIELD_CANOT_BE_DELETED_BEGINNAME", resource, SessionConfig.getCurrentSessionConfig().getLocale())%> "
			 + strFieldName + 
			 " <%=ManagerFactory.getLocalizationManager().localize("STR_FIELD_CANOT_BE_DELETED_END", resource, SessionConfig.getCurrentSessionConfig().getLocale())%>");
		}
	}
}

function onFinishScreenFocus() 
{
	var strInformationHTML = "";
    strInformationHTML += "<div><%=ManagerFactory.getLocalizationManager().localize("STR_NAME", resource, SessionConfig.getCurrentSessionConfig().getLocale())%>: " + LumisPortalUtil.getElementChildrenWithName(document, '_Properties_Name')[0].value + "</div>";
    strInformationHTML += "<div><%=ManagerFactory.getLocalizationManager().localize("STR_DESCRIPTION", resource, SessionConfig.getCurrentSessionConfig().getLocale())%>: " + LumisPortalUtil.getElementChildrenWithName(document, '_Properties_Description')[0].value + "</div>";
    strInformationHTML += "<div><%=ManagerFactory.getLocalizationManager().localize("STR_INSTALATION_FOLDER", resource, SessionConfig.getCurrentSessionConfig().getLocale())%>: " + LumisPortalUtil.getElementChildrenWithName(document, '_Properties_InstallURL')[0].value + "</div> <br>";
	if (LumisPortalUtil.getElementChildrenWithName(document, '_Properties_SupportWorkflow')[0].checked) strInformationHTML += "<div><%=ManagerFactory.getLocalizationManager().localize("STR_WORFLOW_INSERT", resource, SessionConfig.getCurrentSessionConfig().getLocale())%></div>";
	if (LumisPortalUtil.getElementChildrenWithName(document, '_Properties_Comments')[0].checked) strInformationHTML += "<div><%=ManagerFactory.getLocalizationManager().localize("STR_COMMENTS_INSERT", resource, SessionConfig.getCurrentSessionConfig().getLocale())%></div>";
	if (LumisPortalUtil.getElementChildrenWithName(document,'_Properties_StartDate')[0].checked) strInformationHTML += "<div><%=ManagerFactory.getLocalizationManager().localize("STR_PUBLISH_DATE_INSERT", resource, SessionConfig.getCurrentSessionConfig().getLocale())%></div>";
	if (LumisPortalUtil.getElementChildrenWithName(document,'_Properties_EndDate')[0].checked) strInformationHTML += "<div><%=ManagerFactory.getLocalizationManager().localize("STR_EXPIRE_DATE_INSERT", resource, SessionConfig.getCurrentSessionConfig().getLocale())%></div>";
	if (LumisPortalUtil.getElementChildrenWithName(document,'_Properties_Highlight')[0].checked) strInformationHTML += "<div><%=ManagerFactory.getLocalizationManager().localize("STR_DETACHED_INSERT", resource, SessionConfig.getCurrentSessionConfig().getLocale())%></div>";
	if (LumisPortalUtil.getElementChildrenWithName(document,'_Properties_EndHighlightDate')[0].checked) strInformationHTML += "<div><%=ManagerFactory.getLocalizationManager().localize("STR_EXPIRE_DETACHED_INSERT", resource, SessionConfig.getCurrentSessionConfig().getLocale())%></div>";
	if (LumisPortalUtil.getElementChildrenWithName(document,'_Properties_PublishToServiceInst')[0].checked) strInformationHTML += "<div><%=ManagerFactory.getLocalizationManager().localize("STR_MULTIPLE_PUBLISH", resource, SessionConfig.getCurrentSessionConfig().getLocale())%></div>";
	if (LumisPortalUtil.getElementChildrenWithName(document,'_Properties_PublishToUserAndGroup')[0].checked) strInformationHTML += "<div><%=ManagerFactory.getLocalizationManager().localize("STR_PUBLISH_USERS_GROUPS", resource, SessionConfig.getCurrentSessionConfig().getLocale())%></div>";
	if (LumisPortalUtil.getElementChildrenWithName(document,'_Properties_SupportVersioning')[0].checked) strInformationHTML += "<div><%=ManagerFactory.getLocalizationManager().localize("STR_CONTENT_VERSION", resource, SessionConfig.getCurrentSessionConfig().getLocale())%></div>";
	if (LumisPortalUtil.getElementChildrenWithName(document,'_Properties_SupportAssociation')[0].checked) strInformationHTML += "<div><%=ManagerFactory.getLocalizationManager().localize("STR_ASSOCIATION_CONTENT", resource, SessionConfig.getCurrentSessionConfig().getLocale())%></div>";
	if (LumisPortalUtil.getElementChildrenWithName(document,'_Properties_SupportMultilanguage')[0].checked) strInformationHTML += "<div><%=ManagerFactory.getLocalizationManager().localize("STR_CONTENT_MULTIDIOMAS", resource, SessionConfig.getCurrentSessionConfig().getLocale())%></div>";

    document.getElementById("WizardFinishInformation").innerHTML = strInformationHTML;
    return true;
} 

function onNameBlur() 
{
    var pForm = document.forms['FormProperties'];
    var strName = pForm.elements['_Properties_Name'].value;
    if (strName.length > 0) 
    {
        if (pForm.elements['_Properties_Description'].value.length == 0) pForm.elements['_Properties_Description'].value = strName;
        if (pForm.elements['_Properties_InstallURL'].value.length == 0) pForm.elements['_Properties_InstallURL'].value = "CustomServices/" + strName.replace(/ /gi, "_");
    }
} 

function onPropertyHighlightClick() 
{
    var pForm = document.forms['FormProperties'];
    if (!pForm.elements['_Properties_Highlight'].checked) 
    {
        pForm.elements['_Properties_EndHighlightDate'].checked = false;
    }
} 

function onPropertyEndHighlightDateClick() 
{
    var pForm = document.forms['FormProperties'];
    if (pForm.elements['_Properties_EndHighlightDate'].checked) 
	{
        pForm.elements['_Properties_Highlight'].checked = true;
    } 
} 

function onSaveClick() 
{
	var pForm = document.forms['FormProperties'];
	var response = makeHttpRequestFromForm(pForm.action, pForm, null, false, null);
	if (response == 'ok')
	{
		try	{ LumisPortal.opener.LumisPortal.onRefresh();if(window.self != window.top && window.parent.$ && window.parent.LumisLightBox){LumisLightBox.close();}else{window.close();} }	catch(e) {}
	}
	else
		alert(response);
}

function OpenAdvancedProperties() 
{
	var pFields = LumisPortalUtil.getElementChildrenWithName(document, '_DataFieldID');
	var pSelectedFieldPrefix = null;
	var iNumFieldsChecked = 0;
	if (pFields && !pFields.length) 
	{
		if (pFields.checked) 
			pSelectedField = pFields;
	} 
	else if (pFields) 
	{
		for (var i = 0; i < pFields.length; i++) 
		{
			if (pFields[i].checked) 
			{
				pSelectedFieldPrefix = pFields[i].getAttribute('prefix');
				iNumFieldsChecked++;
			}
		}
		if (iNumFieldsChecked > 1) 
		{
			alert("<%=ManagerFactory.getLocalizationManager().localize("STR_MORE_THAN_ONE_FIELD_SELECTED_TO_EDIT", resource, SessionConfig.getCurrentSessionConfig().getLocale())%>");
			return;
		}
	}
	if (!pSelectedFieldPrefix) 
	{
		alert("<%=ManagerFactory.getLocalizationManager().localize("STR_NO_FIELD_SELECTED_TO_EDIT", resource, SessionConfig.getCurrentSessionConfig().getLocale())%>");
		return;
	}

	var strURL = "lumis/service/contentmanagement/wizard/add_AdvancedProperty.jsp";
	fieldCaller = this;
	fieldPrefix = pSelectedFieldPrefix;
	var retVal = modalWin(strURL, [this, pSelectedFieldPrefix], "dialogHeight: 460px; dialogWidth: 600px; scroll:no; status:no; help:no");
}
function modalWin(url, name, properties) 
{
	if (window.showModalDialog) 
		window.showModalDialog(url, name, properties);
	else
		window.open(url, name, properties + 'modal=yes');
}

/*** Validações ***/
function onPKClick(pElement) 
{
	var pFields = LumisPortalUtil.getElementChildrenWithName(document, '_DataFieldID');
	if (pElement.checked == true && pFields.length) 
	{
		for (var i = 0; i < pFields.length; i++) 
		{
			var pPkField = getFieldProperty(pFields[i].getAttribute('prefix'), 'pk');
			if (pPkField != pElement) pPkField.checked = false;
		}
	}
	if (!pElement.checked) 
		pElement.checked = true;
}
function onPNClick(pElement) 
{
	var pFields = LumisPortalUtil.getElementChildrenWithName(document, '_DataFieldID');
	if (pElement.checked == true && pFields.length) 
	{
		for (var i = 0; i < pFields.length; i++) 
		{
			var pPnField = getFieldProperty(pFields[i].getAttribute('prefix'), 'pn');
			if (pPnField != pElement) pPnField.checked = false;
		}
	}
}
function onINClick(pElement) 
{
	var pFields = LumisPortalUtil.getElementChildrenWithName(document, '_DataFieldID');
	if (pElement.checked == true && pFields.length) 
	{
		for (var i = 0; i < pFields.length; i++) 
		{
			var pInField = getFieldProperty(pFields[i].getAttribute('prefix'), 'in');
			if (pInField != pElement) pInField.checked = false;
		}
	}
}

function ValidateProperties(bValidatePath) 
{
	if (bValidatePath == null) 
		bValidatePath = true;
	var pForm = document.forms['FormProperties'];
	if (pForm.elements['_Properties_Name'].value.length == 0) 
	{
		pForm.elements['_Properties_Name'].focus();
		alert("<%=ManagerFactory.getLocalizationManager().localize("STR_PLEASE_FILLS_THE_SERVICE_NAME", resource, SessionConfig.getCurrentSessionConfig().getLocale())%>");
		return false;
	}
	
	if (!ValidateString(pForm.elements['_Properties_Name'].value))
	{
		alert("<%=ManagerFactory.getLocalizationManager().localize("STR_INVALID_SERVICE_NAME", resource, SessionConfig.getCurrentSessionConfig().getLocale())%>");
		return false;
	}
	
	if (pForm.elements['_Properties_Description'].value.length == 0) 
	{
		pForm.elements['_Properties_Description'].focus();
		alert("<%=ManagerFactory.getLocalizationManager().localize("STR_PLEASE_FILLS_THE_SERVICE_DESCRIPTION", resource, SessionConfig.getCurrentSessionConfig().getLocale())%>");
		return false;
	}
	if (pForm.elements['_Properties_InstallURL'].value.length == 0) 
	{
		pForm.elements['_Properties_InstallURL'].focus();
		alert("<%=ManagerFactory.getLocalizationManager().localize("STR_PLEASE_FILLS_THE_INSTALL_PATH", resource, SessionConfig.getCurrentSessionConfig().getLocale())%>");
		return false;
	}
	if (bValidatePath) 
		if (!ValidatePath()) return false;
	return true;
}

function ValidatePath() 
{
	var pForm = document.forms['FormProperties'];
	var strPath = pForm.elements['_Properties_InstallURL'].value;
	pForm.elements['_Properties_InstallURL'].value = strPath.replace(/\/\//gi, "/");
	var strTemp = strPath.replace(/\//gi, "");
	if (!ValidateString(strTemp)) {
		alert("<%=ManagerFactory.getLocalizationManager().localize("STR_INVALID_INSTALL_PATH", resource, SessionConfig.getCurrentSessionConfig().getLocale())%>");
		return false;
	}
	return true;
}

function ValidatePublish() 
{
	return true;
}

function ValidateTableName(strServiceType) 
{
	return true;
}

function ValidateTableInfo(bValidateTableName) 
{
	var pForm = document.forms['FormProperties'];
	if (bValidateTableName == null) bValidateTableName = true;
	if (!ValidateString(pForm.elements['_Properties_TableName'].value)) 
	{
		document.getElementById('_Properties_TableName').focus();
		alert("<%=ManagerFactory.getLocalizationManager().localize("STR_INVALID_TABLE_NAME", resource, SessionConfig.getCurrentSessionConfig().getLocale())%>");
		return false;
	}
	
	if(document.getElementsByName("_Properties_CreateFKs")[0].checked)
	{
		for(var i = 1; i <= arrIndex; i++)
		{
			var prefix = 'field' + i + '_';
			var fkNameElem = document.getElementById(prefix + 'dbvFkName');
			var crFkChElem = document.getElementById(prefix + 'dbvCrFk');
			if(crFkChElem != null && crFkChElem.checked && fkNameElem != null)
			{
				if(!/^[\w]+$/i.test(fkNameElem.value))
				{
					alert("<%=ManagerFactory.getLocalizationManager().localize("STR_INVALID_FOREIGN_KEY_NAME", resource, SessionConfig.getCurrentSessionConfig().getLocale())%>: " + fkNameElem.value);
					return false;
				}
			}
		}
	}
	
	
	if (bValidateTableName) 
		if (!ValidateTableName()) return false;
		
	var pFieldIDList = LumisPortalUtil.getElementChildrenWithName(document, '_DataFieldID');
	if (!pFieldIDList) 
	{
		alert("<%=ManagerFactory.getLocalizationManager().localize("STR_MUST_DEFINE_A_FIELD", resource, SessionConfig.getCurrentSessionConfig().getLocale())%>");
		return false;
	}
	if (!pFieldIDList.length) 
	{
		var pFieldName = getFieldProperty(pFieldIDList.getAttribute('prefix'), 'name');
		if (!ValidateString(pFieldName.value)) 
		{
			pFieldName.focus();
			alert("<%=ManagerFactory.getLocalizationManager().localize("STR_INVALID_NAME", resource, SessionConfig.getCurrentSessionConfig().getLocale())%> (" + pFieldName.value + ")");
			return false;
		}
	}
	else 
	{
		var bPKFound = false;
		for (var i = 0; i < pFieldIDList.length; i++) 
		{
			var pFieldName = getFieldProperty(pFieldIDList[i].getAttribute('prefix'), 'name');
			for (var j = (i + 1); j < pFieldIDList.length; j++) 
			{
				var otherName = getFieldProperty(pFieldIDList[j].getAttribute('prefix'), 'name').value;
				if (pFieldName.value == otherName) 
				{
					alert("<%=ManagerFactory.getLocalizationManager().localize("STR_DUPLICATED_FIELD", resource, SessionConfig.getCurrentSessionConfig().getLocale())%> (" + otherName + ")");
					return false;
				}
			}
			if (!ValidateString(pFieldName.value)) 
			{
				pFieldName.focus();
				alert("<%=ManagerFactory.getLocalizationManager().localize("STR_INVALID_NAME", resource, SessionConfig.getCurrentSessionConfig().getLocale())%> (" + pFieldName.value + ")");
				return false;
			}
			if (getFieldProperty(pFieldIDList[i].getAttribute('prefix'), 'pk').checked) bPKFound = true;
		}
		if (!bPKFound) 
		{
			alert("<%=ManagerFactory.getLocalizationManager().localize("STR_NO_PRIMARY_KEY_SELECTED", resource, SessionConfig.getCurrentSessionConfig().getLocale())%>");
			return false;
		}
	}
	return true;
}

function ValidateString(str) 
{
	if (!str) return false;
	if (str.length == 0) return false;
	if (str == "default") return false;
	if (str.search(" ") != -1) return false;
	var strTemp = "<<<" + str + ">>>";
	var strPattern = /<<<([a-zA-Z_])+([A-Za-z0-9_])*>>>/gi;
	var iPos = strTemp.search(strPattern);
	if (iPos == -1) return false;
	return true;
}

function makeHttpRequestFromForm(url, form, onReadyStateChangeMethod, bReturnXml, xmlhttp)
{
	var data = '';
	for (i=0; i< form.elements.length; i++)
	{
		var element = form.elements[i];
		if (element.type == 'checkbox' && !element.checked)
			continue;

		if (data.length > 0)
			data += '&';
		data += encodeURI(element.name) + '=' + encodeURI(element.value);
	}

	var bAsync = false;
	
	if(onReadyStateChangeMethod != null)
		bAsync = true;

	if(xmlhttp == null)	
		xmlhttp = LumisPortalUtil.getXmlHttpObject();

	xmlhttp.open("POST", url, bAsync);
	xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

	if(bAsync)
		xmlhttp.onreadystatechange = onReadyStateChangeMethod;

	xmlhttp.send(data);

	if(!bAsync)
	{
		if(bReturnXml)
			return xmlhttp.responseXML;
		else
			return xmlhttp.responseText;
	}
}


