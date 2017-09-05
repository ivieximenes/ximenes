// $Revision: 8678 $ $Date: 2007-12-27 13:49:06 -0200 (Thu, 27 Dec 2007) $
function AddPrincipal(strPrincipalId, strPrincipalName)
{
	var pPrincipalIds = document.getElementsByName("principalId");

	if(pPrincipalIds)
	{
		if(!pPrincipalIds.length)
			pPrincipalIds = new Array(pPrincipalIds);
	
		for(var i=0; i<pPrincipalIds.length; i++)
		{
			if(pPrincipalIds[i].value==strPrincipalId)
				return;
		}
	}
	
	var pPrincipalsElement	= document.getElementById("principals");
	
	var pRow  = pPrincipalsElement.insertRow(0);

	var strPrincipalInfo = "";
	strPrincipalInfo += '<input type="checkbox" name="principal" id="principal" value="'+strPrincipalId+'"/>';
	strPrincipalInfo += '<input type="hidden" name="principalId" id="principalId" value="'+strPrincipalId+'"/>';
	
	pRow.insertCell(0).innerHTML = strPrincipalInfo;
	pRow.insertCell(1).innerHTML = strPrincipalName;

	pRow.cells[0].width = "25px";
}

function RemoveSelectedPrincipal()
{
	var pPrincipalsTable = document.getElementById("principals");
	var pPrincipalIds = document.getElementsByName("principal");

	if(!pPrincipalIds.length)
		pPrincipalIds = new Array(pPrincipalIds);

	for(var i=pPrincipalIds.length-1; i>=0; i--)
	{
		if(pPrincipalIds[i].checked)
		{
			var pRow = pPrincipalIds[i].parentNode.parentNode;
			
			pPrincipalsTable.deleteRow(pRow.rowIndex);
		}
	}
}