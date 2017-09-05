// $Revision: 16540 $ $Date: 2014-10-23 16:21:33 -0200 (Thu, 23 Oct 2014) $
var g_LumisSelectChannelTree = null;


function LumisSelectChannelTree(element)
{
	var NO_SELECTION = "none";
	var NON_TEMPLATE_SELECTION = "nonTemplateOnly";
	var TEMPLATE_SELECTION = "templateOnly";
	var ALL_SELECTION = "all";
	
	var g_LumisCallbackFuncion = "alert(new String('No callback function for SelectChannelTree control was defined!\\nSelected channel:%CHANNELID%\\nSelected page:%PAGEID%').replace('%'+'CHANNELID%', 'N/A').replace('%'+'PAGEID%', 'N/A'));";
	var g_LumisChannelChildProvider = null;
	
	var g_LumisChannelSelection = NO_SELECTION;
	var g_LumisPageSelection = NO_SELECTION;

	var g_LumisSelectedChannel = null;
	var g_LumisRootChannel = null;
	var g_LumisSelectedPage = null;

	var g_LumisDisabledChannelId = null;
	
	var g_LumisHidePages = false;
	var g_LumisHidePageTemplates = false;
	var g_LumisHideChannelTemplates = false;
	var g_LumisCloseWindowOnCompletion = true;
	var g_LumisInterfaceInstanceId = null;
	var g_LumisCallerInterfaceInstanceId = null;
	var g_LumisFormName = null;

	g_LumisChannelTree = this;

	this.init = init;

	var m_xmlHttp = LumisPortalUtil.getXmlHttpObject();
	
	function init(callBackFuncion, channelChildProvider, channelSelection, pageSelection, selectedChannel, rootChannel, selectedPage, hidePages, hidePageTemplates, hideChannelTemplates, disabledChannelId, closeWindowOnCompletion, interfaceInstanceId, formName, callerInterfaceInstanceId)
	{
		if (callBackFuncion != null && callBackFuncion != "")
			g_LumisCallbackFuncion = callBackFuncion + "('%CHANNELID%', '%CHANNELNAME%', '%PAGEID%', '%PAGENAME%')";
			
		if (channelChildProvider != null && channelChildProvider != "")
			g_LumisChannelChildProvider = channelChildProvider;
			
		if (channelSelection != null && channelSelection != "")
			g_LumisChannelSelection = channelSelection;
			
		if (pageSelection != null && pageSelection != "")
			g_LumisPageSelection = pageSelection;
			
		if (selectedChannel != null && selectedChannel != "")
			g_LumisSelectedChannel = selectedChannel;

		if (selectedPage != null && selectedPage != "")
			g_LumisSelectedPage = selectedPage;

		if (hidePages != null && hidePages != "")
			g_LumisHidePages = (hidePages == "1");

		if (hidePageTemplates != null && hidePageTemplates != "")
			g_LumisHidePageTemplates = (hidePageTemplates == "1");

		if (hideChannelTemplates != null && hideChannelTemplates != "")
			g_LumisHideChannelTemplates = (hideChannelTemplates == "1");
			
		if (disabledChannelId != null && disabledChannelId != "")
			g_LumisDisabledChannelId = disabledChannelId;
		
		if (closeWindowOnCompletion != null && closeWindowOnCompletion == "false")
			g_LumisCloseWindowOnCompletion = false;
		
		if(rootChannel != null && rootChannel != "")
			g_LumisRootChannel = rootChannel;

		if(interfaceInstanceId != null && interfaceInstanceId.length > 0)
			g_LumisInterfaceInstanceId = interfaceInstanceId;
		
		if(formName != null && formName.length > 0)
			g_LumisFormName = formName;
		
		if(callerInterfaceInstanceId != null && callerInterfaceInstanceId.length > 0)
			g_LumisCallerInterfaceInstanceId = callerInterfaceInstanceId;

		reloadData();		
	}
	//-------------------------------------------------------------------

	function reloadData()
	{
		var strMethod = "<method name=\"getBasicData\">";
		strMethod += "<channelId>"+(g_LumisSelectedChannel != null ? g_LumisSelectedChannel : g_LumisChannelId) +"</channelId>";
		if(g_LumisSelectedPage != null)
			strMethod += "<pageId>"+g_LumisSelectedPage+"</pageId>";
		if(g_LumisCallerInterfaceInstanceId != null)
			strMethod += "<callerInterfaceInstanceId>"+g_LumisCallerInterfaceInstanceId+"</callerInterfaceInstanceId>";
		if (g_LumisHidePages)
			strMethod += "<hidePages>1</hidePages>";
		if (g_LumisHidePageTemplates)
			strMethod += "<hidePageTemplates>1</hidePageTemplates>";
		if (g_LumisHideChannelTemplates)
			strMethod += "<hideChannelTemplates>1</hideChannelTemplates>";
		if (g_LumisChannelChildProvider != null)
			strMethod += "<channelChildProvider>" + g_LumisChannelChildProvider + "</channelChildProvider>";
		if(g_LumisRootChannel != null)
			strMethod += "<rootChannelId>" + g_LumisRootChannel + "</rootChannelId>";
		strMethod += "</method>";
		
		LumisPortalUtil.makeHttpRequest(g_LumisRootPath + "lumis/portal/controller/xml/ChannelTreeControllerXml.jsp", strMethod, onChannelsLoaded, true, m_xmlHttp);
	}

	//-------------------------------------------------------------------

	function onChannelsLoaded()
	{
		var state = m_xmlHttp.readyState;
		if(state == 4)
  		{
  			renderTree();
			//LumisPortalAdmin.onWindowResized();
		}
	}
	
	//-------------------------------------------------------------------

	function renderTree(parentDiv, parentId, iDepth)
	{
		if(parentId == null)
			parentId = "";
		
		if(iDepth == null)
		{
			iDepth = 0;
		}
		
			
		xmlDom = m_xmlHttp.responseXML;
		var channels = LumisPortalUtil.selectNodes ("response/treeData/cs/c", xmlDom);
		if(channels.length == 0 && g_LumisRootChannel != null)
		{
			channels = LumisPortalUtil.selectNodes ("response/treeData/cs/c[id='"+g_LumisRootChannel+"']", xmlDom);
		}
		
		for (var i = channels.length - 1; i >= 0; i--)
			renderChannel(channels[i], iDepth, parentDiv, parentId);

		var pages = LumisPortalUtil.selectNodes ("response/treeData/ps/p[cId='"+parentId+"']", xmlDom);
		
		for (var i = pages.length - 1; i >= 0; i--)
			renderPage(pages[i], iDepth, parentDiv);
	}

	//-------------------------------------------------------------------

	function renderChannel(channelNode, iDepth, parentDiv, channelParentId)
	{
		var channelId = LumisPortalUtil.getElementText(LumisPortalUtil.selectSingleNode("id", channelNode));
		var channelName = LumisPortalUtil.getElementText(LumisPortalUtil.selectSingleNode("n", channelNode));
		var channelIsTemplate = false;
		
		if(channelParentId == null)
		{
			channelParentId="";
		}
		
		if(g_LumisDisabledChannelId == channelId)
			return;
		
		if(LumisPortalUtil.selectSingleNode("isT", channelNode))
			channelIsTemplate = true;

		var pChannelDiv = document.createElement("DIV");
		
		if(parentDiv && parentDiv.nextSibling)
			element.insertBefore(pChannelDiv, parentDiv.nextSibling);
		else
			element.appendChild(pChannelDiv);

		pChannelDiv.noWrap = true;
		pChannelDiv.lumDepth = iDepth;
		
		var channelClassName = "cLumAdminTreeChannel";
		if(channelIsTemplate)
		{
			pChannelDiv.lumIsTemplate = "1";
			channelName += " [Template]";
			channelClassName = "cLumAdminTreeChannelTemplate";
		}
		
		pChannelDiv.lumName = channelName;
		pChannelDiv.lumChannelId = channelId;
		pChannelDiv.lumParentChannelId = channelParentId;
		if(LumisPortalUtil.selectSingleNode("cP", channelNode))
		{
			pChannelDiv.title = LumisPortalUtil.getElementText(LumisPortalUtil.selectSingleNode("cP", channelNode));
		}
		else
		{
			pChannelDiv.title = channelName;
		}

		if (g_LumisSelectedChannel == channelId)
			pChannelDiv.className = "cLumSelectTreeItem cLumSelectTreeItemSelected"; 
		else 
			pChannelDiv.className = "cLumSelectTreeItem"; 

		if (iDepth == 0)
			pChannelDiv.innerHTML = '<img id="expandImg" align="absmiddle" src="'+g_LumisRootPath + 'lumis/portalstudio/client/images/tree/close.png" style="cursor:pointer"/><span id="treeItem" class="cLumAdminTreeText '+channelClassName+'">'+HTMLEncode(channelName)+'</span>';
		else
			pChannelDiv.innerHTML = '<img id="expandImg" align="absmiddle" src="'+g_LumisRootPath + 'lumis/portalstudio/client/images/tree/open.png" style="cursor:pointer"/><span id="treeItem" class="cLumAdminTreeText '+channelClassName+'">'+HTMLEncode(channelName)+'</span>';
		pChannelDiv.firstChild.onclick = onExpandContractClicked;
		pChannelDiv.firstChild.nextSibling.onclick = onChannelClicked;
		pChannelDiv.lumCanExpand = true;
		pChannelDiv.style.paddingLeft = "" + ((15*iDepth) - 5) + "px";
		
		var xmlDom = m_xmlHttp.responseXML;
		
		// render pages
		var pages = LumisPortalUtil.selectNodes("response/treeData/ps/p[cId='"+channelId+"']", xmlDom);
		
		for (var i = 0; i < pages.length; i++)
		{
			var page = pages[i];
			renderPage(page, iDepth+1);
		}
		
		var currentDepth = "";
		for (var i = 0; i < iDepth; i++)
		{
			currentDepth = currentDepth + "/cs/c";
		}
		
		var subChannels = LumisPortalUtil.selectNodes("response/treeData"+ currentDepth +"/cs/c[id='"+channelId+"']/cs/c", xmlDom);
		
		if(subChannels.length > 0 || pages.length > 0)
		{
			pChannelDiv.lumLoaded = true;
			pChannelDiv.lumExpanded = true;

			if(iDepth > 0)
				pChannelDiv.firstChild.src = g_LumisRootPath + "lumis/portalstudio/client/images/tree/close.png";
		}

		for (var i = 0; i < subChannels.length; i++)
		{
			var subChannel = subChannels[i];
			renderChannel(subChannel, iDepth+1, null, channelId);
		}
	}
	
	//-------------------------------------------------------------------

	function renderPage(pageNode, iDepth, parentDiv)
	{
		var pageId = LumisPortalUtil.getElementText(LumisPortalUtil.selectSingleNode("id", pageNode));
		var pageName = LumisPortalUtil.getElementText(LumisPortalUtil.selectSingleNode("n", pageNode));
		var pageIsTemplate = false;
		
		if(LumisPortalUtil.selectSingleNode("isT", pageNode))
			pageIsTemplate = true;

		var pPageDiv = document.createElement("DIV");
		
		if(parentDiv && parentDiv.nextSibling)
			element.insertBefore(pPageDiv, parentDiv.nextSibling);
		else
			element.appendChild(pPageDiv);

		pPageDiv.noWrap = true;
		pPageDiv.lumDepth = iDepth;
		
		var pageClassName = "cLumAdminTreePage";
		if(pageIsTemplate)
		{
			pPageDiv.lumIsTemplate = "1";
			pageName += " [Template]";
			pageClassName = "cLumAdminTreePageTemplate";
		}
		
		pPageDiv.lumName = pageName;
		pPageDiv.lumPageId = pageId;
		pPageDiv.title = pageName;
		
		if (g_LumisSelectedPage == pageId)
			pPageDiv.className = "cLumSelectTreeItem cLumSelectTreeItemSelected";
		else
			pPageDiv.className = "cLumSelectTreeItem";
			
		
		pPageDiv.innerHTML = '<span id="treeItem" class="cLumAdminTreeText '+pageClassName+'">'+HTMLEncode(pageName)+'</span>';
		pPageDiv.firstChild.onclick = onPageClicked;
		pPageDiv.style.paddingLeft = "" +((15*iDepth) - 5) + "px";
	}
	
	//-------------------------------------------------------------------
	
	function getCompleteName(channelPageElement)
	{
		var element = channelPageElement;
		var name = element.lumName.replace(" [Template]", "");
		var depth = parseInt(element.lumDepth, 10);
		var currDepth;
		
		element = element.previousSibling;
		while(element)
		{
			if (element.lumName != null)
			{
				currDepth = parseInt(element.lumDepth, 10);
				if (currDepth < depth)
				{
					name = element.lumName.replace(" [Template]", "") + "/" + name;
					depth = currDepth
				}
			}
			element = element.previousSibling;
		}
		
		return "/" + name;
	}

	//-------------------------------------------------------------------

	function onChannelClicked(event)
	{
		if(!event)
			event = window.event;
		
		var srcElement = event.srcElement;
		
		if(!srcElement)
			srcElement = event.target;

		while(srcElement && !srcElement.lumChannelId)
			srcElement = srcElement.parentNode;
			
		if(srcElement)
		{
			var isTemplate = false;
			if(srcElement.lumIsTemplate && srcElement.lumIsTemplate == "1")
				isTemplate = true;
			
			if(!(g_LumisChannelSelection == NO_SELECTION || (isTemplate && g_LumisChannelSelection == NON_TEMPLATE_SELECTION) || (!isTemplate && g_LumisChannelSelection == TEMPLATE_SELECTION)))
			{
				try
				{
					var channelName = getCompleteName(srcElement);
					var escapedChannelName = channelName.replace(new RegExp("\\\\", "g"), "\\\\").replace(new RegExp("'", "g"), "\\'");
					var channelId = srcElement.lumChannelId;
					
					eval(g_LumisCallbackFuncion.replace("%CHANNELID%", channelId).replace("%CHANNELNAME%", escapedChannelName).replace("%PAGEID%", "").replace("%PAGENAME%", ""));
					if(g_LumisCloseWindowOnCompletion)
						closeInterfaceInstance();
				}
				catch (e)
				{
					throw "SelectChannelPageTreeControl: Error running callback function: " + e;
				}
			}
		}	
	}

	//-------------------------------------------------------------------

	function onPageClicked(event)
	{
		if(!event)
			event = window.event;
			
		var srcElement = event.srcElement;
		
		if(!srcElement)
			srcElement = event.target;

		while(srcElement && !srcElement.lumPageId)
			srcElement = srcElement.parentNode;
		
		if(srcElement)
		{
			var isTemplate = false;
			if(srcElement.lumIsTemplate && srcElement.lumIsTemplate == "1")
				isTemplate = true;
				
			if(!(g_LumisPageSelection == NO_SELECTION || (isTemplate && g_LumisPageSelection == NON_TEMPLATE_SELECTION) || (!isTemplate && g_LumisPageSelection == TEMPLATE_SELECTION)))
			{
				try
				{
					var pageName = getCompleteName(srcElement);
					var escapedPageName = pageName.replace(new RegExp("\\\\", "g"), "\\\\").replace(new RegExp("'", "g"), "\\'");
					var pageId = srcElement.lumPageId;					

					eval(g_LumisCallbackFuncion.replace("%PAGEID%", pageId).replace("%PAGENAME%", escapedPageName).replace("%CHANNELID%", "").replace("%CHANNELNAME%", ""));
					
					if(g_LumisCloseWindowOnCompletion)
						closeInterfaceInstance();
				}
				catch (e)
				{
					throw "SelectChannelPageTreeControl: Error running callback function: " + e;
				}
			}
		}			
	}

	//-------------------------------------------------------------------

	function onExpandContractClicked(event)
	{
		if(!event)
			event = window.event;

		var srcElement = event.srcElement;
		
		if(!srcElement)
			srcElement = event.target;
			
		while(srcElement && !srcElement.lumChannelId)
			srcElement = srcElement.parentNode;

		expandContractNode(srcElement);
		event.cancelBubble = true;
	}
	
	//-------------------------------------------------------------------

	function expandContractNode(srcElement)
	{
		if(srcElement.lumCanExpand == false)
			return;
		
		if(!srcElement.lumLoaded)
		{
			var strMethod = "<method name=\"getChildrenData\">";
			strMethod += "<channelId>"+srcElement.lumChannelId+"</channelId>";
			if(g_LumisCallerInterfaceInstanceId != null)
				strMethod += "<callerInterfaceInstanceId>"+g_LumisCallerInterfaceInstanceId+"</callerInterfaceInstanceId>";
			if (g_LumisHidePages)
				strMethod += "<hidePages>1</hidePages>";
			if (g_LumisHidePageTemplates)
				strMethod += "<hidePageTemplates>1</hidePageTemplates>";
			if (g_LumisHideChannelTemplates)
				strMethod += "<hideChannelTemplates>1</hideChannelTemplates>";
			if (g_LumisChannelChildProvider != null)
				strMethod += "<channelChildProvider>" + g_LumisChannelChildProvider + "</channelChildProvider>";
			strMethod += "</method>";
			
			m_xmlHttp = LumisPortalUtil.getXmlHttpObject();
			LumisPortalUtil.makeHttpRequest(g_LumisRootPath + "lumis/portal/controller/xml/ChannelTreeControllerXml.jsp", strMethod, null, true, m_xmlHttp);
  			renderTree(srcElement, srcElement.lumChannelId, srcElement.lumDepth+1);
  			
			xmlDom = m_xmlHttp.responseXML;

  			srcElement.lumLoaded = true;
  			if(!LumisPortalUtil.selectSingleNode("response/treeData/cs/c", xmlDom) && !LumisPortalUtil.selectSingleNode("response/treeData/ps/p", xmlDom))
  			{
  				srcElement.lumCanExpand = false;
  				srcElement.firstChild.style.visibility = "hidden";
  			}
  			else
  			{
  				srcElement.firstChild.src = g_LumisRootPath + "lumis/portalstudio/client/images/tree/close.png";
  				srcElement.lumExpanded = true;
  			}
  			
  			return;
		}

		var displayMode = "";
		if(srcElement.lumExpanded)
		{
			srcElement.firstChild.src = g_LumisRootPath + "lumis/portalstudio/client/images/tree/open.png";
			srcElement.lumExpanded = false;
			displayMode = "none";
		}
		else
		{
			srcElement.firstChild.src = g_LumisRootPath + "lumis/portalstudio/client/images/tree/close.png";
			srcElement.lumExpanded = true;
		}
		
		var pCurElement = srcElement.nextSibling;

		while(pCurElement && pCurElement.lumDepth > srcElement.lumDepth)
		{
			if(!srcElement.lumExpanded || pCurElement.lumDepth == srcElement.lumDepth+1)
				pCurElement.style.display = displayMode;
				
			if(!srcElement.lumExpanded && pCurElement.lumChannelId)
			{
				pCurElement.lumExpanded = false;
				pCurElement.firstChild.src = g_LumisRootPath + "lumis/portalstudio/client/images/tree/open.png";
			}

			pCurElement = pCurElement.nextSibling;
		}
	}
	
	function HTMLEncode(text)
	{
		if ( typeof( text ) != "string" )
			text = text.toString() ;
	
		text = text.replace(/&/g, "&amp;") ;
		text = text.replace(/"/g, "&quot;") ;
		text = text.replace(/</g, "&lt;") ;
		text = text.replace(/>/g, "&gt;") ;
		text = text.replace(/'/g, "&#39;") ;
	
		return text ;
	}
	
	function closeInterfaceInstance()
	{
		LumisPortal.closeInterfaceInstance(g_LumisInterfaceInstanceId, g_LumisFormName);
	}
}

