/*
 * $Revision: 17268 $ $Date: 2015-05-14 13:56:08 -0300 (Thu, 14 May 2015) $
 */

var restURL = g_LumisRootPath+"lumis/api/rest/lum-internal/portaladministration/interactiveprocess";

function hideActionButtons()
{
	$(".actionButtons").css({"display":"none"});
	$(".non-actionButtons").css({"display":"inline"});
	$(".process-item.active-item").children(".process-controls").children(".actionButton").addClass("lum-disabled");
	$(".lum-button.lum-button-primary.actionButton").addClass("lum-disabled");
	$(".lum-button.actionButton").addClass("lum-disabled");
}

function showActionButtons()
{
	$(".actionButtons").css({"display":"inline"});
	$(".non-actionButtons").css({"display":"none"});
	$(".actionButton").removeClass("lum-disabled");
}

function updateInformation(processId, owner, barDivId, ownershipButtonId, controlListId)
{
	var operation = "/updateInformation";
	var urlToRequest = restURL + operation + "?processId="+processId+"&owner="+owner;
	var xmlhttp = LumisPortal.getXmlHttpObject();
	sendRequestAjax(urlToRequest, xmlhttp, function()
	  {
		  if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
		    {
		    	var percentage = 0;
		    	try
		    	{
		    		var response = JSON.parse(xmlhttp.responseText);
		    		if (response.error != undefined)
		    		{
		    			if (response.error == "lumis.portal.interactiveprocess.ProcessNotOwnedException")
		    			{
		    				// only here show the message to ownership the process. in the other functions just return false;
		    				$("#"+ownershipButtonId).click();
		    			}
		    		}
		    		percentage = response.percentage;
		    		if(percentage != undefined)
		    		{
		    			$("#"+barDivId).css({"width":percentage+"%"});
		    			$("#"+barDivId+"percentage").html("("+percentage+"%)");
		    		}
		    		
		    		var currentItem = response.currentStep;
		    		
		    		for(var item = 1; item <= response.totalSteps ;item++)
		    		{
	    				$("#step_"+item).children(".stepId").html(response[item][0]);
	    				if (item == currentItem)
	    				{
		    				$("#step_"+item).addClass("active-item");
		    				$("#step_"+item).children(".stepId").addClass("noexecuted");
	    				}
	    				else
	    				{
		    				$("#step_"+item).removeClass("active-item");
		    				$("#step_"+item).children(".stepId").removeClass("noexecuted");
		    				$("#step_"+item).children(".stepId").removeClass("import-executing");
	    				}
	    				
	    				if (response[item][1] == "SUCCESS")
	    				{
	    					$("#step_"+item).children(".stepId").addClass("import-ok");
	    				}
	    				else if (response[item][1] == "IGNORED")
	    				{
	    					$("#step_"+item).children(".stepId").addClass("import-ignored");
	    				}
	    				else if (response[item][1] == "FAILURE")
	    				{
	    					$("#step_"+item).children(".stepId").addClass("executed-errors");
	    				}
	    				
	    				if (item == response.currentStepExcuting)
	    				{
	    					$("#step_"+item).addClass("active-item");
		    				$("#step_"+item).children(".stepId").removeClass("noexecuted");
		    				$("#step_"+item).children(".stepId").addClass("import-executing");
		    				hideActionButtons();
	    				}
		    		}
		    		if(response.currentStepExcuting == undefined || response.currentStepExcuting == "")
		    		{
		    			showActionButtons();
		    		}
	    		}
	    		catch(err)
	    		{
	    			console.log(err);
	    		}
    			//schedule the next execution
    			window.setTimeout("updateInformation('"+processId+"','"+owner+"','"+barDivId+"','"+ownershipButtonId+"','"+controlListId+"')",1000);
		    }
	  });
}

function execute(processId, owner, operation, statusControlId, closeButtonId, ownershipButtonId, stepListId)
{
	var urlToRequest = restURL + operation + "?processId="+processId+"&owner="+owner;
	var xmlhttp = LumisPortal.getXmlHttpObject();
	sendRequestAjax(urlToRequest, xmlhttp, function()
	  {
		 if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
		    {
		    	var status = "EXECUTING_STEP";
		    	try
		    	{
		    		var response = JSON.parse(xmlhttp.responseText);
		    		if (response.error != undefined)
		    		{
		    			if (response.error == "lumis.portal.interactiveprocess.ProcessNotOwnedException")
		    			{
		    				$("#"+ownershipButtonId).click();
		    			}
		    		}
		    		status = response.status;
		    		if (status=="CLOSE" || status=="DONE")
		    		{
		    			if (response.message != undefined)
		    			{
				    		$(".lum-interactiveprocess-details-bar").css({"width":"100%"});
				    		$(".lum-interactiveprocess-details-percentage").html("(100%)");
		    				alert(response.message);
		    			}
		    			
			    		if(status == "CLOSE")
			    			$("#" + closeButtonId).click();
		    		}
		    		if (status!="FAILURE")
		    		{
		    			// change the steps list to the next step
			    		var currentStepSelected = Number($("#"+stepListId).val()) + 1;
			    		if ($("#"+stepListId).contents().size() >= currentStepSelected)
			    		{
			    			$("#"+stepListId).val(currentStepSelected);
			    		}
		    		}
		    		$("#"+stepListId).change();
		    		$("#"+statusControlId).val(status);
		    		showActionButtons();
	    		}
	    		catch(err)
	    		{
	    			console.log(err);
	    		}
		    }
	  });
}

function sendRequestAjax(urlToRequest, xmlhttp, onReadyStateChangeFunction)
{
	xmlhttp.onreadystatechange = onReadyStateChangeFunction;
	xmlhttp.open("POST",urlToRequest,true);
	xmlhttp.send();
}