// $Revision: 16540 $ $Date: 2014-10-23 16:21:33 -0200 (Thu, 23 Oct 2014) $
var g_LumisSelectParentContentTree = null;


function LumisSelectParentContentTree(element)
{
	var g_LumisSourceId = null;
	var g_LumisInterfaceInstanceId = null;
	var g_LumisCurrentContentId = null;
	var g_LumisCallbackFuncion = "alert('No callback function for SelectParentContentTree control was defined!');";
	
	// TODO Tiago: create other class names and use them
	var g_LumisContentItemClassName = "cLumAdminTreeText cLumAdminTreeChannel";

	g_LumisSelectParentContentTree = this;
	
	this.init = init;

	var m_xmlHttp = LumisPortalUtil.getXmlHttpObject();
	
	function init(callBackFuncion, sourceId, interfaceInstanceId, currentContentId)
	{
		if (callBackFuncion != null && callBackFuncion != "")
			g_LumisCallbackFuncion = callBackFuncion+"('%CONTENTID%', '%CONTENTNAME%')";

		if (sourceId != null && sourceId != "")
			g_LumisSourceId = sourceId;

		if (interfaceInstanceId != null && interfaceInstanceId != "")
			g_LumisInterfaceInstanceId = interfaceInstanceId;

		if (currentContentId != null && currentContentId != "")
			g_LumisCurrentContentId = currentContentId;
			
		reloadData();
	}
	//-------------------------------------------------------------------

	function reloadData()
	{
		var strMethod = "<method name=\"getBasicData\">";
		strMethod += "<sourceId>"+g_LumisSourceId+"</sourceId>";
		strMethod += "<interfaceInstanceId>"+g_LumisInterfaceInstanceId+"</interfaceInstanceId>";
		strMethod += "<currentContentId>"+g_LumisCurrentContentId+"</currentContentId>";
		strMethod += "</method>";
		
		LumisPortalUtil.makeHttpRequest(g_LumisRootPath + "lumis/content/controller/xml/ContentTreeControllerXml.jsp", strMethod, onContentsLoaded, true, m_xmlHttp);
	}
	
	//-------------------------------------------------------------------

	function onContentsLoaded()
	{
		var state = m_xmlHttp.readyState;
		if(state == 4)
  		{
  			renderTree();
		}
	}
	
	//-------------------------------------------------------------------

	function renderTree(parentDiv, parentId, iDepth)
	{
		if(parentId == null)
			parentId = "";
		
		if(iDepth == null)
			iDepth = 0;
			
		xmlDom = m_xmlHttp.responseXML;
		var contents = LumisPortalUtil.selectNodes ("response/contentTreeData/cnt[pId='"+parentId+"']", xmlDom);
		
		for (var i = 0; i < contents.length; i++)
			renderContent(contents[i], iDepth, parentDiv);
	}

	//-------------------------------------------------------------------

	function renderContent(contentNode, iDepth, parentDiv)
	{
	
		var contentId = LumisPortalUtil.getElementText(LumisPortalUtil.selectSingleNode("id", contentNode));
		var contentName = LumisPortalUtil.getElementText(LumisPortalUtil.selectSingleNode("n", contentNode));
		var curClassName = g_LumisContentItemClassName;
		
		if(LumisPortalUtil.selectSingleNode("className", contentNode))
			curClassName = LumisPortalUtil.getElementText(LumisPortalUtil.selectSingleNode("className", contentNode));

		var pContentDiv = document.createElement("DIV");
		
		if(parentDiv && parentDiv.nextSibling)
			element.insertBefore(pContentDiv, parentDiv.nextSibling);
		else
			element.appendChild(pContentDiv);

		pContentDiv.noWrap = true;
		pContentDiv.lumDepth = iDepth;
		
		pContentDiv.lumContentName = contentName;
		pContentDiv.lumContentId = contentId;

		if (g_LumisCurrentContentId == contentId)
			pContentDiv.className = "cLumSelectTreeItem cLumSelectTreeItemSelected"; 
		else 
			pContentDiv.className = "cLumSelectTreeItem"; 

		pContentDiv.innerHTML = '<img id="expandImg" align="absmiddle" src="'+g_LumisRootPath+'lumis/portal/client/images/Plus.gif" alt=" " style="cursor:pointer"/><span id="treeItem" class="'+curClassName+'">'+contentName+'</span>';
		pContentDiv.all("expandImg").onclick = onExpandContractClicked;
		pContentDiv.all("treeItem").onclick = onContentClicked;
		pContentDiv.lumCanExpand = true;
		pContentDiv.style.paddingLeft += 15*iDepth;
		
		var xmlDom = m_xmlHttp.responseXML;
		
		var subContents = LumisPortalUtil.selectNodes("response/contentTreeData/cnt[pId='"+contentId+"']", xmlDom);
		
		if(subContents.length > 0)
		{
			pContentDiv.lumLoaded = true;
			pContentDiv.lumExpanded = true;

			if(iDepth > 0)
				pContentDiv.all("expandImg").src = g_LumisRootPath + "lumis/portal/client/images/Minus.gif";
		}

		for (var i = 0; i < subContents.length; i++)
		{
			var subContent = subContents[i];
			renderContent(subContent, iDepth+1);
		}
	}

	//-------------------------------------------------------------------

	function onContentClicked()
	{
		var srcElement = window.event.srcElement;
		
		while(srcElement && !srcElement.lumContentId)
			srcElement = srcElement.parentElement;
		
		if(srcElement)
		{
			try
			{
				var contentName = srcElement.lumContentName;
				var contentId = srcElement.lumContentId;
				
				eval(g_LumisCallbackFuncion.replace("%CONTENTID%", contentId).replace("%CONTENTNAME%", contentName));
				LumisPortal(g_LumisInterfaceInstanceId);
			}
			catch (e)
			{
				throw "SelectParentContentTreeControl: Error running callback function: " + e;
			}
		}
	}

	//-------------------------------------------------------------------

	function onExpandContractClicked()
	{
		var srcElement = window.event.srcElement;
		while(srcElement && !srcElement.lumContentId)
			srcElement = srcElement.parentElement;

		expandContractNode(srcElement);
		window.event.cancelBubble = true;
	}

	//-------------------------------------------------------------------

	function expandContractNode(srcElement)
	{
		if(srcElement.lumCanExpand == false)
			return;
		
		if(!srcElement.lumLoaded)
		{
			var strMethod = "<method name=\"getChildrenData\">";
			strMethod += "<sourceId>"+g_LumisSourceId+"</sourceId>";
			strMethod += "<interfaceInstanceId>"+g_LumisInterfaceInstanceId+"</interfaceInstanceId>";
			strMethod += "<currentContentId>"+srcElement.lumContentId+"</currentContentId>";
			strMethod += "</method>";
			
			LumisPortalUtil.makeHttpRequest(g_LumisRootPath + "lumis/content/controller/xml/ContentTreeControllerXml.jsp", strMethod, null, true, m_xmlHttp);
  			renderTree(srcElement, srcElement.lumContentId, srcElement.lumDepth+1);
  			
			xmlDom = m_xmlHttp.responseXML;

  			srcElement.lumLoaded = true;
  			if(!LumisPortalUtil.selectSingleNode("response/contentTreeData/cnt", xmlDom))
  			{
  				srcElement.lumCanExpand = false;
  				srcElement.all("expandImg").style.visibility = "hidden";
  			}
  			else
  			{
  				srcElement.all("expandImg").src = g_LumisRootPath + "lumis/portal/client/images/Minus.gif";
  				srcElement.lumExpanded = true;
  			}
  			
  			return;
		}

		var displayMode = "";
		if(srcElement.lumExpanded)
		{
			srcElement.all("expandImg").src = g_LumisRootPath + "lumis/portal/client/images/Plus.gif";
			srcElement.lumExpanded = false;
			displayMode = "none";
		}
		else
		{
			srcElement.all("expandImg").src = g_LumisRootPath + "lumis/portal/client/images/Minus.gif";
			srcElement.lumExpanded = true;
		}
		
		var pCurElement = srcElement.nextSibling;

		while(pCurElement && pCurElement.lumDepth > srcElement.lumDepth)
		{
			if(!srcElement.lumExpanded || pCurElement.lumDepth == srcElement.lumDepth+1)
				pCurElement.style.display = displayMode;
				
			if(!srcElement.lumExpanded && pCurElement.lumContentId)
			{
				pCurElement.lumExpanded = false;
				pCurElement.all("expandImg").src = g_LumisRootPath + "lumis/portal/client/images/Plus.gif";
			}

			pCurElement = pCurElement.nextSibling;
		}
	}
}

