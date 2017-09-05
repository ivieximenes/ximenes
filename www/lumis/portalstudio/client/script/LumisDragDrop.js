/***********************************************************************
	Copyright © Lumis Technologia da Informação
 ***********************************************************************/
// $Revision: 13841 $ $Date: 2011-12-14 16:59:06 -0200 (Wed, 14 Dec 2011) $
(function($){
window.LumisDragDropObj = null;

/*---------------------------------------------------------------------------
Drag Drop XML data:

<dragobject>
	<type></type>
	<data></data>
</dragobject>
-----------------------------------------------------------------------------*/
window.LumisDragDrop = function (element)
{
	var m_fMouseDown = false;
	var m_fMouseMoved = false;
	var m_cxOffset = 0;			// x offset of mouse from left of drag part
	var m_cyOffset = 0;			// y offset of mouse from top of drag part
	var m_prtSrc = null;		// ref to source of the part drag
	var m_prtDrag = null;		// ref to drag part
	var m_prtTarget = null;		// ref to target part
	
	//-------------------------------------------------------------------------------------

	function Initialize()
	{
		if(window.attachEvent) // IE5+, the if is changed because IE9 returns 'true' for 'window.addEventListener', but cannot add the events correctly.
		{
			document.attachEvent("onmousedown", OnMouseDown);
			document.attachEvent("onmousemove", OnMouseMove);
			document.attachEvent("onmouseup", OnMouseUp);
		}
		else // firefox
		{
			window.addEventListener('mousedown', OnMouseDown, false);
			window.addEventListener('mousemove', OnMouseMove, false);
			window.addEventListener('mouseup', OnMouseUp, false);
		}
	}

	//-------------------------------------------------------------------------------------

	function OnMouseDown(event)
	{
		if(!event)
			event = window.event;
			
		if(event.button == 2)
			return;
			
		var pDraggableElem = GetDraggableElement(event.clientX, event.clientY);
		
		if(pDraggableElem)
		{
			m_fMouseDown = true;

			m_cxOffset = event.clientX - LumisPortalUtil.getAbsoluteLeft(pDraggableElem);
			m_cyOffset = event.clientY - LumisPortalUtil.getAbsoluteTop(pDraggableElem);

			m_prtSrc = GetDragDataElement(pDraggableElem);
			
			if(!m_prtSrc)
				return;

			// Either clone the dragdata element or allow it to provide the image
			if(!m_prtSrc.lumDragImage)
			{
				m_prtDrag = document.createElement("DIV");
				m_prtDrag.innerHTML = m_prtSrc.innerHTML;
				m_prtDrag.style.width = m_prtSrc.offsetWidth;
				m_prtDrag.style.filter = 'alpha(opacity=50)';
			}
			else
			{
				m_prtDrag = document.createElement("DIV");
				m_prtDrag.innerHTML = m_prtSrc.lumDragImage;
			}

			// Let the dragdata element know that it is being dragged
			if(m_prtSrc.lumBeginDrag)
			{
				m_prtDrag.innerHTML = eval(m_prtSrc.lumBeginDrag);
			}

			m_prtDrag.style.zIndex= 10002;
			
			m_prtDrag.style.position = 'absolute';
			m_prtDrag.style.left = (event.clientX - m_cxOffset) + 'px';
			m_prtDrag.style.top = (event.clientY - m_cyOffset) + 'px';

			document.body.appendChild(m_prtDrag);
		}
	}

	//-------------------------------------------------------------------------------------

	function OnMouseMove(event)
	{
		if(!event)
			event = window.event;
			
		if (m_fMouseDown)
		{
			var prtTarget;

			m_fMouseMoved = true;
			
			// Move the element
			m_prtDrag.style.left = event.clientX - m_cxOffset + 'px';
			m_prtDrag.style.top = event.clientY - m_cyOffset + 'px';

			prtTarget = GetTargetFromPoint(event.clientX, event.clientY, m_prtDrag);

			// Check if we exited and entered another item
			if(m_prtTarget != prtTarget)
			{
				if(m_prtTarget)
				{	
					// signal the old target that we left;
					try{m_prtTarget.lumDragLeave(event);}catch(hr){}
					m_prtTarget = null;
				}
			}
			
			// Are we over something valid now?
			if(prtTarget)
			{
				var prtDragZIndexOld = m_prtDrag.style.zIndex;
				m_prtDrag.style.zIndex = -1;
					
				if(m_prtTarget != prtTarget)
				{
					m_prtTarget = prtTarget;
					try{m_prtTarget.lumDragEnter(event, m_prtSrc.lumDragData, prtTarget);}catch(hr){}
					try{m_prtTarget.lumDragOver(event, m_prtSrc.lumDragData, prtTarget);}catch(hr){}
				}
				else
				{
					try{m_prtTarget.lumDragOver(event, m_prtSrc.lumDragData, m_prtTarget);}catch(hr){}
				}

				m_prtDrag.style.zIndex = prtDragZIndexOld;
			}
		}
	}

	//-------------------------------------------------------------------------------------

	function OnMouseUp(event)
	{
		if(!event)
			event = window.event;
			
		var bDropResult = false;

		try
		{
			if (m_fMouseDown)
			{
				if(m_prtTarget)
				{
					try{bDropResult=m_prtTarget.lumDrop(event, m_prtSrc.lumDragData, m_prtSrc, m_prtTarget);}catch(hr){bDropResult=false;}
					
					if(bDropResult)
					{
						try{m_prtSrc.lumNotifyDrop(m_prtTarget);}catch(hr){}
					}

					m_prtTarget = null;
				}

				m_prtDrag.style.position = '';
				m_prtDrag.style.display = "none";


				//if(!g_iInTemplateMode)
				//	m_prtDrag.removeNode(true);
				
				m_prtDrag = null;

				m_fMouseDown = false;
				m_fMouseMoved = false;
			}
		}
		catch(hr)
		{
			alert(hr.description);
		}
	}

	//-------------------------------------------------------------------------------------

	function GetTargetFromPoint(x, y, prtDrag)
	{			
		var prtDragZIndexOld = prtDrag.style.zIndex;
		prtDrag.style.zIndex = -1;

		var prtPageHighlightOld = g_LumisPage.PageDropHighlight.element().style.zIndex;
		g_LumisPage.PageDropHighlight.element().style.zIndex = -1;
		

		var pElement = document.elementFromPoint(x, y);

		if (!pElement || pElement.getAttribute("lumAllowDrop")!="1")
			pElement = null;

		if(pElement != null && pElement.lumGetTarget)
			pElement = pElement.lumGetTarget();

		prtDrag.style.zIndex = prtDragZIndexOld;
		g_LumisPage.PageDropHighlight.element().style.zIndex = prtPageHighlightOld;
		
		return pElement;
	}

	//-------------------------------------------------------------------------------------

	function GetDragDataElement(srcElem)
	{
		var dragDataElement = srcElem;

		while(!dragDataElement.lumDragData && dragDataElement.tagName != 'BODY')
		{
			dragDataElement = dragDataElement.parentNode;
		}

		if(!dragDataElement.lumDragData)
			dragDataElement = null;

		// check to see if the lumGetDragData is implemented
		if(dragDataElement.lumGetDragData)
		{
			dragDataElement.lumDragData = eval(dragDataElement.lumGetDragData);
		}

		return dragDataElement;
	}

	//-------------------------------------------------------------------------------------

	function GetDraggableElement(x, y)
	{
		var pElement = document.elementFromPoint(x,y);

		if(pElement != null && pElement.getAttribute("lumIsDraggable") != "true")
			pElement = null;

		if(pElement != null && !pElement.lumDragData && !pElement.lumGetDragElement)
			pElement = null;

		if(pElement != null && pElement.lumGetDragElement)
			pElement = pElement.lumGetDragElement();

		return pElement;
	}
	
	//-------------------------------------------------------------------------------------

	Initialize();
}

})(jQuery)