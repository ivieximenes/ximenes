// $Revision: 17270 $ $Date: 2015-05-14 14:07:17 -0300 (Thu, 14 May 2015) $
var $_pagePersonalizationInEditMode = false;
(function($)
{
	this.dragged = null;
	var $_holder = new Array();
	var $_draggable = new Array();
	var $_serviceInstanceIds = new Array();
	var $_removedWidget = new Array();
	
	function getServiceInstanceIdFromClass(prefix, element)
	{
		var attr = $(element).attr("class");
		var re = new RegExp(prefix + "[A-Fa-f0-9]+");
		var m = re.exec(attr);
		if(m == null)
			return null;
		
		var si = m[0].substring(prefix.length);
		return si;
	}
	
	function getErrorString(name)
	{
		if(LumisPagePersonalizationStrings)
			return LumisPagePersonalizationStrings[name];
		
		return name;
	}
	
	window.LumisPagePersonalizationFrontend = 
	{
			disableHolders: function()
			{
				$(".cLumPPHolder").each(function ()
				{
					$(this).sortable("disable");
				}
				);
			},
			enableHolders: function()
			{
				$(".cLumPPHolder").each(function ()
				{
					$(this).sortable("enable");
				}
				);
			},
			disableDragability: function ()
			{
				LumisPagePersonalizationFrontend.endHighlightHolders();
				if ($.browser.msie) 
				{
					if ( $.browser.version == "6.0") 
					{
						$(".cLumPPHolder").css('height','0px');
					}
				}
				$(".cLumPPHolder").css('min-height','0px');//When disabling drag and drop, the holder will have its height decreased.
				$(".cLumPPHolder").each(function ()
				{
					$(this).sortable("disable");
				}
				);
				$("ul, li").enableSelection();
				$_pagePersonalizationInEditMode = false;
			},
			enableDragability: function ()
			{
				LumisPagePersonalizationFrontend.highlightHolders();
				if ( $.browser.msie ) 
				{
					if ( $.browser.version == "6.0") 
					{
						$(".cLumPPHolder").css('height','100px');
					}
				}
				$(".cLumPPHolder").css('min-height','100px'); //When enabling drag and drop, the holder will have its height increased. This is ignored if it is IE6.
				$("ul, li").disableSelection();
				$(".cLumPPHolder").each(function ()
				{
					$(this).sortable("enable");
				});
				$_pagePersonalizationInEditMode = true;
			},
			outsideHolder: false,
			setUp : function()
			{
				var added = new Array();
				// find all holders...
				$(".cLumPPHolder").each(function ()
				{
					$(this).sortable({ disabled: true });
				});
				$(".cLumPPHolder").each(function ()
				{
					var serviceInstanceId = getServiceInstanceIdFromClass("cLumPPH_", this);
					if(!added[serviceInstanceId])
					{
						$_serviceInstanceIds[$_serviceInstanceIds.length] = serviceInstanceId;
						$_holder[serviceInstanceId] = $("ul.cLumPPH_" + serviceInstanceId);
						$_draggable[serviceInstanceId] = $(".cLumPPDraggable_" + serviceInstanceId);
						LumisPagePersonalizationFrontend.prepareHolders(serviceInstanceId);
						LumisPagePersonalizationFrontend.prepareDraggables(serviceInstanceId);
						added[serviceInstanceId] = true;
					}
					$(this).sortable("disable");
				});
				$("ul, li").enableSelection();
				
				if ($.browser.msie) 
				{
					if ( $.browser.version == "6.0") 
					{
						$(".cLumPPHolder").css('height','0px');
					}
				}
				$(".cLumPPHolder").css('min-height','0px');//Ignored if it is IE6
				/*Sets the holder's min height as 0 px on pages load, 
				as this attribute MUST be initialized with a greater min height on the CSS. 
				If initialized as 0px on css, the holder will not be draggable.*/
			},
			
			prepareDeleteWidget : function (idObj)
			{
				var obj = document.getElementById(idObj);
				var holderId = obj.parentNode.id.substring(11);
				LumisPagePersonalizationFrontend.deleteWidget(obj,holderId);
			},
			
			prepareHolders : function(serviceInstanceId)
			{
				$(function()
				{
					$_holder[serviceInstanceId].sortable
					(
					{
						connectWith: '.cLumPPH_' + serviceInstanceId,
						placeholder: 'cLumPPPlaceholder',
						scroll: true,
						revert: true,
						cancel: '.cLumPPUndraggable',
						out: function(event, ui) 
						{
				            LumisPagePersonalizationFrontend.outsideHolder = true;
				        },
				        over: function(event, ui) 
				        {
				            LumisPagePersonalizationFrontend.outsideHolder = false;
				        },
						start: function(ev, ui)
						{
						},
						beforeStop: function(event, ui)
						{
							if (LumisPagePersonalizationFrontend.outsideHolder) 
							{
								var holderId = this.id.substring(11);
								var widget = ui.item[0];
							}
						},
						stop: function(ev, ui) 
						{
							var removing = $_removedWidget[$(ui.item[0]).attr('data-widgetId')] != undefined && $_removedWidget[$(ui.item[0]).attr('data-widgetId')] != null && $_removedWidget[$(ui.item[0]).attr('data-widgetId')];
							$_removedWidget[$(ui.item[0]).attr('data-widgetId')] = false;
							if (!removing) 
							{
								var adding = ui.item && $(ui.item[0]).hasClass("cLumPPOfferedWidget");
								if(ui.item && $(ui.item[0]).hasClass("cLumPPWidget"))
								{
									var interfaceInstanceId = ui.item[0].id;
								}
								else
								{
									var interfaceInstanceId = $(ui.item[0]).attr('data-widgetId');
								}
								var found = false;
								var iPos = 0;
								var targetHolderArray = null;
								var targetHolderId = null;
								$_holder[serviceInstanceId].each(function()
								{
								 	if(!found)
								 	{
								 		targetHolderId = $(this).attr("id");
								 		targetHolderArray = $(this).sortable('toArray');
								 		for (var i = 0; i < targetHolderArray.length; i++)
								 		{
								 			if(targetHolderArray[i] == interfaceInstanceId)
								 			{
								 				found = true;
								 				break;
								 			}
								 			iPos++;
								 		}
								 		if(!found)
								 			iPos = 0;
								 	}
								 });
								if(found)
								{
									targetHolderId = targetHolderId.substring(11);
								}
								else
								{	
									targetHolderId = ev.target.id.substring(11);
								}
								
								if (adding) 
								{
									// adding a new item
									interfaceInstanceId = interfaceInstanceId.substring(6);
									var success = false;
									try 
									{
										success = LumisPagePersonalization.addWidgetToHolder(interfaceInstanceId, targetHolderId, iPos);
									} 
									catch (e) 
									{
									}
									
									if (success) 
									{
										LumisPagePersonalizationFrontend.renderWidget(ui.item[0]);
										
										if (dragged) 
										{
											dragged.addClass("cLumPPUndraggable");
											dragged = null;
										}
									}
									else 
									{
										// TODO Verificar o código abaixo
										$("#" + interfaceInstanceId).remove();
										alert(getErrorString("STR_COULDNT_ADD_WIDGET"));
									}
								}
								else 
								{
									// moving an item
									var srcHolderId = ev.target.id.substring(11);
									var success = false;
									try 
									{
										success = LumisPagePersonalization.moveWidgetToHolder(interfaceInstanceId, srcHolderId, targetHolderId, iPos);
									} 
									catch (e) 
									{
									}
									
									if (!success) 
									{
										if (ui.sender) 
											$(ui.sender).sortable('cancel');
										else 
											$(this).sortable('cancel');
										
										alert(getErrorString("STR_COULDNT_MOVE_WIDGET"));
									}
								}
							}
						} 
					})
					.disableSelection();
				});
			},
			
			prepareDraggables : function(serviceInstanceId)
			{
				$_draggable[serviceInstanceId]
					.draggable
					(
					{
						appendTo: 'body',
						revert: 'invalid',
						opacity: 0.7,
						connectToSortable: '.cLumPPH_' + serviceInstanceId,
						cancel: '.cLumPPUndraggable',
						helper: 'clone',
						start: function(ev, ui)
						{
							dragged = $(this);
						},
						stop: function(ev, ui)
						{
						}
					});
				$("ul, li").disableSelection();
			},
			
			highlightHolders : function()
			{
				$(".cLumPPHolder").each(function()
					{
						$(this).addClass("lum-widget-holder");
						$(this).addClass("cLumPPHolderHighlight");
					}
				);
			},

			endHighlightHolders : function()
			{
				$(".cLumPPHolder").each(function()
						{
							$(this).removeClass("lum-widget-holder");
							$(this).removeClass("cLumPPHolderHighlight");
						});
			},

			renderWidget : function(container)
			{
				$(container).removeClass("cLumPPOfferedWidget");
				$(container).removeClass("ui-draggable");
				$(container).addClass("cLumPPWidget");
				$(container).attr("id",$(container).attr("data-widgetId").substring(6));
				$(container).removeAttr("data-widgetId");
				$(container).css('display', '');
				$(container).html("<div><div id=\"" + $(container).attr("id") + "_tmp_deleteButton\" style=\"text-align:right; height:1px; display:none; float:right;\"><span><a style=\"text-decoration:none;\" href=\"#\" onclick=\"LumisPagePersonalizationFrontend.prepareDeleteWidget('"+$(container).attr("id")+"');return false;\"><img style=\"border-width: 0px;\" src=\""+g_LumisRootPath +"lumis/service/pagepersonalization/images/btn_close.png\" alt=\" \" /></a></span></div><div id=\"" + $(container).attr("id") + "_tmp\" /></div>");
				
				$(container).mouseover(function() 
				{
			    	if ($_pagePersonalizationInEditMode == true)
			    		document.getElementById($(container).attr("id") + "_tmp_deleteButton").style.display = "block";
				});
				$(container).mouseout(function() 
				{
						document.getElementById($(container).attr("id") + "_tmp_deleteButton").style.display = "none";
				});
				
				$("#"+$(container).attr("id") + "_tmp_deleteButton").mouseover(function() 
				{
					LumisPagePersonalizationFrontend.disableHolders();
				});
				$("#"+$(container).attr("id") + "_tmp_deleteButton").mouseout(function() 
				{
					LumisPagePersonalizationFrontend.enableHolders();
				});

				var success = false;
				try
				{
					success = LumisPagePersonalization.renderWidget(document.getElementById($(container).attr("id") + "_tmp"), $(container).attr("id"));
				}
				catch(e) 
				{
				}
				
				if(!success)
				{
					alert(getErrorString("STR_COULDNT_RENDER_WIDGET"));
				}
			},

			deleteWidget : function(widget, holderId)
			{
				// enable the storable and draggable because of the event onmouseover 
				//when the link to delete widget was performed.
				LumisPagePersonalizationFrontend.enableHolders();

				widget.style.display = "none";
				var holderServiceInterfaceInstance = holderId;
				var success = false;
				try
				{
					success = LumisPagePersonalization.removeWidget(widget.id, holderServiceInterfaceInstance);
				}
				catch(e) 
				{
				}
				
				if(success)
				{
					LumisPagePersonalizationFrontend.enableOfferedWidget(widget.id);
					for(var i = 0; i < $_serviceInstanceIds.length; i++)
					{
						LumisPagePersonalizationFrontend.prepareDraggables($_serviceInstanceIds[i]);
					}
					
					$(".cLumPPUndraggable").each(function(index) 
					{
						if(this.id.indexOf(widget.id) >= 0)
						{
							$(this).removeClass("cLumPPUndraggable");
						}
					});
					
					$_removedWidget['li[data-widgetId="OffWid' + widget.id +'"]'] = false;
				}
				else
				{
					widget.style.display = "";
					alert(getErrorString("STR_COULDNT_REMOVE_WIDGET"));
				}
			},

			enableOfferedWidget : function(id)
			{
				$('li[data-widgetId="OffWid' + id +'"]').removeClass("cLumPPUndraggable");
			}
	};
	
	LumisPortal.bindReady(LumisPagePersonalizationFrontend.setUp, this);
})(jQuery);
