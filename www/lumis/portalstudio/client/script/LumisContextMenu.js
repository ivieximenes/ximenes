// $Revision: 15409 $ $Date: 2013-05-31 01:17:43 -0300 (Fri, 31 May 2013) $
(function($){
	
window.g_LumisContextMenu = null;
window.g_LumisContextMenuCallback = null;
window.g_LumisMenuAction = new Array();

window.LumisContextMenu = function ()
{
	var contextMenuDiv = null;
	var $contextMenuDiv = null;
	var showingMenu = false;
	
	this.hide = hide;
	this.show = show;
	this.generateHeader = generateHeader;
	this.generateFooter = generateFooter;
	this.generateSeparator = generateSeparator;
	this.generateMenuItem = generateMenuItem;
	this.processMenuAction = processMenuAction;

	init();

	//------------------------------------------------------------------
			
	function init()
	{
		contextMenuDiv = document.createElement("DIV");
		contextMenuDiv.style.position = 'absolute';
		contextMenuDiv.style.display = "none";
		contextMenuDiv.style.zIndex = "100000";
		 
		//document.body.insertAdjacentElement('beforeEnd', contextMenuDiv);
		document.body.appendChild(contextMenuDiv);
		$contextMenuDiv = $(contextMenuDiv);
		$contextMenuDiv.addClass("cLumAdminReset");
	}

	//------------------------------------------------------------------
	
	function hide()
	{
		if(!showingMenu)
			return;
			
		contextMenuDiv.style.display = "none";
		
		if(g_LumisContextMenuCallback)
		{
			if(g_LumisContextMenuCallback.onHideContextMenu)
				g_LumisContextMenuCallback.onHideContextMenu();
			g_LumisContextMenuCallback = null;
		}

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
		
		showingMenu = false;
	}

	//-------------------------------------------------------------------

	function show(callbackElement, innerHTML, xPos, yPos)
	{
		if(showingMenu)
			hide();

		g_LumisContextMenuCallback = callbackElement;
		
		contextMenuDiv.innerHTML = innerHTML;
		
		contextMenuDiv.style.left = xPos+"px";
		contextMenuDiv.style.top = yPos+"px";
		contextMenuDiv.style.display = "";
		
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

		adjustContextMenuPos(xPos, yPos);
		showingMenu = true;
	}

	//-------------------------------------------------------------------

	function adjustContextMenuPos(xPos, yPos)
	{
		if(document.body.clientHeight < (yPos+contextMenuDiv.offsetHeight))
		{
			yPos = document.body.clientHeight - contextMenuDiv.offsetHeight;

			if(yPos <= 0)
				yPos = 1;

			$(contextMenuDiv).css("top", yPos);
		}

		if(document.body.clientWidth < (xPos+contextMenuDiv.offsetWidth))
		{
			xPos = document.body.clientWidth - contextMenuDiv.offsetWidth;

			if(xPos <= 0)
				xPos = 1;

			contextMenuDiv.style.left = xPos+"px";
		}
	}
	
	//---------------------------------------------------------------------
	
	function generateHeader(strTitle, strClassName)
	{
		var cutResults = LumisPortalAdmin.localize(strTitle);
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
			strClassName = "lum-admin-context-menu-title";
	
		return '<div class="lum-admin-context-menu" ><div  class="'+strClassName+'">'+LumisPortal.htmlEncode(cutResults)+'</div>';
	}

	//---------------------------------------------------------------------
	
	function generateFooter()
	{
		return '</div>';
	}

	//---------------------------------------------------------------------
	
	function generateMenuItem(strName, strOnClick, bDisabled)
	{
		var strMenuItem = "lum-admin-context-menu-item";

		if(bDisabled)
		{
			strMenuItem = "lum-admin-context-menu-item lum-admin-context-menu-item-disabled";
			strOnClick = "alert('"+LumisPortalAdmin.localize("STR_CANNOT_F12_WHEN_EDITING_PAGE")+"')";
		}

		return '<div class="'+strMenuItem+'" onclick="'+escapeString(strOnClick,'"', '\\"')+'">'+LumisPortalAdmin.localize(strName)+'</div>';
	}
	
	//---------------------------------------------------------------------

	function generateSeparator()
	{
		return '<div class="lum-admin-context-menu-separator"></div>';
	}

	//---------------------------------------------------------------------

	function processMenuAction(index)
	{
		var pTemp=g_LumisMenuAction[index];
		hide();
		pTemp();
	}
	
	//---------------------------------------------------------------------

	function escapeString(value, charToEscape, charEscaped)
	{
		var strPattern = new RegExp(charToEscape, "gi");
		return value.replace(strPattern, charEscaped);
	}
}
})(jQuery)