// $Revision: 15382 $ $Date: 2013-05-23 19:04:46 -0300 (Thu, 23 May 2013) $
function LumisProgress()
{
	this.Initialize = Initialize;
	this.ExecuteSteps = ExecuteSteps;

	var pXMLHTTP = LumisPortalUtil.getXmlHttpObject();
	var pRequestXMLMethod=null;
	var pElements = null;
	var iCurStep = 0;
	var strURL = null;
	
	var strRunningMessage = "Running";
	var strCompletedMessage = "Completed";
	var strErrorMessage = "Error";
	
	function Initialize(url, requestMethod, runningMessage, completedMessage, errorMessage)
	{
		strURL = url;
		pRequestXMLMethod = requestMethod;
		pElements=$("tr#LumisProgressId");
		
		if(!pElements.length)
		{
			pElements = new Array();
			pElements[0] = $("tr#LumisProgressId");
		}
		strRunningMessage = runningMessage;
		strCompletedMessage = completedMessage;
		strErrorMessage = errorMessage;		
	}
	
	function ExecuteSteps()
	{
		ExecuteNextStep();
	}

	function ExecuteNextStep()
	{
		if(iCurStep!=pElements.length)
		{
			pElements[iCurStep].cells[0].innerHTML = '<img src="'+g_LumisRootPath+'lumis/portal/client/images/Running.gif"/>';
			pElements[iCurStep].cells[2].innerHTML = strRunningMessage;

			var strId = pElements[iCurStep].getAttribute("LumisProgressKey");
			var strMethod = pRequestXMLMethod(strId);

			LumisPortalUtil.makeHttpRequest(strURL, strMethod, onExecuted, true, pXMLHTTP);
		}
		else
		{
			if (window.opener && window.opener.LumisPortal)
				window.opener.LumisPortal.onRefresh();
		}
	}
	
	function onExecuted()
	{
		try
		{
			if(pXMLHTTP.readyState != 4)
				return;
		
			LumisPortalUtil.validateResponse(pXMLHTTP.responseXML);

			pElements[iCurStep].cells[0].innerHTML = '<img src="'+g_LumisRootPath +'lumis/portal/client/images/Completed.gif"/>';
			pElements[iCurStep].cells[2].innerHTML = strCompletedMessage;
		}
		catch(e)
		{
			pElements[iCurStep].cells[0].innerHTML = '<img src="'+g_LumisRootPath + 'lumis/portal/client/images/Error.gif"/>';
			pElements[iCurStep].cells[2].innerHTML = strErrorMessage;
			alert("Error: "+e.description);
		}
		
		pXMLHTTP.abort();

		iCurStep++;
		ExecuteNextStep();
	}						
}