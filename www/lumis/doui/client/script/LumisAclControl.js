// $Revision: 17115 $ $Date: 2015-03-19 16:44:30 -0300 (Thu, 19 Mar 2015) $
var curPrincipal = null;
var permissionDependencies = new Array();
var permissionsArray = new Array();
var defaultPermission = "";
var nItemPrincipals=null;
var requiredForWorkflowRoles = new Array();

function SetRequiredForWorkflowRole(permissionId)
{
	requiredForWorkflowRoles[requiredForWorkflowRoles.length] = permissionId;
	
	return requiredForWorkflowRoles.length;
}

function AddPrincipal(strPrincipalId, strPrincipalName, strPrincipalShortId, icon)
{
	var pPrincipalIds = document.getElementsByName("principalId");
	for(var i=0; i<pPrincipalIds.length; i++)
	{
		if(pPrincipalIds[i].value==strPrincipalId)
			return;
	}
	
	if ( nItemPrincipals == null )
	{
		var aPrincipals = document.getElementById("principals");
		nItemPrincipals=aPrincipals.children[aPrincipals.children.length-1].listPosition;
	}	
	
	nItemPrincipals++;

	if(!pPrincipalIds.length)
		pPrincipalIds = new Array(pPrincipalIds);

	var pPrincipalsElement	= document.getElementById("principals");
	
	var pSecondElement = document.createElement("DIV");
	pSecondElement.setAttribute("id", "div" + nItemPrincipals);
	pSecondElement.setAttribute("principalId", strPrincipalId);
	pSecondElement.setAttribute("listPosition", nItemPrincipals);
	pSecondElement.style.padding="5px";
	
	pPrincipalsElement.appendChild(pSecondElement);
	
	
	var pInfoElement =document.createElement('SPAN');
	pSecondElement.appendChild(pInfoElement);
	
	var pIconElement=document.createElement('SPAN');
	pSecondElement.appendChild(pIconElement);

	
	var pNameElement =document.createElement('SPAN');
	pNameElement.setAttribute("id", "PrincipalName" + nItemPrincipals);
	pNameElement.setAttribute("listPosition", nItemPrincipals);
	pNameElement.style.paddingLeft="5px";
	pSecondElement.appendChild(pNameElement);
	
	var strPrincipalInfo = "";
	strPrincipalInfo += '<input type="checkbox" name="principal" id="principal" value="'+strPrincipalId+'"/>';
	strPrincipalInfo += '<input type="hidden" name="principalId" value="'+strPrincipalId+'"/>';
	strPrincipalInfo += '<input type="hidden" id="principalInheriting" name="principalInheriting'+strPrincipalId+'" value="0"/>';
	strPrincipalInfo += '<input type="hidden" id="allowPermissions" name="allow'+strPrincipalId+'" value="'+defaultPermission+'"/>';
	strPrincipalInfo += '<input type="hidden" id="allowPermissionsInheriting" name="allowInheriting'+strPrincipalId+'" value="0"/>';
	strPrincipalInfo += '<input type="hidden" id="denyPermissions" name="deny'+strPrincipalId+'" value="0"/>';
	strPrincipalInfo += '<input type="hidden" id="denyPermissionsInheriting" name="denyInheriting'+strPrincipalId+'" value="0"/>';	
	
	for (i=0; i<workflowRoles.length; i++)
	{
		strPrincipalInfo += '<input type="hidden" id="workflow-' + strPrincipalId + '-' + workflowRoles[i] + '-1" name="workflow-' + strPrincipalId + '-' + workflowRoles[i] + '-1" value="0" />';	
		strPrincipalInfo += '<input type="hidden" id="workflow-' + strPrincipalId + '-' + workflowRoles[i] + '-2" name="workflow-' + strPrincipalId + '-' + workflowRoles[i] + '-2" value="0" />';	
	}
			
	pInfoElement.innerHTML = strPrincipalInfo;
	pNameElement.innerHTML = strPrincipalName + ' (' + strPrincipalShortId + ')';
	pIconElement.innerHTML = '<img src="' + icon + '"/>';
	
	pSecondElement.onclick = onPrincipalClicked;	
}

