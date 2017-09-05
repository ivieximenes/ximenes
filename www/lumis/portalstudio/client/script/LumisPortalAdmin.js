/* $Revision: 17548 $ $Date: 2015-07-09 19:47:45 -0300 (Thu, 09 Jul 2015) $ */
(function($)
{
	window.LumisPortalAdmin = new LumisPortalAdminType();
	window.LumisRootAdministrationChannelId = "00000000B00000000000000000000001";
	document.onkeydown = window.LumisPortalAdmin.onKeyDown;
	document.onkeyup = window.LumisPortalAdmin.onKeyUp;
	document.onclick = window.LumisPortalAdmin.onClick;
	
	$(document).ready(function () 
	{
		$('body').LumisPortalStudio();
		window.LumisPortalAdmin.init();
	});
	
	function LumisPortalAdminType()
	{
		this.init = init;
		this.onEditPage = onEditPage;
		this.onEditTheme = onEditTheme;
		this.onActivateLayout = onActivateLayout;
		this.onSavePage = onSavePage;
		this.onCancel = onCancel;
		this.onStructureLayoutClicked = onStructureLayoutClicked;
		this.onGridLayoutClicked = onGridLayoutClicked;
		this.onPagePreviewClicked = onPagePreviewClicked;
		this.adjustButtonsImagesStyle = adjustButtonsImagesStyle;
		this.inPreviewLayoutMode = inPreviewLayoutMode;
		this.inGridLayoutMode = inGridLayoutMode;
		this.inStructureLayoutMode = inStructureLayoutMode;
		this.localize = localize;
		this.onKeyDown = onKeyDown;
		this.onKeyUp = onKeyUp;
		this.onClick = onClick;
		this.onToggleAdminMenu = onToggleAdminMenu;
		this.onPageHolderDelete = onPageHolderDelete;
		this.toggleVisible = toggleVisible;
		this.ctrlKeyPressed = false;
		this.inEditMode = false;
		this.inEditStructureLayoutMode = null;
		this.inEditGridLayoutMode = null;
		this.inNonEditStructureLayoutMode = null;
		this.inNonEditGridLayoutMode = null;
		this.inActivateLayoutMode = false;
		
		this.onChangeChannel = onChangeChannel;
		this.pLumisServiceInterfaceList = null;
		this.pLumisServiceInterfaceListHeader = null;
		this.hasEditableThemes = false;
	
		var pLumisChannelTreeDiv = null;
		var pLumisServiceInterfaceListDiv = null;
		var pLumisServiceInterfaceListHeaderDiv = null;
		var pNavigationPaneHeaderText = null;
		var pEditThemeButton = null;
		var pEditPageButton = null;
		var pSavePageButton = null;
		var pCancelEditPageButton = null;
		var pPageViewButton = null;
		
		//-------------------------------------------------------------------------------
	
		function init()
		{
			pLumisChannelTreeDiv = document.getElementById("LumisAdminChannelTree");
			pNavigationPaneHeaderText = document.getElementById("LumisAdminNavigationHeader");
			pEditPageButton = document.getElementById("lumEditPageButton");
			pSavePageButton = document.getElementById("lumSavePageButton");
			pCancelEditPageButton = document.getElementById("lumCancelButton");
			pPageViewButton = document.getElementById("lum-admin-switch-page-view");
			pEditThemeButton = document.getElementById("lumEditThemeButton");
			
			
			if(g_LumisRootChannelId != LumisRootAdministrationChannelId && g_LumisPageConfig.type != 1 && (!LumisPortal.getCookie("lumInEditStructureLayout") || LumisPortal.getCookie("lumInEditStructureLayout") == "true"))
				this.inEditStructureLayoutMode = true;
			else
				this.inEditStructureLayoutMode == false;
			
			if(g_LumisRootChannelId == LumisRootAdministrationChannelId || g_LumisPageConfig.type == 1 || (!LumisPortal.getCookie("lumInEditGridLayout") || LumisPortal.getCookie("lumInEditGridLayout") == "false"))
				this.inEditGridLayoutMode = false;
			else
				this.inEditGridLayoutMode = true;
	
			if(g_LumisRootChannelId == LumisRootAdministrationChannelId || g_LumisPageConfig.type == 1 || (!LumisPortal.getCookie("lumInNonEditStructureLayout") || LumisPortal.getCookie("lumInNonEditStructureLayout") == "false"))
				this.inNonEditStructureLayoutMode = false;
			else
				this.inNonEditStructureLayoutMode = true;
				
			if(g_LumisRootChannelId == LumisRootAdministrationChannelId || g_LumisPageConfig.type == 1 || (!LumisPortal.getCookie("lumInNonEditGridLayout") || LumisPortal.getCookie("lumInNonEditGridLayout") == "false"))
				this.inNonEditGridLayoutMode = false;
			else
				this.inNonEditGridLayoutMode = true;
	
			this.adjustButtonsImagesStyle();
	
			g_LumisContextMenu = new LumisContextMenu();
			g_LumisDragDropObj = new LumisDragDrop();
			
			if(pLumisChannelTreeDiv)
				g_LumisChannelTree = new LumisChannelTree(pLumisChannelTreeDiv);
			
			g_LumisPage = new LumisPage();
			
			if(g_LumisPageConfig.type == 0 && g_LumisRootChannelId != LumisRootAdministrationChannelId)
			{
				// check if an editable theme is applied to page
		      	$.ajax(
		      	{
		      		url: g_LumisRootPath+"lumis/api/rest/lum-internal/admin/portal-studio/theme/editor/geteditablethemes", 
		      		data: {"pageId":g_LumisPageId},
					success: function (data) 
					{
						var themes = JSON.parse(data);
						if(themes.length > 0)
						{
							LumisPortalAdmin.hasEditableThemes = true;
							$("#lumEditThemeButton").show();
						}
					}
		      	}
		      	);

				// check if an editable theme is applied to page
		      	$.ajax(
		      	{
		      		url: g_LumisRootPath+"lumis/api/rest/lum-internal/admin/portal-studio/theme/editor/ispagelayoutfileeditable", 
		      		data: {"pageId":g_LumisPageId},
					dataType:'json',
					success: function (data) 
					{
						if(data.isEditable === "true")
							$("#lumActivateLayoutButton").show();
					}
		      	}
		      	);
			}
			
			var curActivationBlock = null;
			var curActivationBlockPrevTitle = null;
			
			$("div#LumisAdminWorkPaneBodyBg").mouseover(function(e)
			{
				if(LumisPortalAdmin.inActivateLayoutMode)
				{
					var x = e.pageX - this.offsetLeft;
			        var y = e.pageY - this.offsetTop;
			        var pElement = document.elementFromPoint(x, y);
			        
			        if(pElement)
			        {
			        	var jqueryElement = $(pElement);
			        	if(jqueryElement === curActivationBlock)
			        	{
			        		e.stopPropagation();
			        		return false;
			        	}
			        	
			        	// check if element within a lumHolder
			        	var parentElement = jqueryElement;
			        	var pageHolderFound = false;
			        	while(parentElement && (parentElement !== undefined) && parentElement.prop("tagName").toLowerCase() != "body")
			        	{
			        		var attr = parentElement.attr("lumHolder");
			        		if (attr !== undefined && attr !== false) 
			        		{
			        			pageHolderFound = true;
			        			break;
			        		}
			        		
			        		parentElement = parentElement.parent();
			        	}
			        	
			        	if(pageHolderFound)
			        		return;
			        	
			        	if(jqueryElement.find("[lumHolder]").length > 0)
			        		return;
			        	
			        	var descriptiveName = jqueryElement.prop("tagName").toLowerCase();
			        	if(jqueryElement.attr("id"))
			        		descriptiveName += "#"+jqueryElement.attr("id");
			        	var classNames = jqueryElement.attr('class');
			        	if(classNames)
			        		descriptiveName += "."+classNames.replace(/\s+/g, '.');
			        	
			        	if(curActivationBlock)
			        	{
			        		curActivationBlock.removeClass("lum-administration-activate-block");
			        		
			        		if(curActivationBlockPrevTitle)
			        		{
			        			curActivationBlock.attr('title', curActivationBlockPrevTitle);
			        		}
			        		else
			        			curActivationBlock.removeAttr("title");
			        	}
			        	
			        	curActivationBlockPrevTitle = jqueryElement.attr('title');
			        	jqueryElement.attr('title', descriptiveName);

			        	curActivationBlock = jqueryElement;
			        	curActivationBlock.addClass("lum-administration-activate-block");
			        	
		        		e.stopPropagation();
		        		return false;
			        }
				}
			});

			$("div#LumisAdminWorkPaneBodyBg").mouseout(function(e)
			{
				if(curActivationBlock)
				{
	        		curActivationBlock.removeClass("lum-administration-activate-block");
		        	
	        		if(curActivationBlockPrevTitle)
	        			curActivationBlock.attr('title', curActivationBlockPrevTitle);
	        		else
	        			curActivationBlock.removeAttr("title");
	        		
	        		curActivationBlock = null;
				}
			});

			$("div#LumisAdminWorkPaneBodyBg").click(function(e)
			{
				if(LumisPortalAdmin.inActivateLayoutMode && curActivationBlock)
				{
	        		curActivationBlock.removeClass("lum-administration-activate-block");
	        		
	        		var selector = curActivationBlock.getSelector()[0];
	        		if(!selector)
	        			return;

	        		if(selector.indexOf("#LumisAdminWorkPaneBodyBg") != -1)
	        			selector = selector.replace(/^.*#LumisAdminWorkPaneBodyBg/,'body');
				    
	        		e.stopPropagation();
	        		curActivationBlock.addClass("lum-administration-activate-block");

	        		LumisLightBox.open(g_LumisRootPath+LumisPortal.mainName+"?"+LumisPortal.pageParameterPageIdName+"=LumisBlankPage&"+LumisPortal.pageParameterChannelIdName+"="+g_LumisChannelId+"&editingPageId="+g_LumisPageId+"&lumRTI=lumis.service.portalmanagement.theme.insertPageHolder&elementPath="+encodeURIComponent(selector),{'width':900,'showCloseButton':false,'hideOnOverlayClick':false,'padding':0});
	    			
	    			return false;
				}	
			});

			$("[lumHolder]").contextmenu(function (evt) 
			{	
				return onPageHolderContextMenu(event);
			});

			$(".lum-admin-page-holder-highlight-content").contextmenu(function (evt) 
			{	
				return onPageHolderContextMenu(event);
			});
		}
		
		//-------------------------------------------------------------------------------
	
		function onClick()
		{
			if (g_LumisContextMenu != null)
			{
				if(LumisSelectedInterface!=null)
				{
					var pElement = LumisSelectedInterface; 
					LumisSelectedInterface = null;
					pElement.lumScriptHandler.highlight.hide();
				}
				g_LumisContextMenu.hide();
			}
		}
		
		//-------------------------------------------------------------------------------
		
		function onKeyDown(event)
		{
			if(!event)
				event = window.event;
			
			if(event.keyCode == 113)
			{
				if(LumisPortalAdmin.inEditMode)
				{
					alert(localize("STR_CANNOT_F12_WHEN_EDITING_PAGE"))
					return;
				}
					
				// get toggle mode url
				var xmlHttp = LumisPortal.getXmlHttpObject();
				var responseText = null;
				var toggleModeUrlServer = g_LumisRootPath+"lumis/api/rest/lum-internal/admin/mode/gettogglemodeurl?lumCurrentDisplayModeId="+g_LumisDisplayMode+"&lumReferer="+LumisPortal.lumisEncodeURIComponent(document.location.href)+"&lumPageId="+g_LumisPageId+"&lumChannelId="+g_LumisChannelId;
				xmlHttp.open("POST", toggleModeUrlServer, false);
				xmlHttp.send();
				var json = eval("(" + xmlHttp.responseText + ")");
				if(json && json.toggleModeUrl)
				{
					document.forms["LumisPortalForm"].action = json.toggleModeUrl;
					document.forms["LumisPortalForm"].elements["lumToggleModeOriginUrl"].value = window.location.href;
					document.forms["LumisPortalForm"].submit();
					this.isSubmitting = true;
				}
			}
			else if(event.keyCode == 17)
				LumisPortalAdmin.ctrlKeyPressed = true;
			
			if (g_LumisContextMenu != null)
				g_LumisContextMenu.hide();
		}
	
		//-------------------------------------------------------------------------------
	
		function onKeyUp()
		{
			LumisPortalAdmin.ctrlKeyPressed = false;
		}
	
		//-------------------------------------------------------------------------------
		function adjustButtonsImagesStyle()
		{	
			if(g_LumisPageConfig.type != 0 || g_LumisRootChannelId == LumisRootAdministrationChannelId)
				return;
			
			if(this.inEditMode)
			{
				if(this.inEditStructureLayoutMode)
					pPageViewButton.className = "lum-admin-switch-page-view lum-admin-page-structure-view";
				else if(this.inEditGridLayoutMode)
					pPageViewButton.className = "lum-admin-switch-page-view lum-admin-page-grid-view";
				else
					pPageViewButton.className = "lum-admin-switch-page-view lum-admin-page-layout-view";
			}
			else
			{
				if(this.inNonEditStructureLayoutMode)
					pPageViewButton.className = "lum-admin-switch-page-view lum-admin-page-structure-view";
				else if(this.inNonEditGridLayoutMode)
					pPageViewButton.className = "lum-admin-switch-page-view lum-admin-page-grid-view";
				else
					pPageViewButton.className = "lum-admin-switch-page-view lum-admin-page-layout-view";
			}
		}
	
		//-------------------------------------------------------------------------------
		
		function onEditTheme()
		{
			LumisLightBox.open(g_LumisRootPath+"lumis/api/rest/lum-internal/admin/portal-studio/theme/editor/editTheme?pageId="+g_LumisPageId, {'width':'100%','height':'100%','showCloseButton':false,'hideOnOverlayClick':false,'padding':0,'margin':15});
			
			return false;
		}
		
		//-------------------------------------------------------------------------------
		
		function onActivateLayout()
		{
			if(!this.inActivateLayoutMode)
			{
				$("#lumActivateLayoutButton").find("a.activate-link").hide();
				pEditThemeButton.style.display = "none";
				pEditPageButton.style.display = "none";
				$("#lumActivateLayoutButton").find("a.cancel-activate-link").show();
				this.inActivateLayoutMode = true;
				
				$(".lum-admin-work-pane-header").addClass("lum-admin-editing");
	        	$("[lumHolder]").addClass("lum-administration-activate-block");
			}
			else
			{
				this.inActivateLayoutMode = false;
				$("#lumActivateLayoutButton").find("a.activate-link").show();
				pEditThemeButton.style.display = "inline";
				pEditPageButton.style.display = "inline";

				$(".lum-admin-work-pane-header").removeClass("lum-admin-editing");
				$("#lumActivateLayoutButton").find("a.cancel-activate-link").hide();
	        	$("[lumHolder]").removeClass("lum-administration-activate-block");
			}
			return false;
		}
		
		//-------------------------------------------------------------------------------
		
		function onPageHolderContextMenu(event)
		{
			if(LumisPortalAdmin.hasEditableThemes)
			{		
				var pageHolderName = $(event.currentTarget).attr("lumHolder");
				if(typeof pageHolderName === "undefined")
				{
					pageHolderName = $(event.currentTarget).parent().attr("title");
				}
				
				var strTemp = g_LumisContextMenu.generateHeader("Page holder:"+pageHolderName, 'lum-admin-context-menu-title lum-admin-context-menu-page-title');
				strTemp += g_LumisContextMenu.generateMenuItem("STR_DELETE_PAGE", "g_LumisContextMenu.hide();LumisPortalAdmin.onPageHolderDelete('"+pageHolderName+"');");
				strTemp += g_LumisContextMenu.generateFooter();
	
				g_LumisContextMenu.show(event.currentTarget, strTemp, event.clientX, event.clientY);
				return false;
			}
			else
			{
				return true;
			}
		}
		
		//-------------------------------------------------------------------------------
		
		function onPageHolderDelete(pageHolderName)
		{
			if(confirm(LumisPortalAdmin.localize("STR_ARE_YOU_SURE_TO_DELETE", [pageHolderName])))
			{
				$('body').css('cursor', 'wait');
		      	$.ajax({
		      		url: g_LumisRootPath+"lumis/api/rest/lum-internal/admin/portal-studio/theme/editor/deletepageholder",
		      		type: "POST", 
		      		data: {"pageId":g_LumisPageId, "pageHolderName":pageHolderName},
					success: function (data) 
					{
						LumisPortal.onRefresh();
						$('body').css('cursor', 'auto');
					}
				})
				.fail(function() 
				{
					alert(LumisPortalAdmin.localize("STR_COULD_NOT_REMOVE_PAGE_HOLDER"));
					$('body').css('cursor', 'auto');
				});
			}
		}
		
		//-------------------------------------------------------------------------------
	
		function onEditPage()
		{
			if(g_LumisPageConfig.type != 0 || this.inEditMode)
				return;
			
			if(pLumisServiceInterfaceListDiv == null)
			{
				// load the service interfaces list
				pLumisServiceInterfaceListDiv = document.getElementById("LumisAdminServiceInterfaceList");
				pLumisServiceInterfaceListDiv.scriptHandler = new LumisServiceInterfaceList(pLumisServiceInterfaceListDiv);
				this.pLumisServiceInterfaceList = pLumisServiceInterfaceListDiv;
				
				// TODO: check if this is a template page
				pLumisServiceInterfaceListHeaderDiv = document.getElementById("LumisAdminServiceInterfaceListHeader");
				pLumisServiceInterfaceListHeaderDiv.scriptHandler = new LumisServiceInterfaceListHeader(pLumisServiceInterfaceListHeaderDiv);
				this.pLumisServiceInterfaceListHeader = pLumisServiceInterfaceListHeaderDiv;

				this.onChangeChannel(g_LumisChannelId, g_LumisChannelPath);
			}
			else
			{
				this.pLumisServiceInterfaceList.reloadData(g_LumisChannelId);
				this.pLumisServiceInterfaceListHeader.reloadData(g_LumisChannelId);
			}
			
			if(g_LumisPageConfig.isTemplate)
				pLumisServiceInterfaceListDiv.className = "lum-admin-service-interface-list lum-admin-service-interface-list-for-template";
			else
				pLumisServiceInterfaceListDiv.className = "lum-admin-service-interface-list";
			
			document.getElementById("LumisAdminWorkPaneTitle").className="lum-admin-work-pane-header lum-admin-editing";
			
			//pNavigationPaneHeaderText.innerText = this.localize("STR_CHANNEL")+": "+g_LumisChannelConfig.name;
			
			document.getElementById("lum-admin-work-pane-header-page-label").innerText = this.localize("STR_EDITING_PAGE")+":";
			
			pLumisServiceInterfaceListDiv.style.display = "";
			pLumisServiceInterfaceListHeaderDiv.style.display = "block";
			if(pLumisChannelTreeDiv)
				pLumisChannelTreeDiv.style.display = "none";
	
			pEditPageButton.style.display = "none";
			pEditThemeButton.style.display = "none";
			$("#lumActivateLayoutButton").hide();
			pSavePageButton.style.display = "inline";
			pCancelEditPageButton.style.display = "inline";
	
			this.inEditMode = true;
			this.adjustButtonsImagesStyle();
	
			LumisPortalUtil.disableSelection( $('body')[0] );
			
			g_LumisPage.onEditPage();
		}
		
		//-------------------------------------------------------------------------------
	
		function onSavePage()
		{
			if(g_LumisPageConfig.type != 0 || !this.inEditMode)
				return;
	
			pLumisServiceInterfaceListDiv.style.display = "none";
			pLumisServiceInterfaceListHeaderDiv.style.display = "none";
			if(pLumisChannelTreeDiv)
				pLumisChannelTreeDiv.style.display = "";
			
			pEditPageButton.style.display = "inline";
			
			if(LumisPortalAdmin.hasEditableThemes)
				pEditThemeButton.style.display = "inline";
			
			if(LumisPortalAdmin.hasEditableThemes)
				$("#lumActivateLayoutButton").show();
			
			pSavePageButton.style.display = "none";
			pCancelEditPageButton.style.display = "none";
			
			this.inEditMode = false;
			
			g_LumisPage.onSavePage();
			
			document.getElementById("lum-admin-work-pane-header-page-label").innerText = this.localize("STR_PAGE")+":";
			
			document.getElementById("LumisAdminWorkPaneTitle").className="lum-admin-work-pane-header";
			
			this.adjustButtonsImagesStyle();
		}
		
		//-------------------------------------------------------------------------------
	
		function onCancel()
		{
			if(!this.inEditMode)
				return;
			
			pEditPageButton.style.display = "inline";
			
			if(LumisPortalAdmin.hasEditableThemes)
				pEditThemeButton.style.display = "inline";
			
			if(LumisPortalAdmin.hasEditableThemes)
				$("#lumActivateLayoutButton").show();
			
			pSavePageButton.style.display = "none";
			pCancelEditPageButton.style.display = "none";
			
			var strMethod = "<method name=\"deleteOrphanInterfaces\">";
			strMethod += "<id>"+g_LumisPageId+"</id>";
			strMethod += "</method>";
			
			LumisPortalUtil.makeHttpRequest(g_LumisRootPath+"lumis/portal/controller/xml/PageControllerXml.jsp", strMethod, null, true);
			
			document.getElementById("lum-admin-work-pane-header-page-label").innerText = this.localize("STR_PAGE")+":";
			document.getElementById("LumisAdminWorkPaneTitle").className="lum-admin-work-pane-header";
			
			LumisPortal.onRefresh();
		}
	
		//-------------------------------------------------------------------------------
	
		function onStructureLayoutClicked()
		{
			if(this.inEditMode)
			{
				if(this.inEditStructureLayoutMode)
					return;
				this.inEditStructureLayoutMode = true;
				document.cookie = "lumInEditStructureLayout=true";
				this.inEditGridLayoutMode = false;
				document.cookie = "lumInEditGridLayout=false";
			}
			else
			{
				if(this.inNonEditStructureLayoutMode)
					return;
				this.inNonEditStructureLayoutMode = true;
				document.cookie = "lumInNonEditStructureLayout=true";
				this.inNonEditGridLayoutMode = false;
				document.cookie = "lumInNonEditGridLayout=false";
			}	
			this.adjustButtonsImagesStyle();
			g_LumisPage.onShowLayoutStructureChanged();
		}
	
		//-------------------------------------------------------------------------------
	
		function onGridLayoutClicked()
		{
			if(this.inEditMode)
			{
				if(this.inEditGridLayoutMode)
					return;
				this.inEditGridLayoutMode = true;
				document.cookie = "lumInEditGridLayout=true";
				this.inEditStructureLayoutMode = false;
				document.cookie = "lumInEditStructureLayout=false";
			}
			else
			{
				if(this.inNonEditGridLayoutMode)
					return;
				this.inNonEditGridLayoutMode = true;
				document.cookie = "lumInNonEditGridLayout=true";
				this.inNonEditStructureLayoutMode = false;
				document.cookie = "lumInNonEditStructureLayout=false";
			}
			
			this.adjustButtonsImagesStyle();
			g_LumisPage.onShowLayoutStructureChanged();
		}
	
		//-------------------------------------------------------------------------------
	
		function onPagePreviewClicked()
		{
			if(this.inEditMode)
			{
				if(!this.inEditGridLayoutMode && !this.inEditStructureLayoutMode)
					return;
				this.inEditGridLayoutMode = false;
				document.cookie = "lumInEditGridLayout=false";
				this.inEditStructureLayoutMode = false;
				document.cookie = "lumInEditStructureLayout=false";
			}
			else
			{
				if(!this.inNonEditGridLayoutMode && !this.inNonEditStructureLayoutMode)
					return;
				this.inNonEditGridLayoutMode = false;
				document.cookie = "lumInNonEditGridLayout=false";
				this.inNonEditStructureLayoutMode = false;
				document.cookie = "lumInNonEditStructureLayout=false";
			}	
			this.adjustButtonsImagesStyle();
			g_LumisPage.onShowLayoutStructureChanged();
		}
	
		//-------------------------------------------------------------------------------
	
		// if params is specified, the localized strings parameters are taken from the
		// params array. Else the params array is constructed by spliting the stringId by ';'.
		function localize(stringId, params)
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
	
			var localizedString = lum_stringTable[stringId];
			if (localizedString == null)
				return stringId;
	
			for (var i = 0; i < params.length; i++)
			{
				var localizedTerm = lum_stringTable[params[i]];
				if (localizedTerm == null)
					localizedTerm = params[i];
				localizedString = localizedString.replace(new RegExp("%" + (i+1), "gm"), localizedTerm);
			}	
			return localizedString;
		}
	
		//-------------------------------------------------------------------------------
	
		function onChangeChannel(strChannelId, strFullChannelName)
		{
			document.getElementById("LumisAdminServiceInterfaceList").reloadData(strChannelId);
			document.getElementById("LumisAdminServiceInterfaceListHeader").reloadData(strChannelId);
			
			var arrChannelName = strFullChannelName.split("/");
			var strChannelName = arrChannelName[arrChannelName.length-1];
			var path = "";
			for(var i=1; i<arrChannelName.length-1; i++)
				path += arrChannelName[i]+" / ";
			
			if(path.length > 0)
			{
				document.getElementById("lum-admin-channel-path").title = path + strChannelName;
				path = " ( "+path+")";
			}
			document.getElementById("lum-admin-channel-name").innerHTML = strChannelName;
			document.getElementById("lum-admin-channel-path").innerHTML = path;
		}
		
		//-------------------------------------------------------------------------------
	
		function onToggleAdminMenu(curElement)
		{
			$(curElement).toggleClass("lum-admin-open");
			$(curElement).toggleClass("lum-admin-closed");
			
			$(curElement).next().toggleClass("lum-admin-open");
			$(curElement).next().toggleClass("lum-admin-closed");
			
			return false;
		}
	
		function inPreviewLayoutMode()
		{
			return !inGridLayoutMode() && !inStructureLayoutMode();
		}
	
		function inGridLayoutMode()
		{
			return this.inEditMode?this.inEditGridLayoutMode:this.inNonEditGridLayoutMode;	
		}
	
		function inStructureLayoutMode()
		{
			return this.inEditMode?this.inEditStructureLayoutMode:this.inNonEditStructureLayoutMode;
		}
	}
	
	$.fn.LumisPortalStudio = function(opts)
	{
		/*If page rendering were interrupted should not apply page administration layout */
		if($("#lum-admin-toggle-splitter").length == 0)
			return;
		
		var pLumisAdminChannelTree = $("#LumisAdminChannelTree");
		var pLumisAdminNavigationMenu= $("#LumisAdminNavigationMenu");
		var pLumisAdminServiceInterfaceList = $("#LumisAdminServiceInterfaceList");
		var pLumisAdminWorkPaneBody = $("#LumisAdminWorkPaneBody");
		var pBody = $("body");
		
		var pLayout = pBody.layout(
		{
			north:
			{
				paneSelector: "#LumisAdminHeader",
				paneClass:    "cLumisAdminHeaderPane",
				togglerClass: "cLumisAdminHeaderToggler",
				size: 48,
				resizable: false,
				closable: false,
				spacing_open: 0
			},
			west:
			{
				paneSelector: "#LumisAdminNavigationPane",
				paneClass:    "cLumisAdminNavigationPanePane",
				resizerClass: "lum-admin-work-pane-splitter",
				togglerClass: "lum-admin-work-pane-toggler",
				resizerTip: $('#LumisAdminNavigationPane').attr('resizeTranslate'),
				togglerLength_open: 0,
				togglerAlign_closed: "top",
				hideTogglerOnSlide: false,
				spacing_open: 8,
				spacing_closed: 30,
				size: (LumisPortal.getCookie("lumNavigationPaneSize")?LumisPortal.getCookie("lumNavigationPaneSize"):255),
				initClosed: (LumisPortal.getCookie("lumNavigationPaneClosed")=="true"?true:false),
				onopen: function (n,e,s) { if(!s.isSliding){ document.cookie = "lumNavigationPaneClosed=false"; }},
				onclose: function (n,e,s)  { if(!s.isSliding){ document.cookie = "lumNavigationPaneClosed=true"; }},
				onresize: function (n,e,s) { document.cookie = "lumNavigationPaneSize=" + s.size; },
				fxName:	"drop",
				fxSpeed: "normal",
				minSize: 240,
				resizeWhileDragging: true
			},
			center:
			{
				paneSelector: "#LumisAdminWorkPane",
				paneClass:    "lum-admin-work-pane",
				minWidth: 300
			}
		});
		
		pLayout.allowOverflow('north');
		
		var pWorkPaneLayout = $('#LumisAdminWorkPane').layout(
		{
			north:
			{
				paneSelector: "#LumisAdminWorkPaneHeader",
				size: 45,
				resizable: false,
				closable: false
			},
			center:
			{
				paneSelector: "#LumisAdminWorkPaneBody",
				paneClass:    "cLumisAdminWorkPaneBodyPane",
				resizerClass: "cLumisAdminWorkPaneBodyResizer",
				togglerClass: "cLumisAdminWorkPaneBodyToggler",
				onresize: function () {g_LumisPage.onPageChanged();}
			},
			south:
			{
				paneSelector: "#LumisAdminWorkPaneFooter",
				paneClass:    "cLumisAdminWorkPaneFooterPane",
				resizerClass: "cLumisAdminWorkPaneFooterResizer",
				togglerClass: "cLumisAdminWorkPaneFooterToggler",
				fxName:	      "drop",
				fxSpeed:	  "normal",
				slidable: false,
				spacing_open: 8,
				togglerLength_open: 25,
				togglerLength_close: 25,
				hideTogglerOnSlide: true,
				resizeWhileDragging: true,
				size: 100
			}
		})
		
		$('#LumisAdminNavigationPane-resizer').disableSelection();
		$('#LumisAdminWorkPaneFooter-resizer').disableSelection();
	
		pLayout.addToggleBtn("#lum-admin-toggle-splitter", "west");
		
		var pLumisAdminWorkPaneBodyBg = $("#LumisAdminWorkPaneBodyBg");
		pLumisAdminWorkPaneBodyBg.css("background-color", pBody.css("background-color"));
		pLumisAdminWorkPaneBodyBg.css("background-image", pBody.css("background-image"));
		pLumisAdminWorkPaneBodyBg.css("background-repeat", pBody.css("background-repeat"));
		pLumisAdminWorkPaneBodyBg.css("background-attachment", pBody.css("background-attachment"));
		pLumisAdminWorkPaneBodyBg.css("background-position", pBody.css("background-position"));
	
		if(pLumisAdminWorkPaneBodyBg.height() < pLumisAdminWorkPaneBody.height())
			pLumisAdminWorkPaneBodyBg.height( pLumisAdminWorkPaneBody.height() );
	
		pBody.css("background-color", "transparent");
		pBody.css("background-image", "none");
	
		onLayoutResize();
	
		function onLayoutResize()
		{
			if($.browser.msie)
			{
				var iLumisAdminChannelTreeHeight = parseInt($("#LumisAdminNavigationPane").css("width"));
				pLumisAdminChannelTree.css("width", iLumisAdminChannelTreeHeight);
			}
		}
	}
	function toggleVisible(divId)
	{
		with(document.getElementById(divId).style)
		{
			display = (display=='none')?'block':'none';
		}
	}
})(jQuery)