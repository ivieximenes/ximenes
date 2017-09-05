// $Revision: 16923 $ $Date: 2015-02-11 10:49:44 -0200 (Wed, 11 Feb 2015) $
(function($)
{
window.g_LumisPage = null;
window.LumisGridBorder="1px dashed #AAAAAA";
window.LumisSelectedInterface = null;
window.LumisPage = function LumisPage()
{
	var element = document.getElementById("LumisAdminWorkPaneBody");

	this.onEditPage = onEditPage;
	this.onSavePage = onSavePage;
	this.onShowLayoutStructureChanged = onShowLayoutStructureChanged;
	this.onEditModeChanged = onEditModeChanged;
	this.interfaceDropped = interfaceDropped;
	this.onColSizeChange = onColSizeChange;
	this.onDeleteColumn = onDeleteColumn;
	this.onAddArea = onAddArea;
	this.onDeleteArea = onDeleteArea;
	this.refreshInterface = refreshInterface;
	this.getElement = getElement;
	this.callLayoutElementProperties = callLayoutElementProperties;
	this.callLayoutElementPropertiesReadOnly = callLayoutElementPropertiesReadOnly;
	this.onHolderRefresh = onHolderRefresh;
	this.onPageChanged = onPageChanged;
	this.interfaceWithCacheKeyError = interfaceWithCacheKeyError;
	this.removeHighlight = removeHighlight;

	var m_pPageHolders = $("[lumHolder]");
	var m_pInterfaces = $("[name='LumisInterface']");
	var m_pColumnSizers = $("[name='LumisColumnSizer']");
	var m_pAreaAdmins = $("[name='LumisAreaAdmin']");
	var m_xmlDOM = null;
	if(document.implementation.createDocument)
		m_xmlDOM = document.implementation.createDocument('', '', null);
	else 
		m_xmlDOM = new ActiveXObject("Microsoft.XMLDOM");
	var m_ColumnInputIndex = 100000;

	$(document).mousemove(mousemove);	

	$("<div id=\"LumisAdminWorkPaneBodyD0\"></div>").appendTo('#LumisAdminWorkPaneBody');
	this.PageDropHighlight = new PageDropHighlight();

	for(var i=0; i<m_pPageHolders.length; i++)
		m_pPageHolders[i].lumScriptHandler = new LumisPageHolder(m_pPageHolders[i]);

	for(var i=0; i<m_pInterfaces.length; i++)
		m_pInterfaces[i].lumScriptHandler = new LumisServiceInterface(m_pInterfaces[i]);

	onEditModeChanged();
	onShowLayoutStructureChanged();

	function interfaceWithCacheKeyError(interfaceInstanceId, errorMessage) 
	{
		for(var i=0; i<m_pInterfaces.length; i++)
		{
			if(m_pInterfaces[i].getAttribute("lumInterfaceInstId") == interfaceInstanceId)
			{
				m_pInterfaces[i].lumScriptHandler.highlight.setCacheKeyErrorMessage(errorMessage);
				m_pInterfaces[i].lumScriptHandler.highlight.update();
				return;
			}
		}
	}
	
	function lumDragEnter(event, dragData, pElement)
	{
		g_LumisPage.PageDropHighlight.show(pElement, 1);
	}
	
	function lumDragOver(event, dragData, pElement)
	{
		g_LumisPage.PageDropHighlight.show(pElement, 1);
	}

	function lumDragLeave(event)
	{
		g_LumisPage.PageDropHighlight.hide();
	}

	function lumDrop(event, dragData, pSrc, pElement)
	{
		g_LumisPage.PageDropHighlight.hide();
		return interfaceDropped(dragData, pSrc, 1, null, getColumnDropArea(pElement));
	}

	function getColumnDropArea(pElement)
	{
		return $(pElement).find("[name='LumisRow']").last().parent()[0];
	}
	
	function onEditModeChanged()
	{
		var m_pColumnSizersInput = $("[name='LumisColumnSizerInput']");
		for(var i=0; i < m_pColumnSizersInput.length; i++)
		{
			if(!LumisPortalAdmin.inEditMode)
			{
				m_pColumnSizersInput[i].disabled=true;
			}
			else
			{
				m_pColumnSizersInput[i].disabled=false;
			}
		}

		for(var i=0; i < m_pColumnSizers.length; i++)
		{
			$(m_pColumnSizers[i]).toggleClass("cLumColumnSizerDisabled", !LumisPortalAdmin.inEditMode);
			$(m_pColumnSizers[i]).toggleClass("cLumColumnSizer", LumisPortalAdmin.inEditMode);
		}	

		var m_pDeleteColumn = document.getElementsByName("lumDeleteColumnButton");
		for(var i=0; i < m_pDeleteColumn.length; i++)
		{
			if(!LumisPortalAdmin.inEditMode)
				m_pDeleteColumn[i].style.display="none";
			else
				m_pDeleteColumn[i].style.display="block";
		}
		
		for(var i=0; i<m_pInterfaces.length; i++)
			m_pInterfaces[i].lumScriptHandler.onPageChanged();

		for(var i=0; i<m_pPageHolders.length; i++)
			m_pPageHolders[i].lumScriptHandler.onPageChanged();
	}

	function onShowLayoutStructureChanged()
	{
		var structureLayoutMode = LumisPortalAdmin.inEditMode?LumisPortalAdmin.inEditStructureLayoutMode:LumisPortalAdmin.inNonEditStructureLayoutMode;
		var gridLayoutMode = LumisPortalAdmin.inEditMode?LumisPortalAdmin.inEditGridLayoutMode:LumisPortalAdmin.inNonEditGridLayoutMode;

		for(var i=0; i < m_pColumnSizers.length; i++)
		{
			if(structureLayoutMode)
			{
				m_pColumnSizers[i].style.display = "";
			}
			else
			{
				m_pColumnSizers[i].style.display = "none";
			}

			if(structureLayoutMode || gridLayoutMode)
			{
				m_pColumnSizers[i].parentNode.style.borderBottom = LumisGridBorder;
				m_pColumnSizers[i].parentNode.style.borderRight = LumisGridBorder;
			}
			else
			{
				m_pColumnSizers[i].parentNode.style.borderBottom = "";
				m_pColumnSizers[i].parentNode.style.borderRight = "";
			}
		}
		for(var i=0; i < m_pAreaAdmins.length; i++)
		{	
			if(structureLayoutMode)
				m_pAreaAdmins[i].style.display = "";
			else
				m_pAreaAdmins[i].style.display = "none";
		}

		for(var i=0; i<m_pInterfaces.length; i++)
			m_pInterfaces[i].lumScriptHandler.onPageChanged();

		for(var i=0; i<m_pPageHolders.length; i++)
			m_pPageHolders[i].lumScriptHandler.onPageChanged();	
	}
	
	function onEditPage()
	{
		if(g_LumisPageConfig.isTemplate || !g_LumisPageConfig.hasParentTemplate)
		{
			$("[name='LumisColumn']").each(function () 
			{
				this.setAttribute("lumAllowDrop","1");
				this.lumDragEnter = lumDragEnter;
				this.lumDragOver = lumDragOver;
				this.lumDragLeave = lumDragLeave;
				this.lumDrop = lumDrop;
			})
		}

		this.onShowLayoutStructureChanged();
		this.onEditModeChanged();
	}

	function onSavePage()
	{
		if(g_LumisLayoutFile)
			savePageHoldersLayout();
		else
			savePageAreasLayout();
	}
	
	function savePageAreasLayout()
	{
		// send the updated layout to the pagecontrollerxml
		var layout = "<layout>";
		
		$("[name='LumisArea']").each( function() 
		{
			var pArea = this;

			layout += "<area";
			if(pArea.className && pArea.className != '')
				layout += " className=\""+LumisPortal.htmlEncode(pArea.className)+"\"";
			layout += ">";
			layout += getAreaLayout(pArea);
			layout += "</area>";
		});
	
		layout += "</layout>";
		
		var strMethod = "<method name=\"updatePageLayout\">";
		strMethod += "<id>"+g_LumisPageId+"</id>";
		strMethod += "<layout>"+LumisPortal.htmlEncode(layout)+"</layout>";
		strMethod += "</method>";
		
		LumisPortalUtil.makeHttpRequest(g_LumisRootPath + "lumis/portal/controller/xml/PageControllerXml.jsp", strMethod, null, true);
		onShowLayoutStructureChanged();
		onEditModeChanged();
		
		LumisPortal.onRefresh();
	}
	
	function getAreaLayout(pArea)
	{
		var layout = "";
		var pColumns = LumisPortalUtil.getElementChildrenWithName(pArea,"LumisColumn");
		if(pColumns && !pColumns.length)
		{
			layout += "<column";
			var strColumnWidth = LumisPortalUtil.getElementChildrenWithName(pColumns, "LumisColumnSizerInput")[0].value;
			if(strColumnWidth.length)
				layout += " width=\""+strColumnWidth+"\"";
			if(pColumns.className && pColumns.className != '')
				layout += " className='"+pColumns.className+"'";
			layout += ">";
			layout += getColumnLayout(pColumns);
			layout += "</column>";
		}
		else if(pColumns)
		{
			for(var i=0; i<pColumns.length; i++)
			{
				layout += "<column";
				var strColumnWidth = LumisPortalUtil.getElementChildrenWithName(pColumns[i],"LumisColumnSizerInput")[0].value;
				if(strColumnWidth.length)
					layout += " width=\""+strColumnWidth+"\"";
				if(pColumns[i].className && pColumns[i].className != '')
					layout += " className='"+pColumns[i].className+"'";
				layout += ">";
				layout += getColumnLayout(pColumns[i]);
				layout += "</column>";
			}
		}
		
		return layout;
	}

	function getColumnLayout(pColumn)
	{
		var layout = "";
		var pRows = LumisPortalUtil.getElementChildrenWithName(pColumn,"LumisRow");
		
		if(pRows && !pRows.length)
		{
			layout += "<row>";
			layout += getRowLayout(pRows);
			layout += "</row>";
		}
		else if(pRows)
		{
			for(var i=0; i<pRows.length; i++)
			{
				layout += "<row>";
				layout += getRowLayout(pRows[i]);
				layout += "</row>";
			}
		}			
		return layout;
	}

	function getRowLayout(pRow)
	{
		var layout = "";
		var pCells = LumisPortalUtil.getElementChildrenWithName(pRow,"LumisInterface");
		if(pCells && !pCells.length)
		{
			layout += "<cell>";
			layout += pCells.getAttribute("luminterfaceinstid");
			layout += "</cell>";
		}
		else if(pCells)
		{
			for(var i=0; i<pCells.length; i++)
			{
				layout += "<cell>";
				layout +=  pCells[i].getAttribute("luminterfaceinstid");
				layout += "</cell>";
			}
		}			
		return layout;
	}

	function interfaceDropped(dragData, pSrc, iPosition, destInterface, destColumn)
	{
		if(g_LumisLayoutFile)
			return interfaceDroppedLayoutFile(dragData, pSrc, iPosition, destInterface, destColumn);                 
		else
			return interfaceDroppedGeneric(dragData, pSrc, iPosition, destInterface, destColumn);                 
	}
	
	//returns the given node. If the broser supports querySelector it will use it, else, it will use selectSingleNode.
	function findNode(node)
	{
 		if(m_xmlDOM.documentElement.querySelector)
			 value = m_xmlDOM.documentElement.querySelector(node);
		else
			 value = LumisPortalUtil.selectSingleNode(node.replace(">","/"), m_xmlDOM.documentElement);
 		return value;
	}

	function interfaceDroppedLayoutFile(dragData, pSrc, iPosition, destInterface, destColumn)
	{
		var srcII = pSrc.getAttribute("luminterfaceinstid");
		var destII = destInterface.getAttribute("luminterfaceinstid");
		var destHolderId;
		if(destInterface.getAttribute("lumholder"))
			destHolderId = destInterface.getAttribute("lumholder");
		else
			destHolderId = destInterface.getAttribute("lumholderid");

		var srcHolderId = pSrc.getAttribute("lumholderid");

		if (srcII && srcII == destII)
			return;
		
		removeHighlight(srcHolderId);
		removeHighlight(destHolderId);
		
		if (srcII)
		{
			moveInterface(srcII, destII, destHolderId, iPosition);
		}
		else
		{
			addInterface(dragData, destII, destHolderId, iPosition);
		}
	}
	
	function removeHighlight(holderId)
	{
		for(var i=0; i<m_pPageHolders.length; i++)
		{
			if($(m_pPageHolders[i]).attr("lumHolderId") == holderId || $(m_pPageHolders[i]).attr("lumHolder") == holderId)
			{
				if(m_pPageHolders[i].lumScriptHandler.highlight)
					m_pPageHolders[i].lumScriptHandler.highlight.remove();
			}
		}
	}

	function interfaceDroppedGeneric(dragData, pSrc, iPosition, destInterface, destColumn)
	{
		var srcII = pSrc.getAttribute("luminterfaceinstid");
		var destII = destInterface?destInterface.getAttribute("luminterfaceinstid"):null;		
		if (srcII!=null && srcII == destII)
			return;

		var strServiceInterfaceInstanceId = "";
		var isInterfaceHolder = false;

 		if (document.implementation.createDocument)
 		{ 
		   // Mozilla, create a new DOMParser 
		   var parser = new DOMParser(); 
		   m_xmlDOM = parser.parseFromString(dragData, "text/xml");
		}
		else
		{
   			m_xmlDOM.loadXML(dragData);
		}
		
		var strType = LumisPortalUtil.getElementText(findNode("type"));
	
		if(strType == "lumServiceInterface")
		{
			var strMethod = "<method name=\"addServiceInterfaceInstance\">";
			strMethod += "<pageId>"+g_LumisPageId+"</pageId>";

			var sInstIdNode = findNode("data>sInstId");

			if(sInstIdNode != null)
			{
				strMethod += "<serviceInstanceId>"+LumisPortalUtil.getElementText(findNode("data>sInstId"))+"</serviceInstanceId>";
			}
		
			var strServiceInterfaceId = LumisPortalUtil.getElementText(findNode("data>iId"));
			if(strServiceInterfaceId == "lumis.service.portalmanagement.serviceinterfaceinstance.interfaceHolder")
				isInterfaceHolder = true;

			strMethod += "<serviceInterfaceId>"+strServiceInterfaceId+"</serviceInterfaceId>";
			strMethod += "</method>";

			var interfaceIdXml = LumisPortalUtil.makeHttpRequest(g_LumisRootPath + "lumis/portal/controller/xml/ServiceControllerXml.jsp", strMethod, null, true);
			strServiceInterfaceInstanceId = LumisPortalUtil.getElementText(LumisPortalUtil.selectSingleNode("response", interfaceIdXml));
			var err = LumisPortalUtil.selectSingleNode("response/PortalException", interfaceIdXml);
			if (err != null)
			{
				alert(LumisPortalUtil.getElementText(LumisPortalUtil.selectSingleNode("response", interfaceIdXml)));
				return;
			}
		}
		else if(strType == "lumServiceInterfaceInstance")
		{			
			strServiceInterfaceInstanceId = LumisPortalUtil.getElementText(node = findNode("data>iiId"));	
			if(findNode("data>isIH"))
				isInterfaceHolder = true;
		}	
		else if(LumisPortalUtil.getElementText(findNode("type")) == "interfaceHolder")
		{
			strServiceInterfaceInstanceId = "interfaceHolder";
			isInterfaceHolder = true;
		}
		
		var destInterfaceRow = null;
		var destInterfaceColumn = null;
		
		if(destInterface != null)
		{
			destInterfaceRow = destInterface.parentNode;
			destInterfaceColumn = destInterfaceRow.parentNode;
		}
		else if(destColumn)
		{
			destInterfaceColumn = destColumn;
		}
		else
		{
			destInterfaceColumn = LumisPortalUtil.getElementChildrenWithName(element,"LumisColumn")[0].firstChild.nextSibling.firstChild;
		}
		
		var destInterfaceTable = destInterfaceColumn.parentNode;
		var destInterfaceArea = destInterfaceTable.parentNode.parentNode.parentNode.parentNode;
		
		var pNewInterface = document.createElement("td");
		
		if(isInterfaceHolder)
		{
			pNewInterface.isInterfaceHolder = "1";
			pNewInterface.setAttribute("isInterfaceHolder", "1");
		}

		pNewInterface.vAlign="top";
		pNewInterface.lumInterfaceInstId = strServiceInterfaceInstanceId;
		pNewInterface.setAttribute("lumInterfaceInstId", strServiceInterfaceInstanceId);
		pNewInterface.setAttribute("id","LumisInterface");
		pNewInterface.setAttribute("name", "LumisInterface");
		pNewInterface.cacheEnabled = "0";
		pNewInterface.setAttribute("lumInterfaceName",LumisPortalUtil.getElementText(findNode("data>n")));
		pNewInterface.setAttribute("lumServiceInstName", LumisPortalUtil.getElementText(findNode("data>sInstName")));
		pNewInterface.className = "cLumisInterface";

		if(iPosition == 0)
		{
			var pNewRow = document.createElement("tr");
			pNewRow.setAttribute("id","LumisRow");
			pNewRow.setAttribute("name","LumisRow");
			pNewRow.setAttribute("class","cLumisRow");
			
			destInterfaceColumn.insertBefore(pNewRow, destInterfaceRow);

			pNewRow.appendChild(pNewInterface);
		}
		else if(iPosition == 1)
		{
			var pNewRow = document.createElement("tr");
			pNewRow.setAttribute("id","LumisRow");
			pNewRow.setAttribute("name","LumisRow");
			pNewRow.setAttribute("class","cLumisRow");
			
			if(destInterfaceRow != null && destInterfaceRow.nextSibling)
				destInterfaceColumn.insertBefore(pNewRow, destInterfaceRow.nextSibling);
			else
				destInterfaceColumn.appendChild(pNewRow);

			pNewRow.appendChild(pNewInterface);
		}
		else if(iPosition == 2 || iPosition == 3)
		{
			var pNewCell = document.createElement("td");
			var pNewCellColumn;
			
			if(iPosition == 2)
				pNewCellColumn = destInterfaceArea.firstChild.firstChild.insertBefore(pNewCell, destInterfaceTable.parentNode);
			else
				pNewCellColumn = destInterfaceArea.firstChild.firstChild.insertBefore(pNewCell, destInterfaceTable.parentNode.nextSibling);
			
			var areaLayoutId = destInterfaceArea.getAttribute("layoutid");
			var pAreaColumns = LumisPortalUtil.getElementChildrenWithName(destInterfaceArea,"LumisColumn");
			
			var columnLayoutId = areaLayoutId + "_";
			try
			{
				if(pAreaColumns && pAreaColumns.length)
				{
					var maxLayoutId = 0;
					for(var i=0;i<pAreaColumns.length;i++)
					{
						var currentAreaColumn = pAreaColumns[i];
						var curLayoutId = 0;
						var layoutIdValue = currentAreaColumn.getAttribute("layoutid");
						if(layoutIdValue)
							curLayoutId = parseInt(layoutIdValue.split("_")[1], 10);
						
						if(curLayoutId >= maxLayoutId)
							maxLayoutId = curLayoutId;
					}
					columnLayoutId += (maxLayoutId+1);
				}
				else
				{
					var curLayoutId = 0; 
					var layoutIdValue = pAreaColumns.getAttribute("layoutid");
					if(layoutIdValue)
						curLayoutId = parseInt(layoutIdValue.split("_")[1], 10);
					
					columnLayoutId += (curLayoutId+1);
				}
			}
			catch(err)
			{
				// Error while getting the layout id.
				alert("ERROR: "+err);
			}
			
			pNewCellColumn.setAttribute("id", "LumisColumn");
			pNewCellColumn.setAttribute("name", "LumisColumn");
			pNewCellColumn.setAttribute("layoutId", columnLayoutId); 
			pNewCellColumn.setAttribute("lumallowdrop", "1");
			pNewCellColumn.setAttribute("vAlign", "top");

			pNewCellColumn.lumDragEnter = lumDragEnter;
			pNewCellColumn.lumDragOver = lumDragOver;
			pNewCellColumn.lumDragLeave = lumDragLeave;
			pNewCellColumn.lumDrop = lumDrop;
			
			var columnPropertiesScript = 'var pLumisColumn=g_LumisPage.getElement(\\\'LumisColumn\\\', \\\''+columnLayoutId+'\\\');g_LumisContextMenu.hide();if(LumisPortalAdmin.inEditMode){g_LumisPage.callLayoutElementProperties(\\\'LumisColumn\\\', \\\''+columnLayoutId+'\\\', pLumisColumn.className, g_LumisChannelId);}else{this.callLayoutElementPropertiesReadOnly(pLumisColumn.className, g_LumisChannelId);}';
			
			var contextMenuScript = 'alert(\'1\'+document.getElementById(\'LumisArea\').getId());+g_LumisContextMenu.show(this, g_LumisContextMenu.generateHeader(\'STR_COLUMN_PROPERTIES\')+g_LumisContextMenu.generateMenuItem(\'STR_PROPERTIES\', \''+columnPropertiesScript+'\', false)+g_LumisContextMenu.generateFooter(), window.event.x, window.event.y);event.returnValue = false;event.cancelBubble = true; return false;';

			var columnSizerInputId = "LumisColumnSizerInput"+m_ColumnInputIndex;
			m_ColumnInputIndex = m_ColumnInputIndex+1;
			pNewCellColumn.innerHTML = '<div id="LumisColumnSizer" name="LumisColumnSizer" align="center" class="cLumColumnSizer cLumAdminReset" nowrap="1" oncontextmenu="'+contextMenuScript+'"><img src="'+g_LumisRootPath + 'lumis/portal/client/images/DeleteColumn.gif" onclick="g_LumisPage.onDeleteColumn(\''+columnSizerInputId+'\')" style="margin: 6px 2px !important; float: right;" /><img src="'+g_LumisRootPath + 'lumis/portal/client/images/LeftArrow.gif" align="absmiddle" onclick="g_LumisPage.onColSizeChange(-1, document.getElementById(\''+columnSizerInputId+'\'))" ondblclick="g_LumisPage.onColSizeChange(-9, document.getElementById(\''+columnSizerInputId+'\'))"/><input class="cLumColumnSizerInput" id="'+columnSizerInputId+'" name="LumisColumnSizerInput" type="text" size="5"  onchange="g_LumisPage.onColSizeChange(0, document.getElementById(\''+columnSizerInputId+'\'))" onblur="g_LumisPage.onColSizeChange(0, document.getElementById(\''+columnSizerInputId+'\'))" onkeypress="if(window.event && window.event.keyCode == 13)g_LumisPage.onColSizeChange(0, document.getElementById(\''+columnSizerInputId+'\'))"/><img src="'+g_LumisRootPath + 'lumis/portal/client/images/RightArrow.gif" align="absmiddle"  onclick="g_LumisPage.onColSizeChange(1, document.getElementById(\''+columnSizerInputId+'\'))" ondblclick="g_LumisPage.onColSizeChange(9, document.getElementById(\''+columnSizerInputId+'\'))"/>&#160;&#160;&#160;</div>'+
				'<table cellspacing="0" cellpadding="0" height="100%" width="100%"><tr id="LumisRow" name="LumisRow" class="cLumisRow"></tr></table><div class="cLumColumnDropLine" style="display:none"></div>';

			var pNewRow = pNewCellColumn.firstChild.nextSibling.firstChild.firstChild;
			pNewRow.appendChild(pNewInterface);

			m_pColumnSizers = $("[name='LumisColumnSizer']");
		}
		else if(iPosition == 4)
		{
			destInterfaceRow.insertBefore(pNewInterface, destInterface);
		}
		else if(iPosition == 5)
		{
			if(destInterface.nextSibling)
				destInterfaceRow.insertBefore(pNewInterface, destInterface.nextSibling);
			else
				destInterfaceRow.appendChild(pNewInterface);
		}
		
		pNewInterface.lumScriptHandler = new LumisServiceInterface(pNewInterface);
		pNewInterface.lumScriptHandler.renderInterface();

		m_pInterfaces = $("[name='LumisInterface']");

		onPageChanged();
		onShowLayoutStructureChanged();
	
		return true;
	}
	
	function onColSizeChange(byValue, columnSizerInput)
	{
 		if(!LumisPortalAdmin.inEditMode)
 			return;
 		
		var originalValue = columnSizerInput.value;
		var size = originalValue;
		var bIsPercent = false;

		if(size.length && size.substr(size.length-1, 1) == "%")
		{
			bIsPercent = true;
			size = size.substr(0, size.length-1);
		}
		
		if(!size.length)
			return;

		if(isNaN(size))
			return;
		
		size = parseInt(size, 10);
		
		size += byValue;
		
		if(size <= 0)
			return;
		
		if(bIsPercent && size > 100)
			return;
		
		if(bIsPercent)
			size=size+"%";
		
		columnSizerInput.value = size;
		
		if(bIsPercent)
			columnSizerInput.parentNode.style.width="100%";
		else
			columnSizerInput.parentNode.style.width=size;

		columnSizerInput.parentNode.parentNode.style.width=size;
		
		adjustAreaWidth(columnSizerInput.parentNode.parentNode.parentNode.parentNode.parentNode);
	}
	
	function onDeleteColumn(columnSizerInputId)
	{
		if(!LumisPortalAdmin.inEditMode)
			return;
		var columnSizerInput = document.getElementById(columnSizerInputId);
		var column = columnSizerInput.parentNode.parentNode;
		var area = 	column.parentNode.parentNode.parentNode;
		var numChildren = column.parentNode.childNodes.length;

		$(column).find("[name='LumisInterface']").each(function () { this.lumScriptHandler.highlight.remove(); });

		if(numChildren > 2)
			column.parentNode.removeChild(column);
		adjustAreaWidth(area);
		onPageChanged();
	}

	function adjustAreaWidth(areaElement)
	{
		var columnsHavePercentWidths = false;
		var inputElements = LumisPortalUtil.getElementChildrenWithName(areaElement,"LumisColumnSizerInput");
		
		if(inputElements && !inputElements.length)
		{
			var value = inputElements.value;
			if(value && value.length && value.search("%") != -1)
				columnsHavePercentWidths = true;
		}
		else if(inputElements && inputElements.length)
		{
			for(var i=0; i < inputElements.length; i++)
			{
				var value = inputElements[i].value;
				if(value && value.length && value.search("%") != -1)
				{
					columnsHavePercentWidths = true;
					break;
				}
			}
		}

		if(columnsHavePercentWidths)
			areaElement.style.width="100%";
		else
			areaElement.style.width = "";
		onPageChanged();
	}
	
	function onAddArea(position, areaId)
	{
		if(!LumisPortalAdmin.inEditMode)
			return;
		
		var pElements = $("[name='LumisArea']");
		
		var maxLayoutId = 0;
		for(var i=0;i<pElements.length;i++)
		{
			var curLayoutId = parseInt(pElements[i].getAttribute("layoutid"), 10);
			if(curLayoutId >= maxLayoutId)
				maxLayoutId = curLayoutId;
		}
		var newAreaLayoutId = maxLayoutId+1;
		
		var newArea = document.createElement("table");
		newArea.cellSpacing = 0;
		newArea.cellPadding = 0;
		newArea.style.width = "100%";
		newArea.setAttribute("name", "LumisArea");
		newArea.setAttribute("id", "LumisArea_"+newAreaLayoutId);
		newArea.setAttribute("layoutId", newAreaLayoutId);
		
		var srcArea = document.getElementById(areaId);//window.event.srcElement.parentNode.parentNode.parentNode.parentNode.parentNode;
		
		if(position == 0)
			srcArea.parentNode.insertBefore(newArea, srcArea);
		else if(srcArea.nextSibling)
			srcArea.parentNode.insertBefore(newArea, srcArea.nextSibling);
		else
			srcArea.parentNode.appendChild(newArea);
		
		var pTableBody = document.createElement("tbody");
		newArea.appendChild(pTableBody);
		var pRow = document.createElement("tr");
		pTableBody.appendChild(pRow);
		var pTD = document.createElement("td");
		pRow.appendChild(pTD);
		
		pTD.className = "cLumAreaAdmin";
		pTD.id = "LumisAreaAdmin";
		pTD.areaLayoutId = newAreaLayoutId;
		pTD.oncontextmenu = areaContextMenu;
		
		var areaButtons = "<div><img src=\""+g_LumisRootPath + "lumis/portal/client/images/AddAreaAbove.gif\" title=\"STR_ADD_AREA_ABOVE\" onclick=\"g_LumisPage.onAddArea(0, 'LumisArea_"+newAreaLayoutId+"');\" /></div>";
		areaButtons += "<div><img src=\""+g_LumisRootPath + "lumis/portal/client/images/DeleteArea.gif\" title=\"STR_DELETE_AREA\" onclick=\"g_LumisPage.onDeleteArea('LumisArea_"+newAreaLayoutId+"');\" /></div>";
		areaButtons += "<div><img src=\""+g_LumisRootPath + "lumis/portal/client/images/AddAreaBelow.gif\" title=\"STR_ADD_AREA_BELOW\" onclick=\"g_LumisPage.onAddArea(1, 'LumisArea_"+newAreaLayoutId+"');\" /></div>";
		
		pTD.innerHTML = areaButtons;
		
		var columnLayoutId = newAreaLayoutId + "_0";

		pTD = document.createElement("td");
		pRow.appendChild(pTD);
		pTD.setAttribute("name", "LumisColumn");
		pTD.id = "LumisColumn";
		pTD.layoutId = columnLayoutId;
		pTD.setAttribute("layoutId", columnLayoutId);
		pTD.vAlign="top";
		pTD.style.width = "100%";
		pTD.style.borderBottom = LumisGridBorder;
		pTD.style.borderRight = LumisGridBorder;
		pTD.setAttribute("lumAllowDrop", "1");
		
		pTD.lumDragEnter = lumDragEnter;
		pTD.lumDragOver = lumDragOver;
		pTD.lumDragLeave = lumDragLeave;
		pTD.lumDrop = lumDrop;

		var columnPropertiesScript = 'var pLumisColumn=g_LumisPage.getElement(\\\'LumisColumn\\\', \\\''+columnLayoutId+'\\\');g_LumisContextMenu.hide();if(LumisPortalAdmin.inEditMode){g_LumisPage.callLayoutElementProperties(\\\'LumisColumn\\\', \\\''+columnLayoutId+'\\\', pLumisColumn.className, g_LumisChannelId);}else{this.callLayoutElementPropertiesReadOnly(pLumisColumn.className, g_LumisChannelId);}';
		var contextMenuScript = 'g_LumisContextMenu.show(this, g_LumisContextMenu.generateHeader(\'STR_COLUMN_PROPERTIES\')+g_LumisContextMenu.generateMenuItem(\'STR_PROPERTIES\', \''+columnPropertiesScript+'\', false)+g_LumisContextMenu.generateFooter(), window.event.x, window.event.y);event.returnValue = false;event.cancelBubble = true; return false;';		
		
		var columnSizerInputId = "LumisColumnSizerInput"+m_ColumnInputIndex;
		m_ColumnInputIndex = m_ColumnInputIndex+1;
		
		pTD.innerHTML = "<div id=\"LumisColumnSizer\" align=center class=\"cLumColumnSizer cLumAdminReset\" style=\"width:100%\" nowrap=\"1\" oncontextmenu=\""+contextMenuScript+"\"><img src=\""+g_LumisRootPath + "lumis/portal/client/images/DeleteColumn.gif\" onclick=\"g_LumisPage.onDeleteColumn('"+columnSizerInputId+"')\" style=\"margin: 6px 2px !important; float: right;\"/><img src=\""+g_LumisRootPath + "lumis/portal/client/images/LeftArrow.gif\" align=\"absmiddle\" onclick=\"g_LumisPage.onColSizeChange(-1, document.getElementById('"+columnSizerInputId+"'))\" ondblclick=\"g_LumisPage.onColSizeChange(-9, document.getElementById('"+columnSizerInputId+"'))\"/><input name=\"LumisColumnSizerInput\" id=\""+columnSizerInputId+"\" type=\"text\" size=\"5\" onChange=\"g_LumisPage.onColSizeChange(0, document.getElementById('"+columnSizerInputId+"'))\" onblur=\"g_LumisPage.onColSizeChange(0, document.getElementById('"+columnSizerInputId+"'))\" onkeypress=\"if(window.event && window.event.keyCode == 13)g_LumisPage.onColSizeChange(0, document.getElementById('"+columnSizerInputId+"'))\" value=\"100%\"/><img src=\""+g_LumisRootPath + "lumis/portal/client/images/RightArrow.gif\" align=\"absmiddle\" onclick=\"g_LumisPage.onColSizeChange(1, document.getElementById('"+columnSizerInputId+"'))\" ondblclick=\"g_LumisPage.onColSizeChange(9, document.getElementById('"+columnSizerInputId+"'))\"/>&#160;&#160;&#160;</div><table cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\"><tbody><tr id=\"LumisRow\" name=\"LumisRow\" class=\"cLumisRow\" ><td></td></tr></tbody></table><div class=\"cLumColumnDropLine\" style=\"display:none\"></div>";

		m_pAreaAdmins = $("[name='LumisAreaAdmin']");
		onPageChanged();
	}
	
	function areaContextMenu()
	{
		var pArea = getElement('LumisArea', this.areaLayoutId);
		var areaClassName = pArea.className;
		
		var areaPropertiesScript = 'var pLumisArea=g_LumisPage.getElement(\'LumisArea\', \''+this.areaLayoutId+'\');g_LumisContextMenu.hide();if(LumisPortalAdmin.inEditMode){g_LumisPage.callLayoutElementProperties(\'LumisArea\', \''+this.areaLayoutId+'\', \''+areaClassName+'\', \''+g_LumisChannelId+'\');}else{g_LumisPage.callLayoutElementPropertiesReadOnly(\''+areaClassName+'\', \''+g_LumisChannelId+'\');}';
		
		g_LumisContextMenu.show(this, g_LumisContextMenu.generateHeader('STR_AREA_PROPERTIES')+g_LumisContextMenu.generateMenuItem('STR_PROPERTIES', areaPropertiesScript, false)+g_LumisContextMenu.generateFooter(), window.event.x, window.event.y);
		
		event.returnValue = false;
		event.cancelBubble = true;
		return false;
	}
	
	function onDeleteArea(areaId)
	{
		if(!LumisPortalAdmin.inEditMode)
			return;

		if ($('[name=LumisArea]').size() <= 1) 
		{
			alert(LumisPortalAdmin.localize("STR_MUST_EXIST_AT_LEAST_ONE_AREA"));
			return;
		}
		
		var srcArea = document.getElementById(areaId);//window.event.srcElement.parentNode.parentNode.parentNode.parentNode.parentNode;
		var numChildren = srcArea.parentNode.childNodes.length;
		
		$(srcArea).find("[name='LumisInterface']").each(function () { this.lumScriptHandler.highlight.remove(); });
		
		if(numChildren > 1)
			srcArea.parentNode.removeChild(srcArea);
		onPageChanged();
	}
	
	function refreshInterface(interfaceInstId)
	{
		for(var i=0; i < m_pInterfaces.length; i++)
		{
			if(m_pInterfaces[i].lumInterfaceInstId == interfaceInstId)
				m_pInterfaces[i].renderInterface();
		}
	}
	
	function getElement(elementName, layoutId)
	{
		var pElement = null;
		var pElements = document.getElementsByName(elementName);
		
		for(var i=0;i<pElements.length;i++)
		{
			if(pElements[i].getAttribute("layoutId") == layoutId)
			{
				pElement = pElements[i];
				break;
			}
		}
		if(pElements.length == 0)
			pElement = document.getElementById(elementName+'_'+layoutId);
		
		return pElement;
	}
	
	function callLayoutElementProperties(elementId, elementLayoutId, className, channelId)
	{
		LumisLightBox.open(LumisPortal.mainName+"?"+LumisPortal.pageParameterPageIdName+"=LumisBlankPage&"+LumisPortal.pageParameterChannelIdName+"="+channelId+"&lumRTI=lumis.service.portalmanagement.page.layoutElementProperties&elementId="+elementId+"&elementLayoutId="+elementLayoutId+"&className="+className+"&pageId="+g_LumisPageId, {'width':743,'height':180});
	}
	
	function callLayoutElementPropertiesReadOnly(className, channelId)
	{
		LumisLightBox.open(LumisPortal.mainName+"?"+LumisPortal.pageParameterPageIdName+"=LumisBlankPage&"+LumisPortal.pageParameterChannelIdName+"="+channelId+"&lumRTI=lumis.service.portalmanagement.page.layoutElementPropertiesRead&className="+className+"&pageId="+g_LumisPageId, {'width':743,'height':180});
	}
	
	function onHolderRefresh()
	{
		m_pInterfaces = $("[name='LumisInterface']");
		for(var i=0; i<m_pInterfaces.length; i++)
		{
			if (!m_pInterfaces[i].lumScriptHandler)
			{
				m_pInterfaces[i].lumScriptHandler = new LumisServiceInterface(m_pInterfaces[i]);
			}
		}

		m_pPageHolders = $("[lumHolder]");
		
		for(var i=0; i<m_pPageHolders.length; i++)
		{
			if (!m_pPageHolders[i].lumScriptHandler)
			{
				m_pPageHolders[i].lumScriptHandler = new LumisPageHolder(m_pPageHolders[i]);
			}
		}

		onPageChanged();
	}
	
	function onPageChanged()
	{
		for(var i=0; i<m_pInterfaces.length; i++)
			m_pInterfaces[i].lumScriptHandler.onPageChanged();

		for(var i=0; i<m_pPageHolders.length; i++)
			m_pPageHolders[i].lumScriptHandler.onPageChanged();
	}

	function mousemove(e)
	{
		if(LumisPortalAdmin.inGridLayoutMode())
		{
			if(LumisPortalUtil.elementContainsPoint(element, e.clientX, e.clientY))
			{
				for(var i=0; i<m_pPageHolders.length; i++)
				{
					if(m_pPageHolders[i] && m_pPageHolders[i].lumScriptHandler && m_pPageHolders[i].lumScriptHandler.highlight)
					{
						if(LumisPortalUtil.elementContainsPoint(m_pPageHolders[i], e.clientX, e.clientY))
							m_pPageHolders[i].lumScriptHandler.highlight.show();
						else
							m_pPageHolders[i].lumScriptHandler.highlight.hide();
					}
				}
		
				for(var i=0; i<m_pInterfaces.length; i++)
				{
					if(m_pInterfaces[i] && m_pInterfaces[i].lumScriptHandler && m_pInterfaces[i].lumScriptHandler.highlight)
					{
						if(LumisPortalUtil.elementContainsPoint(m_pInterfaces[i], e.clientX, e.clientY))
							m_pInterfaces[i].lumScriptHandler.highlight.show();
						else
							m_pInterfaces[i].lumScriptHandler.highlight.hide();
					}
				}
			}
		}
	}

	function PageDropHighlight()
	{
		var m_$Highlight;
		var m_$D0 = $("#LumisAdminWorkPaneBodyD0");
		var m_$WorkPaneBody = $("#LumisAdminWorkPaneBody");
		var $Element = null;

		this.init = init;
		this.show = show;
		this.hide = hide;
		this.element = element;
		init();
		
		function element()
		{
			return m_$Highlight[0];
		}

		function init()
		{
			m_$Highlight = $("<div></div>");
			m_$Highlight.addClass("lum-admin-drag-drop-highlight");
			m_$Highlight.hide();
			m_$WorkPaneBody.prepend(m_$Highlight);
		}

		function show(pElement, iPosition)
		{
			$Element = $(pElement);
			var iTop;
			var iLeft;
			var iWidth = 20;
			var iHeight = 20;
			var strBackground;

			if(iPosition == 0)
			{
				iTop = $Element.offset().top -  m_$D0.offset().top;
				iLeft = $Element.offset().left - m_$D0.offset().left;
				iWidth = $Element.outerWidth() - 10;
				m_$Highlight.attr("class", "lum-admin-drag-drop-highlight lum-admin-drop-interface-above");
				m_$Highlight.css("width", iWidth);
				m_$Highlight.css("top", iTop);
				m_$Highlight.css("left", iLeft);
				m_$Highlight.css("height", "50px");
			}
			else if(iPosition == 3 || iPosition == 5)
			{
				iTop = $Element.offset().top -  m_$D0.offset().top;
				iLeft = $Element.offset().left + $Element.outerWidth() - 20 - m_$D0.offset().left +4;
				iWidth = 50;
				iHeight = $Element.outerHeight() - 10;
				m_$Highlight.attr("class", "lum-admin-drag-drop-highlight lum-admin-drop-interface-right");

				m_$Highlight.css("width", iWidth);
				m_$Highlight.css("height", iHeight);
				m_$Highlight.css("top", iTop);
				m_$Highlight.css("left", iLeft);
			}
			else if(iPosition == 1)
			{
				iTop = $Element.offset().top + $Element.outerHeight() - 20 -  m_$D0.offset().top +4;
				iLeft = $Element.offset().left - m_$D0.offset().left;
				iWidth = $Element.outerWidth() - 10;
				m_$Highlight.attr("class", "lum-admin-drag-drop-highlight lum-admin-drop-interface-below");
				
				m_$Highlight.css("width", iWidth);
				m_$Highlight.css("top", iTop);
				m_$Highlight.css("left", iLeft);
				m_$Highlight.css("height", "50px");
			}
			else if(iPosition == 2 || iPosition == 4)
			{
				iTop = $Element.offset().top -  m_$D0.offset().top;
				iLeft = $Element.offset().left - m_$D0.offset().left -4;
				iWidth = 50;
				iHeight = $Element.outerHeight() - 10;
				m_$Highlight.attr("class", "lum-admin-drag-drop-highlight lum-admin-drop-interface-left");
				
				m_$Highlight.css("width", iWidth);
				m_$Highlight.css("height", iHeight);
				m_$Highlight.css("top", iTop);
				m_$Highlight.css("left", iLeft);
			}

			m_$Highlight.show();
		}

		function hide()
		{
			m_$Highlight.hide();
		}
	}
}
})(jQuery);