function RemoveSelectedPrincipal()
{
	var pPrincipalsElement	= document.getElementById("principals");
	var pPrincipalIds = document.getElementsByName("principal");

	if(pPrincipalIds.length == 1)
	{
		alert(g_strAclStrings["STR_REMOVE_ENTRY_NOT_ALLOWED"]);
		return;
	}
	
	for(var i=pPrincipalIds.length-1; i>=0; i--)
	{
		if(pPrincipalIds[i].checked)
		{
			var pRow = pPrincipalIds[i].parentNode.parentNode;
			pPrincipalsElement.removeChild(pRow);			
		}
	}
	
	handlePrincipalClicked(pPrincipalsElement.firstChild.firstChild.firstChild); 
}

var g_curSelectedDiv = null;

function onPrincipalClicked(e)
{
	var curElement = null;
	var curEvent = e;

	if(curEvent == null)
		curEvent = window.event;
	
	if(curEvent.target)
		curElement = curEvent.target;
	else
		curElement = curEvent.srcElement;
	
	handlePrincipalClicked(curElement);
}

function handlePrincipalClicked(curElement)
{
	while(curElement.tagName.toLowerCase() != "div")
		curElement = curElement.parentNode;

	if(curPrincipal)
		curPrincipal.className = "";
	curPrincipal = curElement;
	
	curPrincipal.className = "cLumOddRow";
	
	var curPrincipalId = curElement.getAttribute("principalId");

	var allow = (document.getElementsByName("allow"+curPrincipalId))[0].value;
	var allowInheriting = (document.getElementsByName("allowInheriting"+curPrincipalId))[0].value;
	var deny = (document.getElementsByName("deny"+curPrincipalId))[0].value;
	var denyInheriting = (document.getElementsByName("denyInheriting"+curPrincipalId))[0].value;
	
	var permissionsTable = document.getElementById("permissions");
	var totalPermissions = permissionsTable.rows.length;
	
	for(var i=0; i < totalPermissions; i++)
	{
		var curRowId = permissionsTable.rows[i].firstChild.getAttribute("id");
		document.getElementById("allowPermission"+curRowId).checked = (allow & (1<<i));
		document.getElementById("allowPermission"+curRowId).disabled = (allowInheriting & (1<<i));
		document.getElementById("denyPermission"+curRowId).checked = (deny & (1<<i));
		document.getElementById("denyPermission"+curRowId).disabled = (denyInheriting & (1<<i));
	}
	
	var workflowPermissionsTable = document.getElementById("workflowPermissions");
	if (workflowPermissionsTable)
	{
		var totalWorkflowPermissions = workflowPermissionsTable.rows.length;
		for(var i=0; i < totalWorkflowPermissions; i++)
		{	
			var curWorkflowPermId = workflowPermissionsTable.rows[i].firstChild.id;
			var cbAllow = document.querySelector("input[name='allow"+curWorkflowPermId+"'][role='"+curWorkflowPermId+"']");
			cbAllow.checked = document.getElementById("workflow-" + curPrincipal.getAttribute("principalId") + "-" + cbAllow.getAttribute("role") + "-1").value == 1;
			var cbDeny = document.querySelector("input[name='deny"+curWorkflowPermId+"'][role='"+curWorkflowPermId+"']");
			cbDeny.checked = document.getElementById("workflow-" + curPrincipal.getAttribute("principalId") + "-" + cbDeny.getAttribute("role") + "-2").value == 1;
		}
	}
	
	var iIndexCurDiv = null;

	if(curElement)
		iIndexCurDiv = parseInt(curElement.listPosition, 10);
	if(curElement != g_curSelectedDiv)
	{
		if(g_curSelectedDiv)
		{			
			g_curSelectedDiv.style.backgroundColor = "#FFF";
		}
		g_curSelectedDiv = curElement;
		g_curSelectedDiv.style.backgroundColor="#fdeccc";
	}

	document.getElementById('showNameSelected').innerHTML='<span>' + curElement.children[1].innerHTML + '</span>' +
			'<span style="padding-left:5px">' + curElement.children[2].innerHTML + '</span>';
}

