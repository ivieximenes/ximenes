// $Revision: 17547 $ $Date: 2015-07-09 15:48:27 -0300 (Thu, 09 Jul 2015) $
(function( $ )
{
	var methods = 
	{
		init : function(options) 
		{ 
			var defaults =
			{
				itemId: window.location.href,
				itemUrl: window.location.href,
				defaultLimit: 3,
				limit: 3
			},
			$this = $(this);
			
			options = $.extend(defaults,options);
			var elementsItemIds = [];
			$this.each (function(index)
			{
				if($(this).attr("commentit-processed") == "processed")
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
					var element_index = { index: index };
					elementsItemIds = elementsItemIds.concat(lum_options.itemId);
					$element.data('lum-commentit-options',$.extend({}, options, lum_options, $element.data('lum-commentit-options'), element_index));
				}
				else
				{
					var element_index = { index: inArray };
					$element.data('lum-commentit-options',$.extend({}, options, lum_options, $element.data('lum-commentit-options'), element_index));
				}
				
				$element.commentIt("renderSocialData");
			});
			
			return $.getJSON(g_LumisRoot_href+"lumis/service/commentit/rest/comments-items/"+lum_commentItServiceInstanceId,
				$.param({
					limit:options.limit,
					itemIds:elementsItemIds
					}, true),
				function(data)
				{
					$this.each(function() 
					{
						if($(this).attr("commentit-processed") == "processed")
							return;
						$(this).attr("commentit-processed", "processed");
						
						var $element = $(this);
						
						$element.commentIt("renderCommentItBlock", data);

						var len = data.items.length;
						for (var i = 0; i < len; i++)
						{
							if($(this).attr("data-lum-entityid") == data.items[i].itemId)
									$element.commentIt("renderComments", data.items[i].comments.items, data.items[i].commentsCounter);
						}
						
						$element.find(".lum-commentit-header").removeClass("lum-loading-element");
						$element.find(".lum-commentit-block").removeClass("lum-loading-element");
						if ($element.find(".lum-loading-element").length == 0)
							$element.find(".lum-social-data").removeClass("lum-loading");
					});
				}
			);
		},
		
		renderSocialData : function()
		{
			var $this = $(this);
			if($this.data('lum-commentit-options').renderSocialData)
				$this.data('lum-commentit-options').renderSocialData.apply($this);
			else
			{
				var elementSocialData = $this.find(".lum-social-data");
				if(elementSocialData.length == 0)
				{
					elementSocialData = $("<aside></aside>").addClass('lum-social-data lum-loading');
					elementSocialData.html("<header class=\"lum-social-data-header\"><ul class=\"lum-social-data-header-list\"></ul></header><div class=\"lum-social-data-block\"></div>");
					$this.append(elementSocialData);
				}
				else 
					elementSocialData.find(".lum-social-data-header-list-item").last().removeClass("lum-last");
				
				var commentItHeader = elementSocialData.find(".lum-commentit-header");
				if(commentItHeader.length == 0)
				{
					commentItHeader = $("<li></li>").addClass('lum-commentit-header lum-social-data-header-list-item lum-loading-element lum-last');
					elementSocialData.find(".lum-social-data-header-list").append(commentItHeader);
				}
				if(elementSocialData.find(".lum-social-data-header-list-item").length == 1)
					commentItHeader.addClass('lum-first');
				
				var commentItBlock = elementSocialData.find(".lum-commentit-block");
				if(commentItBlock.length == 0)
				{
					commentItBlock = $("<div></div>").addClass('lum-commentit-block lum-loading-element');
					elementSocialData.find(".lum-social-data-block").append(commentItBlock);
				}
			}
		},
		
		renderCommentItBlock : function(data)
		{
			var $this = $(this);
			if($this.data('lum-commentit-options').renderCommentItBlock)
				$this.data('lum-commentit-options').renderCommentItBlock.apply($this, data);
			else
			{
				var commentItBlock = $this.find(".lum-commentit-block");
				commentItBlock.empty();
				
				var commentsBlock = commentItBlock.find(".lum-commentit-comments-block");
				if(commentsBlock.length == 0)
				{
					commentsBlock = $("<div></div>").addClass('lum-commentit-comments-block');
					commentItBlock.append(commentsBlock);
				}

				var textarea = commentItBlock.find(".lum-commentit-comment-input");
				if(textarea.size() == 0)
				{
					textarea = $("<textarea placeholder=\"" + STR_GIVE_A_COMMENT + "\"></textarea>").addClass('lum-commentit-comment-input')
					textarea.val(""); // workaround for IE10 bug that mixes placeholder and value
					var textareadiv = $("<div class=\"lum-commentit-comment-input-wrapper\"></div>");
					commentItBlock.append(textareadiv.append(textarea));
				}
				
				textarea.keyup(function()
				{
					while (this.clientHeight < this.scrollHeight && $(this).val() != '')
						$(this).height($(this).height()+(this.scrollHeight - this.clientHeight));
				});
			}
			
			$this.find(".lum-commentit-comment-input").bind('keypress', function(e)
			{
				if(e.which == 13)
				{
					var message = $(this).val();
					if(message && $.trim(message).length > 0)
					{
						$(this).val('');
						
						$.ajax(g_LumisRoot_href+"lumis/service/commentit/rest/comments",
							{
								type: 'POST',
								contentType: "application/json",
								data: JSON.stringify(
										{
											itemId:$this.data('lum-commentit-options').itemId,
											itemName:$this.data('lum-commentit-options').itemName,
											itemUrl:$this.data('lum-commentit-options').itemUrl,
											itemServiceInstanceId: $this.data('lum-serviceinstanceid').itemServiceInstanceId,
											commentText:message,
											serviceInstanceId:lum_commentItServiceInstanceId
										}),
							success: function()
							{
								$.getJSON(g_LumisRoot_href+"lumis/service/commentit/rest/comments-items/"+lum_commentItServiceInstanceId,
									$.param({
										limit: $this.data('lum-commentit-options').limit + 1,
										itemIds:[$this.data('lum-commentit-options').itemId]
										}, true),
									function(data)
									{
										var $equalElements = $("[data-lum-entityid=\"" + $this.data('lum-commentit-options').itemId + "\"]");
										$equalElements.each(function()
										{
											var $thisElement = $(this);

											var len = data.items.length;
											for (var i = 0; i < len; i++)
											{
												if (data.items[i].commentsCounter >= $thisElement.data('lum-commentit-options').limit)
													$thisElement.data('lum-commentit-options').limit++;
												
												if($(this).attr("data-lum-entityid") == data.items[i].itemId)
													$thisElement.commentIt("renderComments", data.items[i].comments.items, data.items[i].commentsCounter);
											}
										});
									});
								}
							}
						);
					}
					return false;
				}
			});
		},
		
		renderComments : function(data, commentsCounter)
		{
			var $this = $(this);
			if($this.data('lum-commentit-options').renderComments)
				$this.data('lum-commentit-options').renderComments.apply($this, data);
			else
			{
				var commentItHeader = $this.find(".lum-commentit-header");
				commentItHeader.empty();
				
				var commentsBlock = $this.find(".lum-commentit-comments-block");
				commentsBlock.empty();
				
				var usersCommentsBlock = $("<div></div>").addClass('lum-commentit-users-comments-block');
				commentsBlock.prepend(usersCommentsBlock);

				
				$.each(data, function()
				{
					$this.commentIt("renderComment", this);
				});
				
				var commentsCounterSpan = $("<span/>").addClass('lum-commentit-comments-counter');
				if(commentsCounter == 1)
				{
					commentsCounterSpan.text(commentsCounter + " " + STR_COMMENT);
				}
				else if(commentsCounter > 1)
				{
					commentsCounterSpan.text(commentsCounter + " " + STR_COMMENTS);
				}
				else
				{
					commentsCounterSpan.text(STR_NO_COMMENTS);
				}
				commentItHeader.append(commentsCounterSpan);
				
				if (commentsCounter > $this.data('lum-commentit-options').limit)
				{
					var commentShowMoreComments = $("<a href=\"#\">"+ STR_SHOW_MORE_COMMENTS +"</a>").addClass('lum-commentit-show-more-comments');
					commentsBlock.prepend(commentShowMoreComments);
				}
			}
			
			var commentShowMoreComments = $this.find('.lum-commentit-show-more-comments');
			if(commentShowMoreComments.length > 0)
			{
				commentShowMoreComments.click(function()
				{
					$.getJSON(g_LumisRoot_href+"lumis/service/commentit/rest/comments-items/"+lum_commentItServiceInstanceId,
						$.param({
							limit: $this.data('lum-commentit-options').limit + 5,
							itemIds:[$this.data('lum-commentit-options').itemId]
							}, true),
						function(data)
						{
							var $equalElements = $("[data-lum-entityid=\"" + $this.data('lum-commentit-options').itemId + "\"]");
							$equalElements.each(function() 
							{
								var $thisElement = $(this);
								
								var len = data.items.length;
								for (var i = 0; i < len; i++)
								{
									if (data.items[i].commentsCounter > $thisElement.data('lum-commentit-options').limit + 5)
									{
										$thisElement.data('lum-commentit-options').limit = $thisElement.data('lum-commentit-options').limit + 5;
									}
									else
									{
										$thisElement.data('lum-commentit-options').limit = data.items[i].commentsCounter;
									}
								
									if($(this).attr("data-lum-entityid") == data.items[i].itemId)
									{
										$thisElement.commentIt("renderComments", data.items[i].comments.items, data.items[i].commentsCounter);
									}
								}
							});
						}
					);
					return false;
				});
			}
		},
		
		renderComment : function(comment)
		{
			var $this = $(this);
			if($this.data('lum-commentit-options').renderComment)
				$this.data('lum-commentit-options').renderComment.apply($this, data);
			else
			{
				var commentDiv = $("<div class=\"lum-commentit-comment\"></div>");
				$this.find(".lum-commentit-users-comments-block").append(commentDiv);
				
				var renderComment = $this.data('lum-commentit-options').renderComment;
				if(renderComment)
					renderComment(comment, commentDiv);
				else
				{
					var html = "<div class=\"lum-commentit-comment-header\">";
					html += "<span class=\"lum-commentit-user-image\"><img alt=\" \" src=\"" + comment.user.profileImageHref + "\"/></span>" + 
							"<span class=\"lum-commentit-comment-information\">"+ STR_COMMENT_BY_USER +" " +
							"<span class=\"lum-user\">"+ comment.user.name + "</span> " +
							STR_COMMENT_ON_DATE + " <time datetime=\"" + comment.commentDate.iso + "\">" + 
							comment.commentDate.formatted + "</time></span>";
					if(comment.canDelete)
						html += "<a class=\"lum-commentit-comment-delete\">"+ STR_REMOVE_COMMENT + "</a>";
					html += "</div>";
					html += "<div class=\"lum-commentit-comment-body\">";
					html += "<span class=\"lum-commentit-comment-text\"></span>";
					html += "</div>";
					commentDiv.html(html);
					commentDiv.find(".lum-commentit-comment-text").text(comment.commentText);
				};
			}
			
			if(comment.canDelete)
			{
				$this.find(".lum-commentit-comment").last().find(".lum-commentit-comment-delete").click(function()
				{
					if(confirm(STR_REMOVE_COMMENT_QUESTION))
					{
						$.ajax(g_LumisRoot_href+"lumis/service/commentit/rest/comments/"+comment.id,
								{
									type: "DELETE",
									success: function()
									{
										var limit = $this.data('lum-commentit-options').limit-1;
										if (limit < 1)
										{
											limit = $this.data('lum-commentit-options').defaultLimit;
										}
										$.getJSON(g_LumisRoot_href+"lumis/service/commentit/rest/comments-items/"+lum_commentItServiceInstanceId,
												$.param({
													limit: limit,
													itemIds:[$this.data('lum-commentit-options').itemId]
													}, true),
											function(data)
											{
												var $equalElements = $("[data-lum-entityid=\"" + $this.data('lum-commentit-options').itemId + "\"]");
												$equalElements.each(function()
												{
													var $thisElement = $(this)
													$thisElement.data('lum-commentit-options').limit = limit;
													
													var len = data.items.length;
													for (var i = 0; i < len; i++)
													{
														if($(this).attr("data-lum-entityid") == data.items[i].itemId)
															$thisElement.commentIt("renderComments", data.items[i].comments.items, data.items[i].commentsCounter);
													}
												});
											}
										);
									}
								}
						);
					}
					return false;
				});
			}
		}
	}
	
	$.fn.commentIt = function( method )
	{
		// Method calling logic
		if ( methods[method] )
		{
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		}
		else if ( typeof method === 'object' || ! method )
		{
			return methods.init.apply( this, arguments );
		}
		else
		{
			$.error( 'Method ' +  method + ' does not exist on jQuery.commentIt' );
		}
	};
})( jQuery );