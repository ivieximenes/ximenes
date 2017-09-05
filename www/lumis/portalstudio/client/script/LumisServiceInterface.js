// $Revision: 17533 $ $Date: 2015-07-09 00:24:10 -0300 (Thu, 09 Jul 2015) $
(function($)
{
window.LumisServiceInterface = function (element)
{
	element.lumDragEnter = lumDragEnter;
	element.lumDragOver = lumDragOver;
	element.lumDragLeave = lumDragLeave;
	element.lumDrop = lumDrop;
	element.lumNotifyDrop = lumNotifyDrop;
	element.lumDragData = "<lumDragObject>"+
								"<type>lumServiceInterfaceInstance</type>"+
								"<data>"+
									"<sInstName>"+element.getAttribute("lumServiceInstName")+"</sInstName>"+
									"<n>"+element.getAttribute("lumInterfaceName")+"</n>"+
									"<iiId>"+element.getAttribute("lumInterfaceInstId")+"</iiId>";

	if(element.getAttribute("isInterfaceHolder") == "1")
		element.lumDragData += "<isIH>1</isIH>";

	element.lumDragData += "</data></lumDragObject>";

	element.onHideContextMenu = onHideContextMenu;
	element.renderInterface = renderInterface;
	element.saveInterfaceXml = saveInterfaceXml;
	element.oncontextmenu = onContextMenu;
	element.onDelete = onDelete;

	var m_$Element = $(element);
	var m_$ContentDiv;
	var m_$Spacer = $("<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>");

	if(!g_LumisLayoutFile)
	{
		if(element.firstChild == null)
		{
			m_$ContentDiv = $("<div></div>");
			m_$Element.prepend(m_$ContentDiv);
		}
		else
		{
			m_$ContentDiv = $(element.firstChild);
		}
	}
	else
	{
		m_$ContentDiv = m_$Element;
	}

	if(!LumisPortal.getCookie("lumSafeRenderMode"))
	{
		m_$ContentDiv.append(m_$Spacer);
	}

	var m_pHighlight = new LumisServiceInterfaceHighlight(element, m_$ContentDiv);

	this.renderInterface = renderInterface;
	this.onPageChanged = onPageChanged;
	this.highlight = m_pHighlight;

	function lumDragEnter(event, dragData)
	{
		var iPosition = getDropPosition(event.clientX, event.clientY);
		g_LumisPage.PageDropHighlight.show(m_$ContentDiv[0], iPosition);		
	}

	function lumDragOver(event, dragData)
	{
		var iPosition = getDropPosition(event.clientX, event.clientY);
		g_LumisPage.PageDropHighlight.show(m_$ContentDiv[0], iPosition);
	}

	function lumDragLeave(event)
	{
		g_LumisPage.PageDropHighlight.hide();
	}

	function lumDrop(event, dragData, pSrc)
	{
		g_LumisPage.PageDropHighlight.hide();

		var iPosition = getDropPosition(event.clientX, event.clientY);
		
		return g_LumisPage.interfaceDropped(dragData, pSrc, iPosition, element);
	}
	
	function lumNotifyDrop(pDest)
	{
		onDelete();
	}
	
	function onDelete(event)
	{
		if(!LumisPortalAdmin.inEditMode)
			return;

		m_$Element.fadeOut(250,
				function()
				{
					if (g_LumisLayoutFile)
					{
						var ii = element.getAttribute("lumInterfaceInstId")
						var holderId = element.getAttribute("lumHolderId");
						
						g_LumisPage.removeHighlight(holderId);
						
						removeInterface(ii);
					}
					else
					{
						var parent = element.parentNode;
						parent.removeChild(element);
						
						if(!parent.hasChildNodes())
							parent.parentNode.removeChild(parent);
					}
					if(m_pHighlight) m_pHighlight.remove();
					g_LumisPage.onPageChanged();
				}
		);
	}

	/**************
	 position: 	0 = above
	 			1 = below
	 			2 = left
	 			3 = right
	 			4 = left within same table (for colspan)
	 			5 = right within same table (for rowspan)
	 *************/
	function getDropPosition(xpos, ypos)
	{
		var iPosition = 0;

		var iLeft = m_$Element.offset().left;
		var iWidth = m_$Element.outerWidth();
		var iTop = m_$Element.offset().top;
		var iHeight = m_$Element.outerHeight();
		
		if(g_LumisPageConfig.isTemplate || !g_LumisPageConfig.hasParentTemplate)
		{
			if(iLeft+(iWidth * 0.1) >= xpos && !g_LumisLayoutFile)
			{
				if(LumisPortalAdmin.ctrlKeyPressed)
					iPosition = 4;
				else
					iPosition = 2;
			}
			else if(iLeft+(iWidth - (iWidth * 0.1))  <= xpos  && !g_LumisLayoutFile)
			{
				if(LumisPortalAdmin.ctrlKeyPressed)
					iPosition = 5;
				else
					iPosition = 3;
			}
			else if(iTop+(iHeight/2) <= ypos)
				iPosition = 1;
		}
		else if(!g_LumisLayoutFile)
		{
			if(hasTemplateInterfaceInSameRow(element))
			{
				iPosition = 4;
			}
			else
			{
				if(!element.getAttribute("isInterfaceHolder"))
				{
					if(iLeft+(iWidth * 0.1) >= xpos)
					{
						iPosition = 4;
					}
					else if(iLeft+(iWidth - (iWidth * 0.1)) <= xpos)
					{
						iPosition = 5;
					}
				}
			}
		}

		return iPosition;
	}
	
	function hasTemplateInterfaceInSameRow(curElement)
	{
		var curSibling = curElement.previousSibling;
		
		while(curSibling)
		{
			if(curSibling.getAttribute("isFromTemplate"))
				return true;

			curSibling = curSibling.previousSibling;
		}
		
		curSibling = curElement.nextSibling;
		
		while(curSibling)
		{
			if(curSibling.getAttribute("isFromTemplate"))
				return true;

			curSibling = curSibling.nextSibling;
		}
		
		return false;
	}

	function saveInterfaceXml()
	{
		var xmlHttp = LumisPortalUtil.getXmlHttpObject();
		var strRequest = "lumPrevParams="+LumisPortal.lumisEncodeURIComponent(document.forms["LumisPortalForm"].elements["lumPrevParams"].value);
		xmlHttp.open("POST", document.forms["LumisPortalRenderInterfaceForm"].action+"&lumRenderII="+element.getAttribute("lumInterfaceInstId") +
				"&lumSaveXml=1&lumReferer=" +LumisPortal.lumisEncodeURIComponent(document.location.href), false);
		xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xmlHttp.send(strRequest);
	}
	
	function renderInterface()
	{
		updateServiceInterfaceInstanceProperties();

		// clear the interface cache if it exists
		var xmlHttp = LumisPortalUtil.getXmlHttpObject();
		xmlHttp.open("GET", document.forms["LumisPortalRenderInterfaceForm"].action+"&lumII="+element.getAttribute("lumInterfaceInstId")+"&lumRequestMethod=clearInterfaceCache", false);
		xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xmlHttp.send(null);
		
		// get the interface content and render it		
		var strRequest = "lumPrevParams="+LumisPortal.lumisEncodeURIComponent(document.forms["LumisPortalForm"].elements["lumPrevParams"].value);
		for (key in window.LumisBWKeys)
			strRequest += "&lumWriterKeys="+LumisPortal.lumisEncodeURIComponent(key);
		xmlHttp.open("POST", document.forms["LumisPortalRenderInterfaceForm"].action+"&lumRenderII="+element.getAttribute("lumInterfaceInstId") +
				"&lumReferer="+LumisPortal.lumisEncodeURIComponent(document.location.href), true);
		xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

		xmlHttp.onreadystatechange = function()
		{
			if (xmlHttp.readyState==4 && xmlHttp.status==200)
			{
				m_$ContentDiv.hide();
				var html = xmlHttp.responseText;
				try
				{
					LumisPortal.tempRenderHtml = function(html)
					{
						m_$Element.append(html);
					}
					m_$ContentDiv.html(html);
					LumisPortal.tempRenderHtml = undefined;
				}
				catch(err)
				{
					m_$ContentDiv.innerHTML = html;
					if(window.console && window.console.error)
					{
						window.console.error("Error injecting the following html using jquery: " + html);
						window.console.error(err);
						var f = window.console.info||window.console.log||window.console.debug||window.console.error;
						f("Falling back to the old way.");
					}
				}
				m_$ContentDiv.fadeIn(500);

				g_LumisPage.onPageChanged();
			}
		};
		xmlHttp.send(strRequest);
	}

	function updateServiceInterfaceInstanceProperties()
	{
		// adjust the interface layout properties
		var strMethod = "<method name=\"getServiceInterfaceInstanceProperties\">";
		strMethod += "<refresh>true</refresh>";
		strMethod += "<serviceInterfaceInstId>"+element.getAttribute("lumInterfaceInstId")+"</serviceInterfaceInstId>";
		strMethod += "</method>";
		var responseXml = LumisPortalUtil.makeHttpRequest(g_LumisRootPath+"lumis/portal/controller/xml/ServiceInterfaceInstanceControllerXml.jsp", strMethod, null, true);

		if(!g_LumisLayoutFile)
		{
			var propertyNode = LumisPortalUtil.selectSingleNode("response/data/standardProperties/width", responseXml);
			setCssProperty("width", propertyNode, "auto");

			propertyNode = LumisPortalUtil.selectSingleNode("response/data/standardProperties/height", responseXml);
			setCssProperty("height", propertyNode, "");

			propertyNode = LumisPortalUtil.selectSingleNode("response/data/standardProperties/paddingLeft", responseXml);
			setCssProperty("padding-left", propertyNode, "");
	
			propertyNode = LumisPortalUtil.selectSingleNode("response/data/standardProperties/paddingRight", responseXml);
			setCssProperty("padding-right", propertyNode, "");

			propertyNode = LumisPortalUtil.selectSingleNode("response/data/standardProperties/paddingTop", responseXml);
			setCssProperty("padding-top", propertyNode, "");

			propertyNode = LumisPortalUtil.selectSingleNode("response/data/standardProperties/paddingBottom", responseXml);
			setCssProperty("padding-bottom", propertyNode, "");

			propertyNode = LumisPortalUtil.selectSingleNode("response/data/standardProperties/colspan", responseXml);
			if(propertyNode != null)
			{
				propertyValue = LumisPortalUtil.getElementText(propertyNode);
				m_$Element.attr("colspan", propertyValue);
			}

			propertyNode = LumisPortalUtil.selectSingleNode("response/data/standardProperties/rowspan", responseXml);
			if(propertyNode != null)
			{
				propertyValue = LumisPortalUtil.getElementText(propertyNode);
				m_$Element.attr("rowspan", propertyValue);
			}
		}

		propertyNode = LumisPortalUtil.selectSingleNode("response/data/standardProperties/cacheEnabled", responseXml);
		if(propertyNode != null)
		{
			propertyValue = LumisPortalUtil.getElementText(propertyNode);
			m_$Element.attr("cacheEnabled", (propertyValue=="true"?1:0));
		}		
	}

	function setCssProperty(strProperty, propertyNode, defaultValue)
	{
		var propertyValue = defaultValue;

		if(propertyNode != null)
			propertyValue = LumisPortalUtil.getElementText(propertyNode);

		if(propertyValue != null && propertyValue != undefined)
			m_$Element.css(strProperty, propertyValue);
	}

	function onContextMenu(event)
	{
		if(!event)
			event = window.event;
			
		if(!element.getAttribute("isFromTemplate") && g_LumisPageConfig.type != 1 && g_LumisRootChannelId != LumisRootAdministrationChannelId)
		{
			return onContextMenuInternal(event, event.clientX, event.clientY);
		}
	}
	
	function onProperties()
	{
		g_LumisServiceInterfaceRender = renderInterface;
		LumisLightBox.open(LumisPortal.mainName+"?"+LumisPortal.pageParameterPageIdName+"=LumisBlankPage&"+LumisPortal.pageParameterChannelIdName+"="+g_LumisChannelId+"&lumRTI=lumis.service.portalmanagement.serviceinterfaceinstance.properties&interfaceInstId="+element.getAttribute("lumInterfaceInstId"),{'width':900,showCloseButton:false,hideOnOverlayClick:false,padding:0});
	}
	
	function onAccessControl()
	{
		g_LumisServiceInterfaceRender = renderInterface;
		LumisLightBox.open(LumisPortal.mainName+"?"+LumisPortal.pageParameterPageIdName+"=LumisBlankPage&"+LumisPortal.pageParameterChannelIdName+"="+g_LumisChannelId+"&lumRTI=lumis.service.portalmanagement.serviceinstanceacl.administration&serviceInstanceId="+element.getAttribute("lumServiceInstId"),{'width':900,showCloseButton:false,hideOnOverlayClick:false,padding:0});
	}
	
	function onPriority()
	{
		g_LumisServiceInterfaceRender = renderInterface;
		LumisLightBox.open(LumisPortal.mainName+"?"+LumisPortal.pageParameterPageIdName+"=LumisBlankPage&"+LumisPortal.pageParameterChannelIdName+"="+g_LumisChannelId+"&lumRTI=lumis.service.portalmanagement.serviceinterfaceinstance.interfaceHolderProperties&interfaceInstId="+element.getAttribute("lumInterfaceInstId"),{'width':900,showCloseButton:false,hideOnOverlayClick:false,padding:0});
	}
	
	function onContextMenuInternal(event, xPos, yPos)
	{
		g_LumisMenuAction[0] = onProperties;
		g_LumisMenuAction[1] = renderInterface;
		g_LumisMenuAction[2] = onDelete;
		g_LumisMenuAction[3] = onPriority;
		g_LumisMenuAction[4] = onAccessControl;
		var oldSelectedInterface = LumisSelectedInterface; 
		LumisSelectedInterface = element;
		
		var strTemp = "";
		if(element.getAttribute("isInterfaceHolder") && g_LumisPageConfig.isTemplate)
		{
			strTemp += g_LumisContextMenu.generateHeader("STR_TEMPLATE", "lum-admin-context-menu-title lum-admin-context-menu-service-title");
			strTemp += g_LumisContextMenu.generateMenuItem("STR_PROPERTIES", "g_LumisContextMenu.processMenuAction(3);");
		}
		else
		{
			strTemp += g_LumisContextMenu.generateHeader(element.getAttribute("lumServiceInstName"), "lum-admin-context-menu-title lum-admin-context-menu-service-title");
			strTemp += g_LumisContextMenu.generateMenuItem("STR_PROPERTIES", "g_LumisContextMenu.processMenuAction(0);");
			strTemp += g_LumisContextMenu.generateMenuItem("STR_MANAGE_ACCESS", "g_LumisContextMenu.processMenuAction(4);");
		}

		strTemp += g_LumisContextMenu.generateSeparator();

		var responseXml = getMenu();
		var adminMenuNode = LumisPortalUtil.selectSingleNode("response/menu", responseXml);
		if(adminMenuNode != null)
		{
			var count = 0;
			var curAdminMenuItem = adminMenuNode.firstChild;
			while(curAdminMenuItem != null)
			{
				count++;
				while(curAdminMenuItem.nodeName == "separator")
				{
					strTemp += g_LumisContextMenu.generateSeparator();
					curAdminMenuItem = curAdminMenuItem.nextSibling;
				}
				
				var adminMenuItemName = LumisPortalUtil.getElementText(LumisPortalUtil.selectSingleNode("@name", curAdminMenuItem));
				var adminMenuItemLink = LumisPortalUtil.getElementText(curAdminMenuItem);
			
				strTemp += g_LumisContextMenu.generateMenuItem(adminMenuItemName, adminMenuItemLink, LumisPortalAdmin.inEditMode);
				
				curAdminMenuItem = curAdminMenuItem.nextSibling;
			}
			
			if(count > 0)
				strTemp += g_LumisContextMenu.generateSeparator();
		}
		
		strTemp += g_LumisContextMenu.generateMenuItem("STR_REFRESH", "g_LumisContextMenu.processMenuAction(1);");
		
		if(LumisPortalAdmin.inEditMode)
			strTemp += g_LumisContextMenu.generateMenuItem("STR_DELETE", "g_LumisContextMenu.processMenuAction(2);");
			
		strTemp += g_LumisContextMenu.generateFooter();

		g_LumisContextMenu.show(element, strTemp, xPos, yPos);

		if(m_pHighlight) m_pHighlight.show();

		if(oldSelectedInterface != null)
			oldSelectedInterface.lumScriptHandler.highlight.hide();

		event.returnValue = false;
		event.cancelBubble = true;
		return false;
	}
	
	function getMenu()
	{
		// TODO: pass user session id
		var strMethod = "<method name=\"getServiceInterfaceInstanceMenu\">";
		strMethod += "<serviceInterfaceInstId>"+element.getAttribute("lumInterfaceInstId")+"</serviceInterfaceInstId>";
		strMethod += "</method>";
		var xmlResults = LumisPortalUtil.makeHttpRequest(g_LumisRootPath+"lumis/portal/controller/xml/ServiceInterfaceInstanceControllerXml.jsp", strMethod, null, true);
		return xmlResults;
	}

	function onHideContextMenu()
	{
		m_$Element.css("border", "");
	}

	function updateTemplateStructureDisplayMode()
	{
		if(g_LumisPageConfig.hasParentTemplate)
		{
			if(LumisPortalAdmin.inStructureLayoutMode() || LumisPortalAdmin.inGridLayoutMode())
			{
				if(element.getAttribute("isFromTemplate"))
				{
					if(!element.getAttribute("isInterfaceHolder") && LumisPortalAdmin.inEditMode)
						m_$Element.fadeTo(0,0.5);
				}
				else
				{
					m_$Element.css("background-color", "#FFFF80");
				}
			}
			else
			{
				m_$Element.css("background-color", "");
				m_$Element.fadeTo(0,1);
			}
			
			if(LumisPortalAdmin.inGridLayoutMode())
			{
				// hide holder content
				if(element.getAttribute("isInterfaceHolder") && !g_LumisPageConfig.isTemplate)
				{
					$(m_$ContentDiv).hide();
				}
			}
		}
	}

	function onPageChanged()
	{
		if(LumisPortalAdmin.inEditMode)
		{
			if((g_LumisPageConfig.isTemplate || !m_$Element.attr("isFromTemplate")))
			{
				m_$Element.attr("lumIsDraggable", "true");
				if(m_pHighlight) m_pHighlight.enableDrag();
			}

			if(g_LumisPageConfig.isTemplate || m_$Element.attr("isInterfaceHolder") || !g_LumisPageConfig.hasParentTemplate || !m_$Element.attr("isFromTemplate"))
			{
				m_$Element.attr("lumAllowDrop", "1");
				if(m_pHighlight) m_pHighlight.enableDrop();
			}
		}
		else
		{
			m_$Element.removeAttr("lumIsDraggable");
			m_$Element.removeAttr("lumAllowDrop");
			if(m_pHighlight) m_pHighlight.disableDrag();
			if(m_pHighlight) m_pHighlight.disableDrop();
		}

		m_$ContentDiv.css("height", null);
		m_$ContentDiv.css("width", null);

		if(LumisPortalAdmin.inGridLayoutMode())
		{
			if(m_pHighlight) m_pHighlight.hide();

			if(m_$ContentDiv.outerHeight()<25)
				m_$ContentDiv.css("height", 25);

			if(m_$ContentDiv.outerWidth()<50)
			{
				m_$ContentDiv.css("width", 50);
				m_$Spacer.show();				
			}
			else
			{
				m_$Spacer.remove();				
			}

			if(!g_LumisLayoutFile)
				m_$Element.css("borderTop", LumisGridBorder);
		}
		else if(LumisPortalAdmin.inStructureLayoutMode())
		{
			if(m_pHighlight) m_pHighlight.show();

			if(m_$ContentDiv.outerHeight()<25)
			{
				m_$ContentDiv.css("height", 25);
			}

			if(m_$ContentDiv.outerWidth()<50)
			{
				m_$ContentDiv.css("width", 50);
				m_$Spacer.show();				
			}
			else
			{
				m_$Spacer.remove();				
			}
			
			if(!g_LumisLayoutFile)
				m_$Element.css("borderTop", LumisGridBorder);
		}
		else
		{
			if(m_pHighlight) m_pHighlight.hide();
			m_$Spacer.remove();

			if(!g_LumisLayoutFile)
				m_$Element.css("borderTop", "");
		}

		if(m_pHighlight)
		{
			m_pHighlight.update();
			setInterval(m_pHighlight.update,2000);
		}
	}
}

function LumisServiceInterfaceHighlight(pElement, m_$ContentDiv, errorMessage)
{
	var m_$Highlight;
	var m_$HighlightTitle;
	var m_$HighlightContent;
	var m_$Element = $(pElement);
	var m_$Name;
	var m_$Remove;
	var m_$Cache;
	var m_$D0 = $("#LumisAdminWorkPaneBodyD0");
	var m_$WorkPaneBody = $("#LumisAdminWorkPaneBody");

	if(!m_$Element.parents("[lumRemainingHolder]").length==0)
	{
		m_$D0 = $("#LumisAdminWorkPaneFooterD0");
		m_$WorkPaneBody = $("#LumisAdminWorkPaneFooter");
	}

	this.init = init;
	this.show = show;
	this.hide = hide;
	this.remove = remove;
	this.update = update;
	this.enableDrag = enableDrag;
	this.disableDrag = disableDrag;
	this.enableDrop = enableDrop;
	this.disableDrop = disableDrop;
	this.html = html;
	this.setCacheKeyErrorMessage = setCacheKeyErrorMessage;

	init();

	function init()
	{
		if(m_$Highlight==null)
		{
			m_$Highlight = $("<div></div>");
			m_$Highlight.css("zIndex", "10002");
			m_$Highlight.addClass("cLumAdminInterfaceHighlight");
			m_$WorkPaneBody.prepend(m_$Highlight);

			m_$HighlightTitle = $("<div></div>");
			m_$HighlightTitle.addClass("lum-admin-interface-highlight-title");
			m_$HighlightTitle.bind("contextmenu", pElement.oncontextmenu);
			m_$Highlight.append(m_$HighlightTitle);
			
			m_$HighlightContent = $("<div></div>");
			m_$HighlightContent.addClass("lum-admin-interface-highlight-content");
			m_$HighlightContent.bind("contextmenu", pElement.oncontextmenu);
			m_$Highlight.append(m_$HighlightContent);

			m_$Name = $("<span lumIsDraggable=\"false\"></span>");
			m_$HighlightTitle.html(m_$Name);

			m_$Cache = $("<b title=\"Cache\"> [C] </b>");
			changeVisibility(m_$Cache, false);
			m_$HighlightTitle.append(m_$Cache);

			if(m_$Element.attr("isFromTemplate") == "1")
			{
				m_$HighlightTitle.addClass("lum-admin-interface-from-template");

				if("lumis.service.portalmanagement.serviceinterfaceinstance.interfaceHolder" == pElement.getAttribute("lumInterfaceId"))
					m_$HighlightTitle.addClass("lum-admin-interface-holder");
					
				m_$HighlightTitle.append( "<b title=\"Template\"> [T] </b>" );
			}

			if(m_$Element.attr("isFromTemplate") != "1")
			{
				if(g_LumisPageConfig.hasParentTemplate)
					m_$HighlightContent.addClass("lum-admin-interface-in-holder");
				
				m_$HighlightTitle.find("span").click(pElement.oncontextmenu);
				m_$HighlightTitle.find("span").hover(
						function () { $(this).css("cursor", "pointer") },
						function () { $(this).css("cursor", "") }						
					);

				m_$Remove = $("<img lumIsDraggable=\"false\" src=\""+g_LumisRootPath+"lumis/portalstudio/client/images/interface-delete.png\" class=\"lum-admin-interface-delete-button\" />");
				m_$Remove.click(pElement.onDelete );

				m_$HighlightTitle.prepend(m_$Remove);
			}
		}

		update();
		setInterval(update,2000);
	}

	function update()
	{
		if(m_$Highlight!=null)
		{
			m_$HighlightTitle.css("width", m_$ContentDiv.outerWidth());

			m_$Highlight.css("top", m_$ContentDiv.offset().top -  m_$D0.offset().top);
			m_$Highlight.css("left", m_$ContentDiv.offset().left - m_$D0.offset().left);

			m_$HighlightContent.css("width", m_$ContentDiv.outerWidth());
			m_$HighlightContent.css("height", m_$ContentDiv.outerHeight());

			if(m_$Element.attr("lumHolderId") && !LumisPortal.getCookie("lumSafeRenderMode") && m_$Element.attr("lumHolderId")!='WITHOUT_HOLDER_ID')
			{
				m_$Name.html(m_$Element.attr("lumInterfaceName")+" ("+m_$Element.attr("lumHolderId")+")");
				m_$Highlight.attr("title", m_$Element.attr("lumInterfaceName")+" (Holder: "+m_$Element.attr("lumHolderId")+")");
				m_$HighlightContent.attr("title", m_$Element.attr("lumInterfaceName")+" (Holder: "+m_$Element.attr("lumHolderId")+")");
			}
			else
			{
				if(m_$HighlightTitle.attr("cacheKeyErrorMessage"))
				{ 
					if(m_$HighlightTitle.attr("cacheKeyErrorMessage").length > 15) 
					{
						m_$Name.html("<img lumIsDraggable=\"false\" src=\""+g_LumisRootPath+"lumis/portal/client/images/Problem.png\"/>" + m_$HighlightTitle.attr("cacheKeyErrorMessage").substring(0, 12) + "...");
					}
					else
					{
						m_$Name.html("<img lumIsDraggable=\"false\" src=\""+g_LumisRootPath+"lumis/portal/client/images/Problem.png\"/>" + m_$HighlightTitle.attr("cacheKeyErrorMessage"));
					}
					m_$HighlightTitle.css("background-color", "#FF9700");
					m_$HighlightTitle.attr("title", m_$HighlightTitle.attr("cacheKeyErrorMessage"));
				}
				else 
				{
					m_$Name.html(m_$Element.attr("lumInterfaceName"));
					m_$Highlight.attr("title", m_$Element.attr("lumInterfaceName"));
				}
			}

			if(m_$Element.attr("cacheEnabled") == "1")
				changeVisibility(m_$Cache, true);
			else
				changeVisibility(m_$Cache, false);

			if(m_$Remove)
			{
				if(!LumisPortalAdmin.inEditMode)
					m_$Remove.hide();
				else
					m_$Remove.show();
			}

			if(LumisPortalAdmin.inEditMode)
			{
				if(m_$Element.attr("isFromTemplate") != "1")
				{
					m_$HighlightTitle.css("cursor", "move");
					m_$HighlightContent.css("cursor", "move");
				}
			}
			else
			{
				m_$HighlightTitle.css("cursor", "");
				m_$HighlightContent.css("cursor", "");
			}
		}
	}

	function show()
	{
		if(m_$Highlight!=null)	
		{
			if(pElement == LumisSelectedInterface)
				m_$Highlight.addClass("lum-admin-interface-highlight-selected");

			m_$Highlight.show();
		}
	}

	function hide()
	{
		if(m_$Highlight!=null && pElement != LumisSelectedInterface)
			m_$Highlight.removeClass("lum-admin-interface-highlight-selected");

		if(m_$Highlight!=null && !LumisPortalAdmin.inStructureLayoutMode())	
		{
			if(pElement != LumisSelectedInterface)
				m_$Highlight.hide();
		}
	}

	function remove()
	{
		if(m_$Highlight!=null)
		{
			m_$Highlight.remove();
		}
	}
	
	function html()
	{
		if(m_$Highlight)
		{
			return m_$Highlight.html();
		}

		return "";
	}
	
	function enableDrag()
	{
		if(m_$Highlight)
		{
			m_$HighlightContent.attr("lumIsDraggable", "true");
			m_$HighlightContent.each( function () { this.lumGetDragElement = function () {return pElement;} });

			m_$HighlightTitle.attr("lumIsDraggable", "true");
			m_$HighlightTitle.each( function () { this.lumGetDragElement = function () {return pElement;} });
		}
	}

	function disableDrag()
	{
		if(m_$Highlight)
		{
			m_$HighlightTitle.attr("lumIsDraggable", "false");
			m_$HighlightContent.attr("lumIsDraggable", "false");
		}
	}	

	function enableDrop()
	{
		if(m_$Highlight)
		{
			m_$HighlightContent.attr("lumAllowDrop", "1");
			m_$HighlightContent.each( function () { this.lumGetTarget = function () {return pElement;} });

			m_$HighlightTitle.attr("lumAllowDrop", "1");
			m_$HighlightTitle.each( function () { this.lumGetTarget = function () {return pElement;} });
		}
	}

	function disableDrop()
	{
		if(m_$Highlight)
		{
			m_$HighlightTitle.attr("lumAllowDrop", "false");
			m_$HighlightContent.attr("lumAllowDrop", "false");
		}
	}
	
	function setCacheKeyErrorMessage(message) 
	{
		m_$HighlightTitle.attr("cacheKeyErrorMessage", message);
	}
	
	function changeVisibility(m_$JQElement, visible)
	{
		if(visible)
		{
			m_$JQElement.css("display", "inline");
		}
		else
		{
			m_$JQElement.css("display", "none");
		}
	}
}
})(jQuery)