function onInheritingClicked(strFormName,strServiceInterfaceInstance)
{
	var curValue = document.getElementById("aclInheriting").checked;
	var bResponse = true;
	if(curValue == true)
		bResponse = window.confirm(g_strAclStrings["STR_CONFIRM_INHERIT"]);
	else
		bResponse = window.confirm(g_strAclStrings["STR_CONFIRM_REMOVE_INHERITANCE"]);
		
	if(!bResponse)
	{
		document.getElementById("aclInheriting").checked = !curValue;
		return;
	}
	
	if(!curValue)
	{
		var aPrincipals = document.getElementById("principals");
		var pPrincipalIds = document.getElementsByName("principal");

		for(var i=0; i < pPrincipalIds.length; i++)
		{
			var curPrincipalId = pPrincipalIds[i].value;
			document.getElementsByName("allowInheriting"+curPrincipalId)[0].value = 0;
			document.getElementsByName("denyInheriting"+curPrincipalId)[0].value = 0;
			document.getElementsByName("principalInheriting"+curPrincipalId)[0].value = 0;
			pPrincipalIds[i].disabled = false;
		}
		
		handlePrincipalClicked(pPrincipalIds[0]); 

		var permissionsTable = document.getElementById("permissions");
	
		var totalPermissions = pPrincipalIds;
		for(var i=0; i < totalPermissions; i++)
		{
			var curPrincipalId = pPrincipalIds[i].value;
			permissionModified(document.getElementsByName("deny"+curPrincipalId)[0], "deny" , "allow");
		}
	}
	else
	{
		document.forms[strFormName].elements['doui_processActionId'].value='updateDataAndContinueEditing';
		LumisPortal.onSubmitForm(strFormName,strServiceInterfaceInstance, null, true);
	}
}

function onWorkflowAllowClicked(e)
{
	var curElement = null;
	var curEvent = e;

	if(curEvent == null)
		curEvent = window.event;
	
	if(curEvent.target)
		curElement = curEvent.target;
	else
		curElement = curEvent.srcElement;

	onWorkflowAllowDenyClicked(curElement, "1")
}

function onWorkflowDenyClicked(e)
{
	var curElement = null;
	var curEvent = e;

	if(curEvent == null)
		curEvent = window.event;
	
	if(curEvent.target)
		curElement = curEvent.target;
	else
		curElement = curEvent.srcElement;

	onWorkflowAllowDenyClicked(curElement, "2")
}

function onWorkflowAllowDenyClicked(clickedCheckbox, type)
{
	var id = clickedCheckbox.getAttribute('id');
	var newValue;
	if (clickedCheckbox.checked)
	{
		newValue = 1;
		if(id == "allow")
		{
			document.querySelector("input[name='deny"+clickedCheckbox.getAttribute("role")+"'][role='"+clickedCheckbox.getAttribute("role")+"']").checked = false;
			document.getElementById("workflow-" + curPrincipal.getAttribute("principalId") + "-" + clickedCheckbox.getAttribute("role") + "-2").value = 0;
			
			try
			{
				for(var i=0; i<requiredForWorkflowRoles.length; i++)
				{
					var currentPermissionId = requiredForWorkflowRoles[i];
					var currentAllowPermission = document.getElementById('allowPermission'+currentPermissionId);
					
					if(currentAllowPermission)
					{
						if(currentAllowPermission.checked == false)
						{
							currentAllowPermission.disabled = false;
							currentAllowPermission.checked = true;
							
							permissionModified(currentAllowPermission, "allow" , "deny");
							document.getElementById('denyPermission'+currentPermissionId).checked = false;
						}
					}
				}
			}
			catch(e){}
		}
		else
		{
			document.querySelector("input[name='allow"+clickedCheckbox.getAttribute("role")+"'][role='"+clickedCheckbox.getAttribute("role")+"']").checked = false;
			document.getElementById("workflow-" + curPrincipal.getAttribute("principalId") + "-" + clickedCheckbox.getAttribute("role") + "-1").value = 0;
		}
	}
	else
		newValue = 0;
	document.getElementById("workflow-" + curPrincipal.getAttribute("principalId") + "-" + clickedCheckbox.getAttribute("role") + "-" + type).value = newValue;
}


function onAllowClicked(e)
{
	var curElement = null;
	var curEvent = e;

	if(curEvent == null)
		curEvent = window.event;
	
	if(curEvent.target)
		curElement = curEvent.target;
	else
		curElement = curEvent.srcElement;
	
	permissionModified(curElement, "allow" , "deny");
}

function onDenyClicked(e)
{
	var curElement = null;
	var curEvent = e;

	if(curEvent == null)
		curEvent = window.event;
	
	if(curEvent.target)
		curElement = curEvent.target;
	else
		curElement = curEvent.srcElement;
	
	permissionModified(curElement, "deny" , "allow");
}

