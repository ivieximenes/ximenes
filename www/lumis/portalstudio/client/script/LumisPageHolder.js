// $Revision: 15402 $ $Date: 2013-05-29 15:41:55 -0300 (Wed, 29 May 2013) $
(function($){
window.LumisPageHolder = function (element)
{
	element.lumDragEnter = lumDragEnter;
	element.lumDragOver = lumDragOver;
	element.lumDragLeave = lumDragLeave;
	element.lumDrop = lumDrop;

	var m_pHighlight;
	if(!element.getAttribute("lumRemainingHolder"))
	{
		m_pHighlight = new LumisPageHolderHighlight(element);
	}

	var m_$Element = $(element);

//	this.onEditModeChanged = onEditModeChanged;
//	this.onShowStructureChanged = onShowStructureChanged;
	this.onPageChanged = onPageChanged;
	this.highlight =  m_pHighlight;
		
	//-------------------------------------------------------

	function lumDragEnter(event, dragData)
	{
		g_LumisPage.PageDropHighlight.show(element, 0);
	}
	
	function lumDragOver(event, dragData)
	{
		g_LumisPage.PageDropHighlight.show(element, 0);
	}
	
	function lumDragLeave(event)
	{
		g_LumisPage.PageDropHighlight.hide();
	}
	
	function lumDrop(event, dragData, pSrc, iPosition)
	{
		g_LumisPage.PageDropHighlight.hide();
		return g_LumisPage.interfaceDropped(dragData, pSrc, 0, element);
	}

	function onPageChanged()
	{
		if(LumisPortalAdmin.inGridLayoutMode())
		{
			if(m_pHighlight) m_pHighlight.hide();

			if(m_$Element.outerHeight()<25)
			{
				m_$Element.data("height", m_$Element.css("height"));
				m_$Element.css("height", 25)
			}
		}
		else if(LumisPortalAdmin.inStructureLayoutMode())
		{
			if(m_pHighlight) m_pHighlight.show();

			if(m_$Element.outerHeight()<25)
			{
				m_$Element.data("height", m_$Element.css("height"));
				m_$Element.css("height", 25)
			}
		}
		else
		{
			if(m_pHighlight) m_pHighlight.hide();

			if(m_$Element.data("height"))
			{
				m_$Element.data("height", null);
				m_$Element.css("height", m_$Element.data("height"))
			}
		}

		if(m_pHighlight) m_pHighlight.update();

		if(LumisPortalAdmin.inEditMode)
		{
			if(element.getAttribute("lumEmpty"))
			{
				if(g_LumisPageConfig.isTemplate || !g_LumisPageConfig.hasParentTemplate)
				{
					m_$Element.attr("lumAllowDrop", "1");
					if(m_pHighlight) m_pHighlight.enableDrop();
				}
			}
		}
		else
		{
			m_$Element.removeAttr("lumAllowDrop");
			if(m_pHighlight) m_pHighlight.disableDrop();
		}
	}
}

function LumisPageHolderHighlight(pElement)
{
	var m_$Highlight;
	var m_$HighlightContent;
	var m_$Element = $(pElement);
	var m_$D0 = $("#LumisAdminWorkPaneBodyD0");
	var m_$WorkPaneBody = $("#LumisAdminWorkPaneBody");

	this.init = init;
	this.show = show;
	this.hide = hide;
	this.remove = remove;
	this.update = update;
	this.enableDrop = enableDrop;
	this.disableDrop = disableDrop;

	init();

	function init()
	{
		if(m_$Highlight==null)
		{
			m_$Highlight = $("<div></div>");
			m_$Highlight.addClass("lum-admin-page-holder-highlight");
			
			if(g_LumisPageConfig.hasParentTemplate)
				m_$Highlight.addClass("lum-admin-page-has-parent-template");
			
			m_$Highlight.attr("title", m_$Element.attr("lumHolder"));
			m_$Highlight.hide();
			m_$WorkPaneBody.prepend(m_$Highlight);

			m_$HighlightContent = $("<div></div>");
			m_$HighlightContent.addClass("lum-admin-page-holder-highlight-content");

			if(g_LumisPageConfig.hasParentTemplate)
				m_$HighlightContent.addClass("lum-admin-page-has-parent-template");
			
			m_$Highlight.append(m_$HighlightContent);
		}

		update();
	}

	function update()
	{
		if(m_$Highlight!=null)
		{
			m_$Highlight.css("top", m_$Element.offset().top -  m_$D0.offset().top-1);
			m_$Highlight.css("left", m_$Element.offset().left - m_$D0.offset().left-1);
			m_$HighlightContent.css("width", m_$Element.outerWidth());
			m_$HighlightContent.css("height", m_$Element.outerHeight());
		}
	}

	function show()
	{
		if(m_$Highlight!=null)	
		{
			m_$Highlight.show();
		}
	}

	function hide()
	{
		if(m_$Highlight!=null && !LumisPortalAdmin.inStructureLayoutMode())	
		{
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

	function enableDrop()
	{
		if(m_$Highlight)
		{
			m_$HighlightContent.attr("lumAllowDrop", "1");
			m_$HighlightContent.each( function () { this.lumGetTarget = function () {return pElement;} });

			m_$Highlight.attr("lumAllowDrop", "1");
			m_$Highlight.each( function () { this.lumGetTarget = function () {return pElement;} });
		}
	}

	function disableDrop()
	{
		if(m_$Highlight)
		{
			m_$Highlight.attr("lumAllowDrop", "false");
			m_$Highlight.attr("lumAllowDrop", "false");
		}
	}
}
})(jQuery)