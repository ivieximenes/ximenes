// $Revision: 16270 $ $Date: 2014-04-11 18:21:04 -0300 (Fri, 11 Apr 2014) $
function LumisServiceInterfaceList(element)
{
	var messageDiv = element.firstChild;
	var treeDiv = messageDiv.nextSibling;
	
	var m_xmlHttp = LumisPortalUtil.getXmlHttpObject();
	var m_hasChildren = false;
	element.reloadData = reloadData;
	
	
	//reloadData(g_LumisChannelId);

	//-------------------------------------------------------------------

	function reloadData(strChannelId)
	{
		treeDiv.innerHTML = "";
		var strMethod = "<method name=\"getServiceInterfaceList\">";
		strMethod += "<channelId>"+strChannelId+"</channelId>";
		strMethod += "</method>";
		
		LumisPortalUtil.makeHttpRequest(g_LumisRootPath+"lumis/portal/controller/xml/ServiceInterfaceListControllerXml.jsp", strMethod, onServiceInterfacesLoaded, true, m_xmlHttp);
	}
	
	//-------------------------------------------------------------------

	function onServiceInterfacesLoaded()
	{
		var state = m_xmlHttp.readyState;
		if(state == 4)
  		{
  			renderList();
		}
	}
	
	//-------------------------------------------------------------------

	function renderList()
	{
		m_hasChildren = false;
		messageDiv.style.display = "none";
		xmlDom = m_xmlHttp.responseXML;
		
		if(g_LumisPageConfig.isTemplate)
		{
			var pInterfaceDiv = document.createElement("DIV");
			var interfaceId = "lumis.service.portalmanagement.serviceinterfaceinstance.interfaceHolder";
			var interfaceName = LumisPortalAdmin.localize("STR_SERVICE_INTERFACE_HOLDER");
			
			treeDiv.appendChild(pInterfaceDiv);

			pInterfaceDiv.noWrap = true;
			pInterfaceDiv.title = interfaceName;
			pInterfaceDiv.lumInterfaceId = interfaceId;
			pInterfaceDiv.className = "lum-admin-inteface-list-interface-item lum-admin-is-holder";
			pInterfaceDiv.innerHTML = interfaceName;
			pInterfaceDiv.setAttribute("lumIsDraggable", "true");
			pInterfaceDiv.lumDragImage = "<div class=\"lum-admin-inteface-list-interface-item lum-draggable\">"+interfaceName+"</div>";
			pInterfaceDiv.lumDragData = "<lumDragObject>"+
								"<type>lumServiceInterface</type>"+
								"<data>"+
									/*"<sInstId>00000000000000000000000000000005</sInstId>"+*/
									"<sInstName></sInstName>"+
									"<iId>"+interfaceId+"</iId>"+
									"<n>"+interfaceName+"</n>"+
								"</data>"+
								"</lumDragObject>";
		}
		
		
		var serviceInstances = LumisPortalUtil.selectNodes ("response/listData/serviceInstances/si", xmlDom);
		
		for (var i = 0; i < serviceInstances.length; i++)
			renderServiceInstance(serviceInstances[i]);
		
		if(m_hasChildren == false)
			messageDiv.style.display = "block";
	}

	//-------------------------------------------------------------------

	function renderServiceInstance(pCurServiceInstance)
	{
		var serviceInstId = LumisPortalUtil.getElementText(LumisPortalUtil.selectSingleNode("id", pCurServiceInstance));
		var serviceInstName = LumisPortalUtil.getElementText(LumisPortalUtil.selectSingleNode("n", pCurServiceInstance));
		
		var pServiceInstDiv = document.createElement("DIV");
		
		treeDiv.appendChild(pServiceInstDiv);
		m_hasChildren = true;

		pServiceInstDiv.noWrap = true;
		pServiceInstDiv.title = serviceInstName;
		pServiceInstDiv.className = "lum-admin-interface-list-parent-item";
		pServiceInstDiv.innerHTML = serviceInstName;

		// render interfaces			
		var interfaces = LumisPortalUtil.selectNodes("interfaces/i", pCurServiceInstance);
		
		for(var i=0; i < interfaces.length; i++)
		{
			var pCurInterface = interfaces[i];
			var pInterfaceDiv = document.createElement("DIV");
			var interfaceId = LumisPortalUtil.getElementText(LumisPortalUtil.selectSingleNode("id", pCurInterface));
			var interfaceName = LumisPortalUtil.getElementText(LumisPortalUtil.selectSingleNode("n", pCurInterface));
			
			treeDiv.appendChild(pInterfaceDiv);
	
			pInterfaceDiv.noWrap = true;
			pInterfaceDiv.title = interfaceName;
			pInterfaceDiv.lumInterfaceId = interfaceId;
			pInterfaceDiv.className = "lum-admin-inteface-list-interface-item";
			pInterfaceDiv.innerHTML = interfaceName;
			pInterfaceDiv.setAttribute("lumIsDraggable", "true");
			pInterfaceDiv.lumDragImage = "<div class=\"lum-admin-inteface-list-interface-item lum-draggable\">"+interfaceName+"</div>";
			pInterfaceDiv.lumDragData = "<lumDragObject>"+
								"<type>lumServiceInterface</type>"+
								"<data>"+
									"<sInstId>"+serviceInstId+"</sInstId>"+
									"<sInstName>"+LumisPortal.htmlEncode(serviceInstName)+"</sInstName>"+
									"<iId>"+interfaceId+"</iId>"+
									"<n>"+LumisPortal.htmlEncode(interfaceName)+"</n>"+
								"</data>"+
								"</lumDragObject>";
		}
	}
}