function permissionModified(srcElement, columnModified, otherColumn, bRecursiveCall)
{
	var srcPermissionId = srcElement.name.substring(columnModified.length);
	var permissionsTable = document.getElementById("permissions");

	if(srcElement.checked)
	{
		if(columnModified == "allow")
		{
			// check allow on implied columns
			var bCheckAll = false;
			var permissionDependencyArray = permissionDependencies[srcPermissionId].split(";");
			for(var i=0; i < permissionDependencyArray.length; i++)
			{
				if(permissionDependencyArray[i] == "*")
				{
					bCheckAll = true;
					break;
				}
				
				if(permissionDependencyArray[i] == "")
					continue;
	
				var dependentPermission = document.getElementById(columnModified+"Permission"+permissionDependencyArray[i]);
				dependentPermission.checked = true;
			}
			
			if(bCheckAll)
			{
				var totalPermissions = permissionsTable.rows.length;
				for(var i=0; i < totalPermissions; i++)
				{
					var curPermissionId = permissionsTable.rows[i].firstChild.id;
					document.getElementById(columnModified+"Permission"+curPermissionId).checked = true;
				}
			}
		}
		else
		{
			// check deny on implied columns (inverse direction of implies definition)
			for (var i=0; i<permissionsArray.length; i++)
			{
				var checkCurrent = false;
				var permissionDependencyArray = permissionDependencies[permissionsArray[i]].split(";");

				for(var j=0; j < permissionDependencyArray.length; j++)
				{
					if(permissionDependencyArray[j] == "")
						continue;

					if(permissionDependencyArray[j] == "*" || 
						permissionDependencyArray[j] == srcPermissionId)
					{
						checkCurrent = true;
						break;
					}
				}

				if (checkCurrent)
				{
					var curPermissionId = permissionsTable.rows[i].firstChild.id;
					document.getElementById("denyPermission"+curPermissionId).checked = true;
				}
			}
		}
	}
	else
	{
		if (columnModified == "allow")
		{
			for(var i=0; i < permissionsArray.length; i++)
			{
				var permissionDependency = permissionDependencies[permissionsArray[i]];
				var permissionDependencyArray = permissionDependency.split(";");
				
				for(var j=0; j < permissionDependencyArray.length; j++)
				{
					if(permissionDependencyArray[j] == srcPermissionId || permissionDependencyArray[j] == "*")
					{
						var curPermissionId = permissionsTable.rows[i].firstChild.id;
						document.getElementById(columnModified+"Permission"+curPermissionId).checked = false;
						break;
					}
				}
			}
		}
		else
		{
			var bUncheckAll = false;
			var permissionDependencyArray = permissionDependencies[srcPermissionId].split(";");
			for(var i=0; i < permissionDependencyArray.length; i++)
			{
				if(permissionDependencyArray[i] == "*")
				{
					bUncheckAll = true;
					break;
				}
				
				if(permissionDependencyArray[i] == "")
					continue;
	
				var dependentPermission = document.getElementById(columnModified+"Permission"+permissionDependencyArray[i]);
				dependentPermission.checked = false;
			}
			if(bUncheckAll)
			{
				var totalPermissions = permissionsTable.rows.length;
				for(var i=0; i < totalPermissions; i++)
				{
					var curPermissionId = permissionsTable.rows[i].firstChild.id;
					document.getElementById(columnModified+"Permission"+curPermissionId).checked = false;
				}
			}
		}
	}

	var totalPermissions = permissionsTable.rows.length;
	
	if(!bRecursiveCall)
	{
		for(var i=0; i < totalPermissions; i++)
		{
			var curPermissionId = permissionsTable.rows[i].firstChild.id;
			if(document.getElementById(columnModified+"Permission"+curPermissionId).checked == true &&
				(bCheckAll || !document.getElementById(columnModified+"Permission"+curPermissionId).disabled) &&
				document.getElementById(otherColumn+"Permission"+curPermissionId).checked == true)
			{
				if(!document.getElementById(otherColumn+"Permission"+curPermissionId).disabled)
				{
					document.getElementById(otherColumn+"Permission"+curPermissionId).checked = false;
					permissionModified(document.getElementById(otherColumn+"Permission"+curPermissionId), otherColumn, columnModified, true);
				}
			}
		}
	}
	
	var allow = 0;
	var deny = 0;
	for(var i=0; i < totalPermissions; i++)
	{
		var curRowId = permissionsTable.rows[i].firstChild.getAttribute("id");
		
		if(document.getElementById("allowPermission"+curRowId).checked == true)
			allow = allow | 1<<i;
		if(document.getElementById("denyPermission"+curRowId).checked == true)
			deny = deny | 1<<i;
	}

	document.getElementsByName("allow"+curPrincipal.getAttribute("principalId"))[0].value=allow;
	document.getElementsByName("deny"+curPrincipal.getAttribute("principalId"))[0].value=deny;
}
