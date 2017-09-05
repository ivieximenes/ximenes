// $Revision: 15658 $ $Date: 2013-07-24 16:54:03 -0300 (Wed, 24 Jul 2013) $

(function(){
	var LumPPWidgContrURL = g_LumisRootPath + "lumis/service/pagepersonalization/PagePersonalizationController.jsp";

	function LumisPagePersonalizationBuildUrl(method, parameters)
	{
		var url = LumPPWidgContrURL + "?m=" + method + "&mo=" + g_LumisDisplayMode;
		if(parameters)
		{
			for(var i = 0; i < parameters.length; i++)
			{
				url += "&" + parameters[i].name + "=" + parameters[i].value;
			}
		}
		return url;
	}
	
	window.LumisPagePersonalization = {
		/**
		 * Adds a widget to a holder in a given position.
		 * @param widgetContentId The widget content identifier to be added.
		 * @param holderId The holder identifier (the holder service interface instance identifier).
		 * @param position The position that the widget was added (first position is zero).
		 * @return true if operation succeeded or false otherwise.
		 */
		addWidgetToHolder	: function (interfaceInstanceId, holderId, position){
				if(
						interfaceInstanceId == null 
						|| holderId == null 
						|| position == null
						|| interfaceInstanceId.length == 0
						|| holderId.length == 0 
						|| isNaN(position)
				)
				{
					// TODO Melhorar isso
					alert(interfaceInstanceId);
					alert(holderId);
					alert(position);
					return false;
				}
				
				var param = new Array();
				param[0] = new Object();
				param[0].name = "ii";
				param[0].value = interfaceInstanceId;
				param[1] = new Object();
				param[1].name = "hi";
				param[1].value = holderId;
				param[2] = new Object();
				param[2].name = "p";
				param[2].value = position;
				var url = LumisPagePersonalizationBuildUrl("addWidgetToHolder", param);
				var error = false;
				var xmlHttp = LumisPortal.getXmlHttpObject();
				xmlHttp.open("POST", url, false);
				xmlHttp.onreadystatechange = function(){
					if ( xmlHttp.readyState == 4 )
					{
						if(xmlHttp.status != 200)
							error = true;
					}
				};
				xmlHttp.send();

				return !error;
			},
	
		/**
		 * Renders a widget into a given container.
		 * @param container The container where the widget's content will be put.
		 * @param widgetServiceInterfaceInstanceId The service interface instance identifier of the widget.
		 */
		renderWidget		: function (container, widgetServiceInterfaceInstanceId){
				try
				{
					LumisPortal.renderInterfaceInstance(container, widgetServiceInterfaceInstanceId, false);
				}
				catch(e)
				{
					return false;
				}
				return true;
			},
		
		/**
		 * Removes a widget from a holder.
		 * @param widgetContentId The widget content identifier.
		 * @param holderId The holder identifier (the holder service interface instance identifier).
		 * @return true if operation succeeded or false otherwise.
		 */
		removeWidget		: function (interfaceInstanceId, holderId){
				if(
						interfaceInstanceId == null 
						|| holderId == null 
						|| interfaceInstanceId.length == 0
						|| holderId.length == 0 
				)
					return false;
				
				var param = new Array();
				param[0] = new Object();
				param[0].name = "ii";
				param[0].value = interfaceInstanceId;
				param[1] = new Object();
				param[1].name = "hi";
				param[1].value = holderId;
				var url = LumisPagePersonalizationBuildUrl("removeWidget", param);
				var error = false;
				var xmlHttp = LumisPortal.getXmlHttpObject();
				xmlHttp.open("POST", url, false);
				xmlHttp.onreadystatechange = function(){
					if ( xmlHttp.readyState == 4 )
					{
						if(xmlHttp.status != 200)
							error = true;
					}
				};
				xmlHttp.send();

				return !error;
			},
		
		/**
		 * Moves a widget to a holder in a given position.
		 * @param widgetContentId The moved widget content identifier.
		 * @param sourceHolderId The source holder identifier (the holder service interface instance identifier). 
		 * @param destinationHolderId The destination holder identifier (the holder service interface instance identifier).
		 * @param position The position in which the widget has been dropped (in the destination holder).
		 * @return true if operation succeeded or false otherwise. 
		 */
		moveWidgetToHolder	: function (interfaceInstanceId, sourceHolderId, destinationHolderId, position){
				if(
						interfaceInstanceId == null 
						|| sourceHolderId == null 
						|| destinationHolderId == null 
						|| position == null
						|| interfaceInstanceId.length == 0
						|| sourceHolderId.length == 0
						|| destinationHolderId.length == 0 
						|| isNaN(position)
				)
					return false;
				
				var param = new Array();
				param[0] = new Object();
				param[0].name = "ii";
				param[0].value = interfaceInstanceId;
				param[1] = new Object();
				param[1].name = "shi";
				param[1].value = sourceHolderId;
				param[2] = new Object();
				param[2].name = "dhi";
				param[2].value = destinationHolderId;
				param[3] = new Object();
				param[3].name = "p";
				param[3].value = position;
				var url = LumisPagePersonalizationBuildUrl("moveWidgetToHolder", param);
				var error = false;
				var xmlHttp = LumisPortal.getXmlHttpObject();
				xmlHttp.open("POST", url, false);
				xmlHttp.onreadystatechange = function(){
					if ( xmlHttp.readyState == 4 )
					{
						if(xmlHttp.status != 200)
							error = true;
					}
				};
				xmlHttp.send();

				return !error;
			}
	};
})();