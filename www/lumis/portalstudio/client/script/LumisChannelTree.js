// $Revision: 17572 $ $Date: 2015-07-15 14:58:21 -0300 (Wed, 15 Jul 2015) $
var g_LumisChannelTree = null;
var g_LumisSelectedTreeItem = null;

function LumisChannelTree(element)
{
	g_LumisChannelTree = this;
	g_LumisSelectedTreeItem = null;
	
	this.onDeleteChannel = onDeleteChannel;
	this.onDeletePage = onDeletePage;
	this.onClearChannelCache = onClearChannelCache;
	this.onClearPageCache = onClearPageCache;
	
	var m_xmlHttp = LumisPortalUtil.getXmlHttpObject();
	
	reloadData();

	//-------------------------------------------------------------------

	function reloadData()
	{
		var strMethod = "<method name=\"getBasicData\">";
		strMethod += "<channelId>"+g_LumisChannelId+"</channelId>";
		strMethod += "</method>";
		
		LumisPortalUtil.makeHttpRequest(g_LumisRootPath+"lumis/portal/controller/xml/ChannelTreeControllerXml.jsp", strMethod, onChannelsLoaded, true, m_xmlHttp);
	}

	//-------------------------------------------------------------------

	function onChannelsLoaded()
	{
		var state = m_xmlHttp.readyState;
		if(state == 4)
  		{
  			renderTree();

  			if(g_LumisSelectedTreeItem)
  				g_LumisSelectedTreeItem.scrollIntoView(true);
		}
	}
	
	//-------------------------------------------------------------------

	function renderTree(parentDiv, parentId, iDepth, xmlObj)
	{
		if(parentId == null)
			parentId = "";
		
		if(iDepth == null)
			iDepth = 0;
		
		if(xmlObj == null)
			xmlDom = m_xmlHttp.responseXML;
		else
			xmlDom = xmlObj.responseXML;
		
		var channels = LumisPortalUtil.selectNodes ("response/treeData/cs/c", xmlDom);
		
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
		var websiteURL;
		
		if(channelParentId == null)
		{
			channelParentId="";
		}
		
		var channelIsTemplate = false;
		var channelIsWebsite = false;
		
		if(LumisPortalUtil.selectSingleNode("isT", channelNode))
			channelIsTemplate = true;

		if(LumisPortalUtil.selectSingleNode("isW", channelNode))
		{
			channelIsWebsite = true;
			websiteURL = LumisPortalUtil.getElementText(LumisPortalUtil.selectSingleNode("wsU", channelNode));
		}

		var pChannelDiv = document.createElement("DIV");
		
		if(parentDiv && parentDiv.nextSibling)
			element.insertBefore(pChannelDiv, parentDiv.nextSibling);
		else
			element.appendChild(pChannelDiv);

		pChannelDiv.noWrap = true;
		pChannelDiv.lumDepth = iDepth;
		
		var channelClassName = "lum-admin-tree-channel";
		if(channelIsTemplate)
		{
			pChannelDiv.lumIsTemplate = "1";
			channelName += " [" + LumisPortalAdmin.localize("STR_TEMPLATE") + "]";
			channelClassName = "lum-admin-tree-channel-template";
		}
		
		pChannelDiv.lumName = channelName;
		pChannelDiv.lumChannelId = channelId;
		pChannelDiv.lumParentChannelId = channelParentId;
		pChannelDiv.title = channelName;

		if(channelIsWebsite)
		{
			pChannelDiv.lumIsWebsite = "1";
			channelClassName = "lum-admin-tree-website";
			pChannelDiv.title += " - " + websiteURL;
		}

		// if showing an administration page of this channel, select it
		if(channelId == g_LumisChannelId && g_LumisPageConfig.type == 1)
		{
			pChannelDiv.className = "lum-admin-tree-item lum-admin-tree-item-selected";
			g_LumisSelectedTreeItem = pChannelDiv;
		}
		else
			pChannelDiv.className = "lum-admin-tree-item";

		var displayName = LumisPortal.htmlEncode(channelName);

		if(channelIsWebsite)
		{
			if(channelId != g_LumisChannelId || g_LumisPageConfig.type != 1)
			{
				displayName = displayName;
			}
		}
		
		if(channelId == '00000000D00000000000000000000001')
		{
			pChannelDiv.innerHTML = '<span id="treeItem" class="lum-admin-tree-text" style="padding-left:10px">'+displayName+'</span>';
			pChannelDiv.onclick = onChannelClicked;
		}
		else
		{
			var imgName = "tree/open.png";
			if(iDepth == 0)
				imgName = "tree/close.png";
			pChannelDiv.innerHTML = '<img id="expandImg" src="'+g_LumisRootPath+'lumis/portalstudio/client/images/'+imgName+'" class="lum-admin-tree-expand-contract-button"/><a id="treeItem" class="lum-admin-tree-text '+channelClassName+'" href="main.jsp?lumChannelId='+channelId+'&lumPageId=LumisServices">'+displayName+'</a>';

			pChannelDiv.firstChild.onclick = onExpandContractClicked;
			pChannelDiv.lumCanExpand = true;
			pChannelDiv.style.paddingLeft = (10+(15*iDepth)) + "px";
		}
		
		if(channelIsTemplate)
			pChannelDiv.oncontextmenu = onChannelTemplateContextMenu;
		else
			pChannelDiv.oncontextmenu = onChannelContextMenu;

		var xmlDom = m_xmlHttp.responseXML;
		
		// render pages
		var pages = LumisPortalUtil.selectNodes("response/treeData/ps/p[cId='"+channelId+"']", xmlDom, xmlDom);
		
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
		
		var subChannels = LumisPortalUtil.selectNodes("response/treeData"+ currentDepth +"/cs/c[id='"+channelId+"']/cs/c", xmlDom, xmlDom);
		
		if(subChannels.length > 0 || pages.length > 0)
		{
			pChannelDiv.lumLoaded = true;
			pChannelDiv.lumExpanded = true;

			if(iDepth > 0)
				pChannelDiv.firstChild.src = g_LumisRootPath+"lumis/portalstudio/client/images/tree/close.png";
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
		var channelId = LumisPortalUtil.getElementText(LumisPortalUtil.selectSingleNode("cId", pageNode));
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
		
		if(pageIsTemplate)
		{
			pPageDiv.lumIsTemplate = "1";
			
			pageName += " [" + LumisPortalAdmin.localize("STR_TEMPLATE") + "]";
			pPageDiv.oncontextmenu = onPageTemplateContextMenu;
			pPageDiv.innerHTML = '<img src="'+g_LumisRootPath+'lumis/portal/client/images/Pix.gif" style=\"display:none\"/><a id="treeItem" class="lum-admin-tree-text lum-admin-tree-page-template" href="main.jsp?lumPageId='+pageId+'&lumChannelId='+channelId+'">'+LumisPortal.htmlEncode(pageName)+'</a>';
		}
		else
		{
			pPageDiv.oncontextmenu = onPageContextMenu;
			pPageDiv.innerHTML = '<img src="'+g_LumisRootPath+'lumis/portal/client/images/Pix.gif" style=\"display:none\"/><a id="treeItem" class="lum-admin-tree-text lum-admin-tree-page" href="main.jsp?lumPageId='+pageId+'&lumChannelId='+channelId+'">'+LumisPortal.htmlEncode(pageName)+'</a>';
		}
		
		pPageDiv.lumName = pageName;
		pPageDiv.lumPageId = pageId;
		pPageDiv.lumChannelId = channelId;
		pPageDiv.title = pageName;

		if(pageId == g_LumisPageId)
		{
			pPageDiv.className = "lum-admin-tree-item lum-admin-tree-item-selected";
			g_LumisSelectedTreeItem = pPageDiv;
		}
		else
			pPageDiv.className = "lum-admin-tree-item";
			
		pPageDiv.style.paddingLeft += (10+(15*iDepth)) + "px";		
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
			LumisPortal.gotoPage('LumisServices', srcElement.lumChannelId);
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
			LumisPortal.gotoPage(srcElement.lumPageId);
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

	function onChannelContextMenu(event)
	{
		if(!event)
			event = window.event;
			
		var srcElement = event.srcElement;

		if(!srcElement)
			srcElement = event.target;

		while(srcElement && !srcElement.lumChannelId)
			srcElement = srcElement.parentNode;
			
		var strChannelName = srcElement.lumName;
		
		var propertiesInterfaceName = "lumis.service.portalmanagement.channel.edit";
		if(srcElement.lumChannelId == "00000000D00000000000000000000001")
			propertiesInterfaceName = "lumis.service.portalmanagement.channel.portalProperties";

		var strTemp = g_LumisContextMenu.generateHeader(srcElement.lumName, 'lum-admin-context-menu-title lum-admin-context-menu-channel-title');
		strTemp += g_LumisContextMenu.generateMenuItem("STR_PROPERTIES", "g_LumisContextMenu.hide();LumisLightBox.open('"+LumisPortal.mainName+"?"+LumisPortal.pageParameterPageIdName+"=LumisBlankPage&"+LumisPortal.pageParameterChannelIdName+"="+srcElement.lumChannelId+"&lumRTI="+propertiesInterfaceName+"&channelId="+srcElement.lumChannelId+"',{'width':900,showCloseButton:false,hideOnOverlayClick:false,padding:0});");
		strTemp += g_LumisContextMenu.generateMenuItem("STR_EDIT_STRUCTURE", "g_LumisContextMenu.hide();LumisLightBox.open('"+LumisPortal.mainName+"?"+LumisPortal.pageParameterPageIdName+"=LumisBlankPage&"+LumisPortal.pageParameterChannelIdName+"="+srcElement.lumChannelId+"&lumRTI=lumis.service.portalmanagement.structureeditor.structureEditor&channelId="+srcElement.lumChannelId+"',{'width':900,showCloseButton:false,hideOnOverlayClick:false,padding:0});");
		strTemp += g_LumisContextMenu.generateSeparator();
		strTemp += g_LumisContextMenu.generateMenuItem("STR_MANAGE_ACCESS", "g_LumisContextMenu.hide();LumisLightBox.open('"+LumisPortal.mainName+"?"+LumisPortal.pageParameterPageIdName+"=LumisBlankPage&"+LumisPortal.pageParameterChannelIdName+"="+srcElement.lumChannelId+"&lumRTI=lumis.service.portalmanagement.channelacl.administration&itemId="+srcElement.lumChannelId+"',{'width':900,showCloseButton:false,hideOnOverlayClick:false,padding:0});");
		strTemp += g_LumisContextMenu.generateMenuItem("STR_CLEAR_CACHE", "g_LumisContextMenu.hide();g_LumisChannelTree.onClearChannelCache('"+srcElement.lumChannelId+"',unescape('"+escape(strChannelName)+"'), false);");
		strTemp += g_LumisContextMenu.generateSeparator();

		strTemp += g_LumisContextMenu.generateMenuItem("STR_EXPORT_CHANNEL", "g_LumisContextMenu.hide();LumisLightBox.open('"+LumisPortal.mainName+"?"+LumisPortal.pageParameterPageIdName+"=LumisBlankPage&"+LumisPortal.pageParameterChannelIdName+"="+srcElement.lumChannelId+"&lumRTI=lumis.service.portalmanagement.importexport.export',{'width':900,showCloseButton:false,hideOnOverlayClick:false,padding:0});");
		strTemp += g_LumisContextMenu.generateMenuItem("STR_IMPORT_CHANNEL", "g_LumisContextMenu.hide();LumisLightBox.open('"+LumisPortal.mainName+"?"+LumisPortal.pageParameterPageIdName+"=LumisBlankPage&"+LumisPortal.pageParameterChannelIdName+"="+srcElement.lumChannelId+"&lumRTI=lumis.service.portalmanagement.importexport.import&lumCurrChannelId=" + g_LumisChannelId + "&lumCurrPageId=" + g_LumisPageId + "',{'width':900,showCloseButton:false,hideOnOverlayClick:false,padding:0});");

		strTemp += g_LumisContextMenu.generateSeparator();

		if(srcElement.lumParentChannelId)
		{
			strTemp += g_LumisContextMenu.generateMenuItem("STR_DELETE_CHANNEL", "g_LumisContextMenu.hide();g_LumisChannelTree.onDeleteChannel('"+srcElement.lumChannelId+"',unescape('"+escape(strChannelName)+"'),'"+srcElement.lumParentChannelId+"');");
			strTemp += g_LumisContextMenu.generateSeparator();
		}

		strTemp += g_LumisContextMenu.generateMenuItem("STR_ADD_PROJECT", "g_LumisContextMenu.hide();LumisLightBox.open('"+LumisPortal.mainName+"?"+LumisPortal.pageParameterPageIdName+"=LumisBlankPage&"+LumisPortal.pageParameterChannelIdName+"="+srcElement.lumChannelId+"&lumRTI=lumis.service.portalmanagement.project.createproject&parentChannelId="+srcElement.lumChannelId+"',{'width':900,showCloseButton:false,hideOnOverlayClick:false,padding:0});");
		strTemp += g_LumisContextMenu.generateMenuItem("STR_ADD_CHANNEL", "g_LumisContextMenu.hide();LumisLightBox.open('"+LumisPortal.mainName+"?"+LumisPortal.pageParameterPageIdName+"=LumisBlankPage&"+LumisPortal.pageParameterChannelIdName+"="+srcElement.lumChannelId+"&lumRTI=lumis.service.portalmanagement.channel.add&parentChannelId="+srcElement.lumChannelId+"',{'width':900,showCloseButton:false,hideOnOverlayClick:false,padding:0});");
		strTemp += g_LumisContextMenu.generateMenuItem("STR_ADD_CHANNEL_TEMPLATE", "g_LumisContextMenu.hide();LumisLightBox.open('"+LumisPortal.mainName+"?"+LumisPortal.pageParameterPageIdName+"=LumisBlankPage&"+LumisPortal.pageParameterChannelIdName+"="+srcElement.lumChannelId+"&lumRTI=lumis.service.portalmanagement.channeltemplate.add&parentChannelId="+srcElement.lumChannelId+"',{'width':900,showCloseButton:false,hideOnOverlayClick:false,padding:0});");
		strTemp += g_LumisContextMenu.generateMenuItem("STR_ADD_PAGE", "g_LumisContextMenu.hide();LumisLightBox.open('"+LumisPortal.mainName+"?"+LumisPortal.pageParameterPageIdName+"=LumisBlankPage&"+LumisPortal.pageParameterChannelIdName+"="+srcElement.lumChannelId+"&lumRTI=lumis.service.portalmanagement.page.add&parentChannelId="+srcElement.lumChannelId+"',{'width':900,showCloseButton:false,hideOnOverlayClick:false,padding:0});");
		strTemp += g_LumisContextMenu.generateMenuItem("STR_ADD_PAGE_TEMPLATE", "g_LumisContextMenu.hide();LumisLightBox.open('"+LumisPortal.mainName+"?"+LumisPortal.pageParameterPageIdName+"=LumisBlankPage&"+LumisPortal.pageParameterChannelIdName+"="+srcElement.lumChannelId+"&lumRTI=lumis.service.portalmanagement.pagetemplate.add&parentChannelId="+srcElement.lumChannelId+"',{'width':900,showCloseButton:false,hideOnOverlayClick:false,padding:0});");
		strTemp += g_LumisContextMenu.generateSeparator();

		strTemp += g_LumisContextMenu.generateMenuItem("STR_URL_SHORTENER_PROPERTIES", "g_LumisContextMenu.hide();LumisLightBox.open('"+LumisPortal.mainName+"?"+LumisPortal.pageParameterPageIdName+"=LumisBlankPage&"+LumisPortal.pageParameterChannelIdName+"="+srcElement.lumChannelId+"&lumRTI=lumis.service.urlshortener.configureUrlShortener',{'width':900,showCloseButton:false,hideOnOverlayClick:false,padding:0});");

		strTemp += g_LumisContextMenu.generateSeparator();

		strTemp += g_LumisContextMenu.generateMenuItem("STR_MANAGE_PORTAL_ACCESS", "g_LumisContextMenu.hide();LumisLightBox.open('"+LumisPortal.mainName+"?"+LumisPortal.pageParameterChannelIdName+"="+srcElement.lumChannelId+"&"+LumisPortal.pageParameterPageIdName+"=LumisBlankPage&lumRTI=lumis.service.portalmanagement.portalacl.administration',{'width':900,showCloseButton:false,hideOnOverlayClick:false,padding:0});");

		strTemp += g_LumisContextMenu.generateFooter();
		
		g_LumisContextMenu.show(element, strTemp, event.clientX, event.clientY);

		event.returnValue = false;
		event.cancelBubble = true;
		return false;
	}
	
	//-------------------------------------------------------------------

	function onChannelTemplateContextMenu(event)
	{
		if(!event)
			event = window.event;
			
		var srcElement = event.srcElement;

		if(!srcElement)
			srcElement = event.target;

		while(srcElement && !srcElement.lumChannelId)
			srcElement = srcElement.parentNode;
			
		var strChannelName = srcElement.lumName;

		var strTemp = g_LumisContextMenu.generateHeader(srcElement.lumName, 'lum-admin-context-menu-title lum-admin-context-menu-channel-template-title');
		strTemp += g_LumisContextMenu.generateMenuItem("STR_PROPERTIES", "g_LumisContextMenu.hide();LumisLightBox.open('"+LumisPortal.mainName+"?"+LumisPortal.pageParameterPageIdName+"=LumisBlankPage&"+LumisPortal.pageParameterChannelIdName+"="+srcElement.lumChannelId+"&lumRTI=lumis.service.portalmanagement.channeltemplate.edit&channelId="+srcElement.lumChannelId+"',{'width':900,showCloseButton:false,hideOnOverlayClick:false,padding:0});");
		strTemp += g_LumisContextMenu.generateMenuItem("STR_EDIT_STRUCTURE", "g_LumisContextMenu.hide();LumisLightBox.open('"+LumisPortal.mainName+"?"+LumisPortal.pageParameterPageIdName+"=LumisBlankPage&"+LumisPortal.pageParameterChannelIdName+"="+srcElement.lumChannelId+"&lumRTI=lumis.service.portalmanagement.structureeditor.structureEditor&channelId="+srcElement.lumChannelId+"',{'width':900,showCloseButton:false,hideOnOverlayClick:false,padding:0});");
		strTemp += g_LumisContextMenu.generateSeparator();
		strTemp += g_LumisContextMenu.generateMenuItem("STR_MANAGE_ACCESS", "g_LumisContextMenu.hide();LumisLightBox.open('"+LumisPortal.mainName+"?"+LumisPortal.pageParameterPageIdName+"=LumisBlankPage&"+LumisPortal.pageParameterChannelIdName+"="+srcElement.lumChannelId+"&lumRTI=lumis.service.portalmanagement.channelacl.administration&itemId="+srcElement.lumChannelId+"',{'width':900,showCloseButton:false,hideOnOverlayClick:false,padding:0});");
		strTemp += g_LumisContextMenu.generateMenuItem("STR_CLEAR_CACHE", "g_LumisContextMenu.hide();g_LumisChannelTree.onClearChannelCache('"+srcElement.lumChannelId+"',unescape('"+escape(strChannelName)+"'), true);");
		strTemp += g_LumisContextMenu.generateSeparator();
		strTemp += g_LumisContextMenu.generateMenuItem("STR_UPDATE_CHANNELS", "g_LumisContextMenu.hide();LumisLightBox.open('"+LumisPortal.mainName+"?"+LumisPortal.pageParameterPageIdName+"=LumisBlankPage&"+LumisPortal.pageParameterChannelIdName+"="+srcElement.lumChannelId+"&lumRTI=lumis.service.portalmanagement.channeltemplate.updateChannels&templateId="+srcElement.lumChannelId+"',{'width':900,showCloseButton:false,hideOnOverlayClick:false,padding:0});");
		strTemp += g_LumisContextMenu.generateSeparator();
		strTemp += g_LumisContextMenu.generateMenuItem("STR_EXPORT_CHANNEL", "g_LumisContextMenu.hide();LumisLightBox.open('"+LumisPortal.mainName+"?"+LumisPortal.pageParameterPageIdName+"=LumisBlankPage&"+LumisPortal.pageParameterChannelIdName+"="+srcElement.lumChannelId+"&lumRTI=lumis.service.portalmanagement.importexport.export',{'width':900,showCloseButton:false,hideOnOverlayClick:false,padding:0});");
		strTemp += g_LumisContextMenu.generateMenuItem("STR_IMPORT_CHANNEL", "g_LumisContextMenu.hide();LumisLightBox.open('"+LumisPortal.mainName+"?"+LumisPortal.pageParameterPageIdName+"=LumisBlankPage&"+LumisPortal.pageParameterChannelIdName+"="+srcElement.lumChannelId+"&lumRTI=lumis.service.portalmanagement.importexport.import&lumCurrChannelId=" + g_LumisChannelId + "&lumCurrPageId=" + g_LumisPageId + "',{'width':900,showCloseButton:false,hideOnOverlayClick:false,padding:0});");
		strTemp += g_LumisContextMenu.generateSeparator();
		strTemp += g_LumisContextMenu.generateMenuItem("STR_DELETE_CHANNEL", "g_LumisContextMenu.hide();g_LumisChannelTree.onDeleteChannel('"+srcElement.lumChannelId+"',unescape('"+escape(strChannelName)+"'),'"+srcElement.lumParentChannelId+"');");
		strTemp += g_LumisContextMenu.generateSeparator();
		strTemp += g_LumisContextMenu.generateMenuItem("STR_ADD_CHANNEL", "g_LumisContextMenu.hide();LumisLightBox.open('"+LumisPortal.mainName+"?"+LumisPortal.pageParameterPageIdName+"=LumisBlankPage&"+LumisPortal.pageParameterChannelIdName+"="+srcElement.lumChannelId+"&lumRTI=lumis.service.portalmanagement.channel.add&parentChannelId="+srcElement.lumChannelId+"',{'width':900,showCloseButton:false,hideOnOverlayClick:false,padding:0});");
		strTemp += g_LumisContextMenu.generateMenuItem("STR_ADD_CHANNEL_TEMPLATE", "g_LumisContextMenu.hide();LumisLightBox.open('"+LumisPortal.mainName+"?"+LumisPortal.pageParameterPageIdName+"=LumisBlankPage&"+LumisPortal.pageParameterChannelIdName+"="+srcElement.lumChannelId+"&lumRTI=lumis.service.portalmanagement.channeltemplate.add&parentChannelId="+srcElement.lumChannelId+"',{'width':900,showCloseButton:false,hideOnOverlayClick:false,padding:0});");
		strTemp += g_LumisContextMenu.generateMenuItem("STR_ADD_PAGE", "g_LumisContextMenu.hide();LumisLightBox.open('"+LumisPortal.mainName+"?"+LumisPortal.pageParameterPageIdName+"=LumisBlankPage&"+LumisPortal.pageParameterChannelIdName+"="+srcElement.lumChannelId+"&lumRTI=lumis.service.portalmanagement.page.add&parentChannelId="+srcElement.lumChannelId+"',{'width':900,showCloseButton:false,hideOnOverlayClick:false,padding:0});");
		strTemp += g_LumisContextMenu.generateMenuItem("STR_ADD_PAGE_TEMPLATE", "g_LumisContextMenu.hide();LumisLightBox.open('"+LumisPortal.mainName+"?"+LumisPortal.pageParameterPageIdName+"=LumisBlankPage&"+LumisPortal.pageParameterChannelIdName+"="+srcElement.lumChannelId+"&lumRTI=lumis.service.portalmanagement.pagetemplate.add&parentChannelId="+srcElement.lumChannelId+"',{'width':900,showCloseButton:false,hideOnOverlayClick:false,padding:0});");
		strTemp += g_LumisContextMenu.generateSeparator();
		strTemp += g_LumisContextMenu.generateMenuItem("STR_URL_SHORTENER_PROPERTIES", "g_LumisContextMenu.hide();LumisLightBox.open('"+LumisPortal.mainName+"?"+LumisPortal.pageParameterPageIdName+"=LumisBlankPage&"+LumisPortal.pageParameterChannelIdName+"="+srcElement.lumChannelId+"&lumRTI=lumis.service.urlshortener.configureUrlShortener',{'width':900,showCloseButton:false,hideOnOverlayClick:false,padding:0});");
		strTemp += g_LumisContextMenu.generateFooter();
		
		g_LumisContextMenu.show(element, strTemp, event.clientX, event.clientY);

		event.returnValue = false;
		event.cancelBubble = true;
		return false;
	}
	
	//-------------------------------------------------------------------

	function onPageContextMenu(event)
	{
		if(!event)
			event = window.event;
			
		var srcElement = event.srcElement;
		
		if(!srcElement)
			srcElement = event.target;

		while(srcElement && !srcElement.lumPageId)
			srcElement = srcElement.parentNode;
			
		var strPageName = srcElement.lumName;
		
		var strTemp = g_LumisContextMenu.generateHeader(srcElement.lumName, 'lum-admin-context-menu-title lum-admin-context-menu-page-title');
		strTemp += g_LumisContextMenu.generateMenuItem("STR_PROPERTIES", "g_LumisContextMenu.hide();LumisLightBox.open('"+LumisPortal.mainName+"?"+LumisPortal.pageParameterPageIdName+"=LumisBlankPage&"+LumisPortal.pageParameterChannelIdName+"="+srcElement.lumChannelId+"&lumRTI=lumis.service.portalmanagement.page.edit&pageId="+srcElement.lumPageId+"',{'width':900,showCloseButton:false,hideOnOverlayClick:false,padding:0}, 'top=10,width=645,height=586, left=20');");
		strTemp += g_LumisContextMenu.generateSeparator();
		strTemp += g_LumisContextMenu.generateMenuItem("STR_MANAGE_ACCESS", "g_LumisContextMenu.hide();LumisLightBox.open('"+LumisPortal.mainName+"?"+LumisPortal.pageParameterPageIdName+"=LumisBlankPage&"+LumisPortal.pageParameterChannelIdName+"="+srcElement.lumChannelId+"&lumRTI=lumis.service.portalmanagement.pageacl.administration&itemId="+srcElement.lumPageId+"',{'width':900,showCloseButton:false,hideOnOverlayClick:false,padding:0}, 'top=10,width=500,height=595');");
		strTemp += g_LumisContextMenu.generateMenuItem("STR_CLEAR_CACHE", "g_LumisContextMenu.hide();g_LumisChannelTree.onClearPageCache('"+srcElement.lumPageId+"', unescape('"+escape(strPageName)+"'), false);");
		strTemp += g_LumisContextMenu.generateSeparator();
		strTemp += g_LumisContextMenu.generateMenuItem("STR_DELETE_PAGE", "g_LumisContextMenu.hide();g_LumisChannelTree.onDeletePage('"+srcElement.lumPageId+"', unescape('"+escape(strPageName)+"'));");
		strTemp += g_LumisContextMenu.generateFooter();
		
		g_LumisContextMenu.show(element, strTemp, event.clientX, event.clientY);

		event.returnValue = false;
		event.cancelBubble = true;
		
		return false;
	}
	
	//-------------------------------------------------------------------

	function onPageTemplateContextMenu(event)
	{
		if(!event)
			event = window.event;
			
		var srcElement = event.srcElement;
		
		if(!srcElement)
			srcElement = event.target;

		while(srcElement && !srcElement.lumPageId)
			srcElement = srcElement.parentNode;
			
		var strPageName = srcElement.lumName;
		
		var strTemp = g_LumisContextMenu.generateHeader(srcElement.lumName, 'lum-admin-context-menu-title lum-admin-context-menu-page-template-title');
		strTemp += g_LumisContextMenu.generateMenuItem("STR_PROPERTIES", "g_LumisContextMenu.hide();LumisLightBox.open('"+LumisPortal.mainName+"?"+LumisPortal.pageParameterPageIdName+"=LumisBlankPage&"+LumisPortal.pageParameterChannelIdName+"="+srcElement.lumChannelId+"&lumRTI=lumis.service.portalmanagement.pagetemplate.edit&pageId="+srcElement.lumPageId+"',{'width':900,showCloseButton:false,hideOnOverlayClick:false,padding:0});");
		strTemp += g_LumisContextMenu.generateSeparator();
		strTemp += g_LumisContextMenu.generateMenuItem("STR_MANAGE_ACCESS", "g_LumisContextMenu.hide();LumisLightBox.open('"+LumisPortal.mainName+"?"+LumisPortal.pageParameterPageIdName+"=LumisBlankPage&"+LumisPortal.pageParameterChannelIdName+"="+srcElement.lumChannelId+"&lumRTI=lumis.service.portalmanagement.pagetemplateacl.administration&pageTemplateId="+srcElement.lumPageId+"',{'width':900,showCloseButton:false,hideOnOverlayClick:false,padding:0});");
		strTemp += g_LumisContextMenu.generateMenuItem("STR_CLEAR_CACHE", "g_LumisContextMenu.hide();g_LumisChannelTree.onClearPageCache('"+srcElement.lumPageId+"', unescape('"+escape(strPageName)+"'), true);");
		strTemp += g_LumisContextMenu.generateSeparator();
		strTemp += g_LumisContextMenu.generateMenuItem("STR_UPDATE_PAGES", "g_LumisContextMenu.hide();LumisLightBox.open('"+LumisPortal.mainName+"?"+LumisPortal.pageParameterPageIdName+"=LumisBlankPage&"+LumisPortal.pageParameterChannelIdName+"="+srcElement.lumChannelId+"&lumRTI=lumis.service.portalmanagement.pagetemplate.updatePages&templateId="+srcElement.lumPageId+"',{'width':900,showCloseButton:false,hideOnOverlayClick:false,padding:0});");
		strTemp += g_LumisContextMenu.generateMenuItem("STR_APPLY_PAGE_TEMPLATE", "g_LumisContextMenu.hide();LumisLightBox.open('"+LumisPortal.mainName+"?"+LumisPortal.pageParameterPageIdName+"=LumisBlankPage&"+LumisPortal.pageParameterChannelIdName+"="+srcElement.lumChannelId+"&lumRTI=lumis.service.portalmanagement.pagetemplate.applyTemplate&templateId="+srcElement.lumPageId+"',{'width':900,showCloseButton:false,hideOnOverlayClick:false,padding:0});");
		strTemp += g_LumisContextMenu.generateSeparator();
		strTemp += g_LumisContextMenu.generateMenuItem("STR_DELETE_PAGE_TEMPLATE", "g_LumisContextMenu.hide();g_LumisChannelTree.onDeletePage('"+srcElement.lumPageId+"', unescape('"+escape(strPageName)+"'));");		


		strTemp += g_LumisContextMenu.generateFooter();
		
		g_LumisContextMenu.show(element, strTemp, event.clientX, event.clientY);

		event.returnValue = false;
		event.cancelBubble = true;
		return false;
	}
	
	//-------------------------------------------------------------------

	function onDeleteChannel(strChannelId, strChannelName, strParentChannelId)
	{
		if(confirm(LumisPortalAdmin.localize("STR_ARE_YOU_SURE_TO_DELETE", [strChannelName])))
		{
			var strMethod = "<method name=\"deleteChannel\">";
			strMethod += "<id>"+strChannelId+"</id>";
			strMethod += "</method>";
			
			var interfaceIdXml = LumisPortalUtil.makeHttpRequest(g_LumisRootPath+"lumis/portal/controller/xml/ChannelControllerXml.jsp", strMethod, null, true);
			
			if (checkForError(interfaceIdXml))
			{
				LumisPortal.gotoPage('LumisServices', strParentChannelId);
			}
		}
	}
	
	//-------------------------------------------------------------------

	function onClearChannelCache(strChannelId, strChannelName, isTemplate)
	{
		var strMessage;
		if(isTemplate)
			strMessage = "STR_ARE_YOU_SURE_TO_CLEAR_CHANNEL_TEMPLATE_CACHE";
		else
			strMessage = "STR_ARE_YOU_SURE_TO_CLEAR_CHANNEL_CACHE";
		
		if(confirm(LumisPortalAdmin.localize(strMessage, [strChannelName])))
		{
			var strMethod = "<method name=\"clearChannelCache\">";
			strMethod += "<id>"+strChannelId+"</id>";
			strMethod += "</method>";
			
			var interfaceIdXml = LumisPortalUtil.makeHttpRequest(g_LumisRootPath+"lumis/portal/controller/xml/ChannelControllerXml.jsp", strMethod, null, true);
			
			if (checkForError(interfaceIdXml))
			{
				LumisPortal.onRefresh();
			}
		}
	}
	
	//-------------------------------------------------------------------

	function onDeletePage(strPageId, strPageName)
	{
		if(confirm(LumisPortalAdmin.localize("STR_ARE_YOU_SURE_TO_DELETE", [strPageName])))
		{
			var strMethod = "<method name=\"deletePage\">";
			strMethod += "<id>"+strPageId+"</id>";
			strMethod += "</method>";
			
			var interfaceIdXml = LumisPortalUtil.makeHttpRequest(g_LumisRootPath+"lumis/portal/controller/xml/PageControllerXml.jsp", strMethod, null, true);

			if (checkForError(interfaceIdXml))
			{
				if(strPageId == g_LumisPageId)
					LumisPortal.gotoPage('LumisServices', g_LumisChannelId);
				else
					LumisPortal.onRefresh();
			}
		}
	}
	
	//-------------------------------------------------------------------

	function onClearPageCache(strPageId, strPageName, isTemplate)
	{
		var strMessage;
		if(isTemplate)
			strMessage = "STR_ARE_YOU_SURE_TO_CLEAR_PAGE_TEMPLATE_CACHE";
		else
			strMessage = "STR_ARE_YOU_SURE_TO_CLEAR_PAGE_CACHE";
	
		if(confirm(LumisPortalAdmin.localize(strMessage, [strPageName])))
		{
			var strMethod = "<method name=\"clearPageCache\">";
			strMethod += "<id>"+strPageId+"</id>";
			strMethod += "</method>";
			
			var interfaceIdXml = LumisPortalUtil.makeHttpRequest(g_LumisRootPath+"lumis/portal/controller/xml/PageControllerXml.jsp", strMethod, null, true);

			if (checkForError(interfaceIdXml))
			{
				LumisPortal.onRefresh();
			}
		}
	}

	//-------------------------------------------------------------------

	function checkForError(responseDocument)
	{
		if (responseDocument == null)
			return false;
		var exceptionNode = LumisPortalUtil.selectSingleNode("response/PortalException", responseDocument);
		if (exceptionNode == null)
			return true;
		var messageNode = LumisPortalUtil.selectSingleNode("message", exceptionNode);	
		if (messageNode != null)
			alert(LumisPortalUtil.getElementText(messageNode));
		return false;
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
			strMethod += "</method>";
			
			var xmlObj = LumisPortalUtil.getXmlHttpObject();
			LumisPortalUtil.makeHttpRequest(g_LumisRootPath+"lumis/portal/controller/xml/ChannelTreeControllerXml.jsp", strMethod, null, true, xmlObj);
  			renderTree(srcElement, srcElement.lumChannelId, srcElement.lumDepth+1, xmlObj);
  			
			xmlDom = xmlObj.responseXML;

  			srcElement.lumLoaded = true;
  			if(!LumisPortalUtil.selectSingleNode("response/treeData/cs/c", xmlDom) && !LumisPortalUtil.selectSingleNode("response/treeData/ps/p", xmlDom))
  			{
  				srcElement.lumCanExpand = false;
  				srcElement.firstChild.style.visibility = "hidden";
  			}
  			else
  			{
  				srcElement.firstChild.src = g_LumisRootPath+"lumis/portalstudio/client/images/tree/close.png";
  				srcElement.lumExpanded = true;
  			}
  			
  			return;
		}

		var displayMode = "";
		if(srcElement.lumExpanded)
		{
			srcElement.firstChild.src = g_LumisRootPath+"lumis/portalstudio/client/images/tree/open.png";
			srcElement.lumExpanded = false;
			displayMode = "none";
		}
		else
		{
			srcElement.firstChild.src = g_LumisRootPath+"lumis/portalstudio/client/images/tree/close.png";
			srcElement.lumExpanded = true;
		}
		
		var pCurElement = srcElement.nextSibling;

		while(pCurElement && pCurElement.lumDepth > srcElement.lumDepth)
		{
			if(!srcElement.lumExpanded || pCurElement.lumDepth == srcElement.lumDepth+1)
				pCurElement.style.display = displayMode;
				
			if(!srcElement.lumExpanded && pCurElement.lumCanExpand)
			{
				pCurElement.lumExpanded = false;
				if(pCurElement.firstChild)
					pCurElement.firstChild.src = g_LumisRootPath+"lumis/portalstudio/client/images/tree/open.png";
			}

			pCurElement = pCurElement.nextSibling;
		}
	}
}