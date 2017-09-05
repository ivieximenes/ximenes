// $Revision: 12749 $ $Date: 2011-04-01 10:01:58 -0300 (Fri, 01 Apr 2011) $
var LumisContent = new LumisContent();
function LumisContent()
{
	this.unlockContentLocale = unlockContentLocale;
	this.unlockContentLocaleByItemId = unlockContentLocaleByItemId;
	this.OP_LOCK = 1;
	this.OP_UNLOCK = 2;
	this.OP_STEAL = 3;
	this.OP_AUTOUNLOCK = 4;
	
	//sends ajax to server to unlock, or steal a lock, based on a contentLocaleId.
	//The onSucess parameter represents a callback method, in case something needs to be done after the 
	//ajax returns 
	function unlockContentLocale(contentLocaleId, operation, onSuccess)
	{
		var href = g_LumisRootPath + "lumis/content/lock.jsp?contentLocaleId=" + contentLocaleId + "&lumLockOperation=" + operation;
		var xmlHttp = LumisPortal.getXmlHttpObject();
		xmlHttp.open("POST", href, false);
		if(onSuccess)
		{
			xmlHttp.onreadystatechange = function()
			{
				var state = xmlHttp.readyState;
				if(state == 4)
		  		{
		 			var results = xmlHttp.responseText;
					if(results.indexOf("success") > 0)
					{
						if (onSuccess)
						{
							onSuccess();
						}
					}
				}
			};
		}
		xmlHttp.send();
	}
	
	//sends ajax to server to unlock, or steal a lock, based on an itemId.  
	//The onSucess parameter represents a callback method, in case something needs to be done after the 
	//ajax returns 
	function unlockContentLocaleByItemId(itemId, operation, onSuccess)
	{
		var href = g_LumisRootPath + "lumis/content/lock.jsp?itemId=" + itemId + "&lumLockOperation=" + operation;
		var xmlHttp = LumisPortal.getXmlHttpObject();
		xmlHttp.open("POST", href, true);
		if(onSuccess)
		{
			xmlHttp.onreadystatechange = function()
			{
				var state = xmlHttp.readyState;
				if(state == 4)
		  		{
		 			var results = xmlHttp.responseText;
					if(results.indexOf("success") > 0)
					{
						if (onSuccess)
						{
							onSuccess();
						}
					}
				}
			};
		}

		xmlHttp.send();
	}
}
