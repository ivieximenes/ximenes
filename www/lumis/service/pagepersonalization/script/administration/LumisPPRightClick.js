// $Revision: 16270 $ $Date: 2014-04-11 18:21:04 -0300 (Fri, 11 Apr 2014) $
(function()
{
window.LumisPPRightClick = 
{
	contextMenuDiv : null,
	showingMenu : false,
//	$contextMenuDiv : null,
	
	/**
	 * 
	 * @param {Object} element
	 */
	init : function(element)
	{
		LumisPPRightClick.contextMenuDiv = document.createElement("DIV");
		LumisPPRightClick.contextMenuDiv.style.position = 'absolute';
		LumisPPRightClick.contextMenuDiv.style.display = "none";
		LumisPPRightClick.contextMenuDiv.style.zIndex = "100000";
		document.body.appendChild(LumisPPRightClick.contextMenuDiv);
//		LumisPPRightClick.$contextMenuDiv = $(contextMenuDiv);
//		LumisPPRightClick.$contextMenuDiv.addClass("cLumAdminReset");
		
		
		window.LumisSelectedInterface = 
		{
			saveInterfaceXml : function()
			{
				var xmlHttp = LumisPortalUtil.getXmlHttpObject();
				var strRequest = "lumPrevParams="+LumisPortal.lumisEncodeURIComponent(document.forms["LumisPortalForm"].elements["lumPrevParams"].value);
				xmlHttp.open("POST", document.forms["LumisPortalRenderInterfaceForm"].action+"&lumRenderII="+LumisPPRightClick.element.getAttribute("lumInterfaceInstId")+"&lumSaveXml=1", false);
				xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				xmlHttp.send(strRequest);
			}
		};
		
/*		window.LumisPortal.onRefresh = function()
			{
				if(LumisPortal.isSubmitting)
					return;
		
				if("1"==LumisPortal.getCookie("lumMode"))
					document.forms["LumisPortalForm"].action = document.forms["LumisPortalForm"].elements["lumPageOriginalUrl"].value;
					
				document.forms["LumisPortalForm"].submit();
				this.isSubmitting = true;
			};
*/		
		
		
		
		
		
		LumisPPRightClick.element = element;
		element.oncontextmenu = LumisPPRightClick.onContextMenu;
	},
	
	/**
	 * Brought from LumisServiceInterface.js
	 * @param {Object} event
	 */
	onContextMenu : function(event)
	{
		if(!event)
			event = window.event;

//		alert("K");
		return LumisPPRightClick.onContextMenuInternal(event, event.clientX, event.clientY);
	},
	
	/**
	 * Brought from LumisServiceInterface.js
	 * @param {Object} event
	 * @param {Object} xPos
	 * @param {Object} yPos
	 */
	onContextMenuInternal : function(event, xPos, yPos)
	{
//		alert("X");
		var strTemp = LumisPPRightClick.generateHeader(LumisPPRightClick.element.getAttribute("lumServiceInstName"), "cLumContextMenuServiceTitle");
//		alert("M");
		strTemp += LumisPPRightClick.generateMenuItem("STR_PROPERTIES", "LumisPPRightClick.onProperties();");
		strTemp += LumisPPRightClick.generateMenuItem("STR_MANAGE_ACCESS", "LumisPPRightClick.onAccessControl();");

		strTemp += LumisPPRightClick.generateSeparator();
		
		var responseXml = LumisPPRightClick.getMenu();
		var adminMenuNode = LumisPortalUtil.selectSingleNode("response/menu", responseXml);
		if(adminMenuNode != null)
		{
//			var count = 0;
			var curAdminMenuItem = adminMenuNode.firstChild;
			while(curAdminMenuItem != null)
			{
//				count++;
				while(curAdminMenuItem.nodeName == "separator")
				{
					strTemp += LumisPPRightClick.generateSeparator();
					curAdminMenuItem = curAdminMenuItem.nextSibling;
				}
				
				var adminMenuItemName = LumisPortalUtil.getElementText(LumisPortalUtil.selectSingleNode("@name", curAdminMenuItem));
				var adminMenuItemLink = LumisPortalUtil.getElementText(curAdminMenuItem);
			
				strTemp += LumisPPRightClick.generateMenuItem(adminMenuItemName, adminMenuItemLink, false /*LumisPortalAdmin.inEditMode*/);
				
				curAdminMenuItem = curAdminMenuItem.nextSibling;
			}
			
//			if(count > 0)
//				strTemp += LumisPPRightClick.generateSeparator();
		}
		
//		strTemp += g_LumisContextMenu.generateMenuItem("STR_REFRESH", "g_LumisContextMenu.processMenuAction(1);");
		
//		if(LumisPortalAdmin.inEditMode)
//			strTemp += g_LumisContextMenu.generateMenuItem("STR_DELETE", "g_LumisContextMenu.processMenuAction(2);");
			
		strTemp += LumisPPRightClick.generateFooter();

		LumisPPRightClick.show(LumisPPRightClick.element, strTemp, xPos, yPos);

//		if(m_pHighlight) m_pHighlight.show();

//		if(oldSelectedInterface != null)
//			oldSelectedInterface.lumScriptHandler.highlight.hide();

		event.returnValue = false;
		event.cancelBubble = true;
//		alert("Y");
		return false;
	},
	
	
	onProperties : function()
	{
//		g_LumisServiceInterfaceRender = renderInterface;
		window.open(LumisPortal.mainName+'?'+LumisPortal.pageParameterPageIdName+'=LumisBlankPage&'+LumisPortal.pageParameterChannelIdName+'='+g_LumisChannelId+'&lumRTI=lumis.service.portalmanagement.serviceinterfaceinstance.properties&interfaceInstId='+LumisPPRightClick.element.getAttribute("lumInterfaceInstId"),'_blank', 'width=620,height=530,left=20');
	},
	
	onAccessControl : function()
	{
//		g_LumisServiceInterfaceRender = renderInterface;
		window.open(LumisPortal.mainName+'?'+LumisPortal.pageParameterPageIdName+'=LumisBlankPage&'+LumisPortal.pageParameterChannelIdName+'='+g_LumisChannelId+'&lumRTI=lumis.service.portalmanagement.serviceinstanceacl.administration&serviceInstanceId='+LumisPPRightClick.element.getAttribute("lumServiceInstId"),'_blank', 'width=500,height=595,left=20');
	},
	
	getMenu : function()
	{
		// TODO: pass user session id
		var strMethod = "<method name=\"getServiceInterfaceInstanceMenu\">";
		strMethod += "<serviceInterfaceInstId>"+LumisPPRightClick.element.getAttribute("lumInterfaceInstId")+"</serviceInterfaceInstId>";
		strMethod += "</method>";
		var xmlResults = LumisPortalUtil.makeHttpRequest(g_LumisRootPath + "lumis/portal/controller/xml/ServiceInterfaceInstanceControllerXml.jsp", strMethod, null, true);
		return xmlResults;
	},
	
	/**
	 * Brought from LumisContextMenu.js
	 * @param {Object} strTitle
	 * @param {Object} strClassName
	 */
	generateHeader : function(strTitle, strClassName)
	{
		var cutResults = strTitle;
		if(cutResults.length > 20)
		{
			cutResults = cutResults.substr(0, 20);
			var punctuations = /[\s.,?!;:\"]/gm;
			for (var i = cutResults.length; i >= 0; i--) ;
				if (cutResults.substr(i, 1).search(punctuations) != -1)
					cutResults=cutResults.substr(0, i);
			   cutResults=cutResults+"...";
		}
						
		if(!strClassName)
			strClassName = "cLumContextMenuTitle";
	
		return '<div class="cLumContexMenu" ><div  class="'+strClassName+'">'+LumisPortal.htmlEncode(LumisPPRightClick.localize(cutResults))+'</div>';
	},
	
	/**
	 * Brought from LumisAdmin.js
	 * @param {Object} stringId
	 * @param {Object} params
	 */
	localize : function(stringId, params)
	{
		if (params == null)
		{
			// construct params by spliting stringId by ;
			var arrStringIds = stringId.split(";");
			params = new Array();
			for (var i=1; i<arrStringIds.length; i++)
				params[i-1] = arrStringIds[i];
			stringId = arrStringIds[0];
		}

		if (window.lum_stringTable != undefined && window.lum_stringTable != null) 
		{
			var localizedString = window.lum_stringTable[stringId];
			if (localizedString == null) 
				return stringId;
			
			for (var i = 0; i < params.length; i++) 
			{
				var localizedTerm = window.lum_stringTable[params[i]];
				if (localizedTerm == null) 
					localizedTerm = params[i];
				localizedString = localizedString.replace(new RegExp("%" + (i + 1), "gm"), localizedTerm);
			}
			return localizedString;
		}	
		else
		{
			return stringId;
		}
	},

	/**
	 * Brought from LumisContextMenu.js
	 * @param {Object} strName
	 * @param {Object} strOnClick
	 * @param {Object} bDisabled
	 */
	generateMenuItem : function(strName, strOnClick, bDisabled)
	{
		var strMenuItem = "cLumContextMenuItem";
		var strMenuItemOver = "cLumContextMenuItemMouseOver";

		if(bDisabled)
		{
			strMenuItem = "cLumContextMenuItemDisabled";
			strMenuItemOver = "cLumContextMenuItemDisabledMouseOver";
			strOnClick = "alert('"+LumisPPRightClick.localize("STR_CANNOT_F12_WHEN_EDITING_PAGE")+"')";
		}

		return '<div class="'+strMenuItem+'" onMouseOver="this.className=\''+strMenuItemOver+'\';" onMouseOut="this.className=\''+strMenuItem+'\';" onclick="LumisPPRightClick.hide();'+LumisPPRightClick.escapeString(strOnClick,'"', '\\"')+'">'+LumisPPRightClick.localize(strName)+'</div>';
	},
	
	/**
	 * Brought from LumisContextMenu.js
	 * @param {Object} value
	 * @param {Object} charToEscape
	 * @param {Object} charEscaped
	 */
	escapeString : function(value, charToEscape, charEscaped)
	{
		var strPattern = new RegExp(charToEscape, "gi");
		return value.replace(strPattern, charEscaped);
	},
	
	hide : function()
	{
		if(!LumisPPRightClick.showingMenu)
			return;
			
		LumisPPRightClick.contextMenuDiv.style.display = "none";
	/*	
		if(g_LumisContextMenuCallback)
		{
			if(g_LumisContextMenuCallback.onHideContextMenu)
				g_LumisContextMenuCallback.onHideContextMenu();
			g_LumisContextMenuCallback = null;
		}
*/
		var arrForms = document.forms;
		for(var i=0; i<arrForms.length; i++)
		{
			var arrElements = arrForms[i].elements;
			for(var j=0; j<arrElements.length; j++)
			{
				if(arrElements[j].tagName.toUpperCase() == "SELECT")
					arrElements[j].style.visibility="";
			}
		}
		
		LumisPPRightClick.showingMenu = false;
	},
	
	generateSeparator : function()
	{
		return '<div class="cLumContextMenuSeparator"><img src="'+g_LumisRootPath + 'lumis/portal/client/images/Pix.gif" alt=" " title=""/></div>';
	},
	
	generateFooter : function()
	{
		return '</div>';
	},
	
	show : function(callbackElement, innerHTML, xPos, yPos)
	{
		if(LumisPPRightClick.showingMenu)
			LumisPPRightClick.hide();

//		g_LumisContextMenuCallback = callbackElement;
		
		LumisPPRightClick.contextMenuDiv.innerHTML = innerHTML;
		
		LumisPPRightClick.contextMenuDiv.style.left = xPos+"px";
		LumisPPRightClick.contextMenuDiv.style.top = yPos+"px";
		LumisPPRightClick.contextMenuDiv.style.display = "";
		
		var arrForms = document.forms;
		for(var i=0; i<arrForms.length; i++)
		{
			var arrElements = arrForms[i].elements;
			for(var j=0; j<arrElements.length; j++)
			{
				if(arrElements[j].tagName.toUpperCase() == "SELECT")
					arrElements[j].style.visibility="hidden";
			}
		}

		LumisPPRightClick.adjustContextMenuPos(xPos, yPos);
		LumisPPRightClick.showingMenu = true;
	},
	
	adjustContextMenuPos : function(xPos, yPos)
	{
		if(document.body.clientHeight < (yPos+LumisPPRightClick.contextMenuDiv.offsetHeight))
		{
			yPos = document.body.clientHeight - LumisPPRightClick.contextMenuDiv.offsetHeight;

			if(yPos <= 0)
				yPos = 1;

			//$(contextMenuDiv).css("top", yPos);
		}

		if(document.body.clientWidth < (xPos+LumisPPRightClick.contextMenuDiv.offsetWidth))
		{
			xPos = document.body.clientWidth - LumisPPRightClick.contextMenuDiv.offsetWidth;

			if(xPos <= 0)
				xPos = 1;

			LumisPPRightClick.contextMenuDiv.style.left = xPos+"px";
		}
	}
};
})();
