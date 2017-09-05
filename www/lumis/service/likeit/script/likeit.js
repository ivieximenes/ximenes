// $Revision: 17547 $ $Date: 2015-07-09 15:48:27 -0300 (Thu, 09 Jul 2015) $
(function($)
{
	var methods = 
	{
		init : function(options) 
		{
			var defaults = 
			{
					itemId: window.location.href,
					itemUrl: window.location.href
			},
			$this = $(this);
			
			options = $.extend(defaults,options);
			var elementsItemIds = [];
			$this.each (function(index) 
			{
				if($(this).attr("likeit-processed") == "processed")
					return;
				
				var $element = $(this);

				var elementItemUrl = $element.data('lum-url');
				
				if (elementItemUrl == "") 
				{
					var urlPathname = location.pathname;
					elementItemUrl = urlPathname.substring(urlPathname.lastIndexOf("/")+1, urlPathname.length) + location.search;
				}
				
				var lum_options = 
				{
					itemId: $element.data('lum-entityid'),
					itemName: $element.data('lum-title'),
					itemUrl: elementItemUrl,
					itemServiceInstanceId: $element.data('lum-serviceinstanceid')
				};
				
				var inArray = $.inArray(lum_options.itemId, elementsItemIds);
				
				if(inArray == -1)
				{
					var element_index = 
					{
							index: index
					}
					elementsItemIds = elementsItemIds.concat(lum_options.itemId);
					$element.data('lum-likeit-options',$.extend({}, options, lum_options, $element.data('lum-likeit-options'), element_index));
				}
				else
				{
					var element_index = 
					{
							index: inArray
					}
					$element.data('lum-likeit-options',$.extend({}, options, lum_options, $element.data('lum-likeit-options'), element_index));
				}
				$element.attr('data-lum-entityid', $element.data('lum-likeit-options').itemId);
				$element.likeIt("renderSocialData");
			});

			if (elementsItemIds.length > 0)
			{
				return $.getJSON(g_LumisRoot_href+"lumis/service/likeit/rest/likes-items/"+lum_likeItServiceInstanceId,
						$.param({itemIds:elementsItemIds}, true),
						function(data)
						{
							$this.each(function() 
							{
								if($(this).attr("likeit-processed") == "processed")
									return;
								$(this).attr("likeit-processed", "processed");
								
								var $element = $(this);
								
								$element.likeIt("renderLikeItHeader", data);

								var len = data.items.length;
								for (var i = 0; i < len; i++)
								{
									if($(this).attr("data-lum-entityid") == data.items[i].itemId)
											$element.likeIt("renderLikes", data.items[i].likes.items);
								}
								
								$this.find(".lum-likeit-header").removeClass("lum-loading-element");
								if ($this.find(".lum-loading-element").length == 0)
									$this.find(".lum-social-data").removeClass("lum-loading");
							});
						});
			}
		},
		
		renderSocialData: function()
		{
			var $this = $(this);
			if($this.data('lum-likeit-options').renderSocialData)
				$this.data('lum-likeit-options').renderSocialData.apply($this);
			else
			{
				var elementSocialData = $this.find("aside.lum-social-data");
				if(elementSocialData.length == 0)
				{
					elementSocialData = $("<aside></aside>").addClass('lum-social-data lum-loading');
					elementSocialData.html("<header class=\"lum-social-data-header\"><ul class=\"lum-social-data-header-list\"></ul></header><div class=\"lum-social-data-block\"></div>");
					$this.append(elementSocialData);
				}
				else 
				{
					elementSocialData.find("header.lum-social-data-header ul.lum-social-data-header-list li.lum-social-data-header-list-item").last().removeClass("lum-last");
				}
				
				var elementSocialDataHeaderList = elementSocialData.find("header.lum-social-data-header ul.lum-social-data-header-list");
				
				var likeItHeader = elementSocialDataHeaderList.find("li.lum-likeit-header");
				if(likeItHeader.length == 0)
				{				
					likeItHeader = $("<li></li>").addClass('lum-likeit-header lum-social-data-header-list-item lum-loading-element lum-last');
					elementSocialDataHeaderList.append(likeItHeader);
				}
				if(elementSocialDataHeaderList.find("li.lum-social-data-header-list-item").length == 1)
					likeItHeader.addClass('lum-first');
			}
		},
		
		renderLikeItHeader: function(data)
		{
			var $this = $(this);
			if($this.data('lum-likeit-options').renderLikeItHeader)
				$this.data('lum-likeit-options').renderLikeItHeader.apply($this, data);
			else
			{
				var likeItHeader = $this.find(".lum-likeit-header");
				likeItHeader.empty();
				
				var likeLink = likeItHeader.find(".lum-likeit-like-link");
				if(likeLink.size() == 0)
				{
					likeLink = $("<a href=\"#\"></a>").addClass('lum-likeit-like-link');
					//var likeIco = $("<span/>").addClass('lum-likeit-like-ico');
					likeItHeader.append(likeLink);
				}
				
				var notLikeLink = likeItHeader.find(".lum-likeit-not-like-link");
				if(notLikeLink.size() == 0)
				{
					notLikeLink = $("<a href=\"#\"></a>").addClass('lum-likeit-not-like-link');
					//var notLikeIco = $("<span/>").addClass('lum-likeit-not-like-ico');
					likeItHeader.append(notLikeLink);
				}
			}
			
			$this.find(".lum-likeit-like-link").click(function() 
			{
				
				$.ajax(g_LumisRoot_href+"lumis/service/likeit/rest/likes",
						{
							type: "POST",
							contentType: "application/json",
							data:JSON.stringify(
									{
										itemId:$this.data('lum-likeit-options').itemId,
										itemName:$this.data('lum-likeit-options').itemName,
										itemUrl:$this.data('lum-likeit-options').itemUrl,
										itemServiceInstanceId:$this.data('lum-likeit-options').itemServiceInstanceId,
										serviceInstanceId:lum_likeItServiceInstanceId
									}),
							success: function()
								{
									$.getJSON(g_LumisRoot_href+"lumis/service/likeit/rest/likes-items/"+lum_likeItServiceInstanceId,
										$.param({itemIds:[$this.data('lum-likeit-options').itemId]}, true),
											function(data)
											{
												var $equalElements = $("[data-lum-entityid=\"" + $this.data('lum-likeit-options').itemId + "\"]");
												$equalElements.each(function() 
												{
													var $thisElement = $(this)
													$thisElement.addClass('lum-likeit-like');
													var len = data.items.length;
													for (var i = 0; i < len; i++)
													{
														$thisElement.likeIt("renderLikes", data.items[i].likes.items);
													}
												});
											}
									);
								}
						}
					);
				
				return false;
			});

			$this.find(".lum-likeit-not-like-link").click(function() 
			{
				$.ajax(g_LumisRoot_href+"lumis/service/likeit/rest/likes/"+$this.data('likeId'),
					{
						type: "DELETE",
						success: function()
						{
						$.getJSON(g_LumisRoot_href+"lumis/service/likeit/rest/likes-items/"+lum_likeItServiceInstanceId,
							$.param({itemIds:[$this.data('lum-likeit-options').itemId]}, true),
									function(data)
									{
										var $equalElements = $("[data-lum-entityid=\"" + $this.data('lum-likeit-options').itemId + "\"]");
										$equalElements.each(function() 
										{
											var $thisElement = $(this)
											$thisElement.removeClass('lum-likeit-like');

											var len = data.items.length;
											for (var i = 0; i < len; i++)
											{
												$thisElement.likeIt("renderLikes", data.items[i].likes.items);
											}
										});
									}
							);
						}
				});
				return false;
			});
		},
		
		renderLikes : function(data)
		{
			var $this = $(this);
			if($this.data('lum-likeit-options').renderLikes)
				$this.data('lum-likeit-options').renderLikes.apply($this, data);
			else
			{
				var likesCount = data.length;
				if (likesCount > 0)
				{
					var likeItHeader = $this.find(".lum-likeit-header");
					
					var likesCounterSpan = likeItHeader.find(".lum-likeit-likes-counter");
					if(likesCounterSpan.length == 0)
					{
						likesCounterSpan = $("<span></span>").addClass('lum-likeit-likes-counter');
						likeItHeader.append(likesCounterSpan);
					}
					likesCounterSpan.empty();
					
					var likeUsersBlock = likeItHeader.find(".lum-likeit-like-users-block");
					if(likeUsersBlock.length == 0)
					{
						likeUsersBlock = $("<div></div>").addClass('lum-likeit-like-users-block');
						likeItHeader.append(likeUsersBlock);
						likeUsersBlock.hide();
					}
					likeUsersBlock.empty();
					
					likeUsersBlock.append("<ul class=\"lum-likeit-like-users-list\"/>");
					
					$.each(data, function()
					{
						$this.likeIt("renderLike", this);
					});
					
					var likeUsersBlockTitle = $("<div/>").addClass('lum-likeit-like-users-block-title');
					
					var likesCount = data.length;
					likesCounterSpan.text(likesCount);
					if(likesCount == 1)
					{
						likeUsersBlockTitle.text(STR_ONE_PERSON_LIKED);
						likeUsersBlock.prepend(likeUsersBlockTitle);
					}
					else if(likesCount > 1)
					{
						likeUsersBlockTitle.text(likesCount + STR_PEOPLE_LIKED);
						likeUsersBlock.prepend(likeUsersBlockTitle);
					}
					
					var timer;
					likesCounterSpan.mouseenter(function() 
					{
						clearTimeout(timer);
						likeUsersBlock.fadeIn(200);
					});

					$(likesCounterSpan).mouseleave(function() 
					{
						timer = setTimeout(function(){likeUsersBlock.fadeOut(200);},100);
					});

					$(likeUsersBlock).mouseenter(function() 
					{
						clearTimeout(timer);
					});

					$(likeUsersBlock).mouseleave(function() 
					{
						timer = setTimeout(function(){likeUsersBlock.hide();},100);
					});
				}
				else 
				{
					var likeItHeader = $this.find(".lum-likeit-header");
					
					var likesCounterSpan = likeItHeader.find(".lum-likeit-likes-counter");
					if(likesCounterSpan.length > 0)
					{
						likesCounterSpan.remove();
					}
					
					var likeUsersBlock = likeItHeader.find(".lum-likeit-like-users-block");
					if(likeUsersBlock.length > 0)
					{
						likeUsersBlock.remove();
					}
				}
			}
		},
		
		renderLike : function(like) 
		{
			var $this = $(this);
			if($this.data('lum-likeit-options').renderLike)
				$this.data('lum-likeit-options').renderLike.apply($this, like);
			else
			{
				var likeItHeader = $this.find(".lum-likeit-header");
				
				if(like.canDelete)
				{
					var likeSpan = $("<li class=\"lum-likeit-like-user\">"+STR_CURRENT_USER+"</li>");
					likeItHeader.find(".lum-likeit-like-users-list").prepend(likeSpan);
					$this.addClass('lum-likeit-like');
					$this.data('likeId',like.id);
				}
				else
				{
					var likeSpan = $("<li class=\"lum-likeit-like-user\">"+like.user.name+"</li>");
					likeItHeader.find(".lum-likeit-like-users-list").append(likeSpan);
				}
			}
		}
	}
	
	$.fn.likeIt = function(method) 
	{
	    // Method calling logic
	    if (methods[method]) 
		{
	      return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
	    }
		else if (typeof method === 'object' || ! method) 
		{
	    	return methods.init.apply(this, arguments);
	    }
		else 
		{
	      $.error('Method ' +  method + ' does not exist on likeIt');
	    }    
  };
})(jQuery);
