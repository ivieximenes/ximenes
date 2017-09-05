// $Revision: 16074 $ $Date: 2013-11-27 15:48:29 -0200 (Wed, 27 Nov 2013) $
LumisStructureEditor = function($, window)
{
	var CONST_STATE_IDLE = 0;
	var CONST_STATE_ADD_SELECT_TYPE = 1;
	var CONST_STATE_ADD_CHANNEL_SET_TITLE = 2;
	var CONST_STATE_ADD_CHANNEL_TEMPLATE_SET_TITLE = 3;
	var CONST_STATE_ADD_PAGE_SET_TITLE = 4;
	var CONST_STATE_ADD_PAGE_TEMPLATE_SET_TITLE = 5;
	var CONST_STATE_ADD_SERVICE_INSTANCE_SELECT_SERVICE = 6;
	var CONST_STATE_ADD_SERVICE_INSTANCE_SET_TITLE = 7;
	var CONST_STATE_CHANGE_TITLE = 8;
	
	var CONST_VK_UP = 38;		// up
	var CONST_VK_DOWN = 40;		// down
	var CONST_VK_LEFT = 37;		// left
	var CONST_VK_RIGHT = 39;	// right
	var CONST_VK_RENAME = 13;	// enter
	var CONST_VK_DELETE = 46;	// delete
	var CONST_VK_ADD = 45;		// insert
	var CONST_VK_CONFIRM = 13;	// enter
	
	this.initTree = initTree;
	this.initObject = initObject;
	
	var _focusItem;
	var _curObjects = new Array();
	var _objectsByParentMap = new Array();
	var _rootChannel;
	var _state = CONST_STATE_IDLE;
	var _newIdCount = 0;
	var _actions = new Array();
	var _objSettingTitleId = null;
	var _curSelectedObject = null;
	var _curSelectedService = null;
	var _curSelectedAddOption = null;
	
	var _objectTypesOrder = [];
	_objectTypesOrder["serviceinstance"] 	= 0;
	_objectTypesOrder["page"] 				= 1;
	_objectTypesOrder["pagetemplate"] 		= 2;
	_objectTypesOrder["channel"] 			= 3;
	_objectTypesOrder["channeltemplate"] 	= 4;
	
	/**
	 * Service instance class.
	 */
	function ServiceInstance(id, name, parentChannelId, serviceId){
		var _isChanged = false;
		var _isNew = /new-\d+/.test(id);
		var _name = name;
		var _parentChannelId = parentChannelId;
		var _serviceId = serviceId;
		var _domElement = $("#elem_"+id);
		var _type = "serviceinstance";
		var _movePositions = {};
		
		this.setName = function(name){
			if(_name != name)
				_setChanged();

			_name = name;
		};
		
		this.isNew = function(){
			return _isNew;
		};
		
		this.setParentChannelId = function(parentChannelId){
			if(parentChannelId != _parentChannelId)
				_setChanged();
			_parentChannelId = parentChannelId;
		};
		
		function _setChanged(){
			if(!_isNew && !_isChanged){
				_isChanged = true;
				_addAction({type: "update", key: id});
			}
		}
		
		this.getId = function(){
			return id;
		};
		
		this.toJSON = function(){
			return { 
				id: id,
				name: _name,
				type: _type,
				parentId: _parentChannelId,
				isNew: _isNew,
				isChanged: _isChanged,
				serviceId: _serviceId
			};
		};
		
		this.getDomElement = function(){
			return _domElement;
		};
		
		this.getType = function(){
			return _type;
		};
		
		this.setServiceId = function(serviceId){
			_serviceId = serviceId;
			// doesn't need to mark as changed since only new service instances will invoke this
		};
		
		this.getParentId = function(){
			return _parentChannelId;
		};
		
		this.getTypePosition = function(){
			return _objectTypesOrder[this.getType()];
		};
		
		this.getName = function(){
			return _name;
		};
		
		this.move = function(position){
			switch(position){
				case "up":
					var position = _movePositions.up;
					if(position == undefined || position == null){
						throw "Cannot move " + this.getId() + " up";
					}
					_executeMove(this, position);
					break;
					
				case "down":
					var position = _movePositions.down;
					if(position == undefined || position == null){
						throw "Cannot move " + this.getId() + " down";
					}
					_executeMove(this, position);
					break;
					
				default:
					throw "Unrecognized move direction " + position;
			}
		};
		
		this.updateActions = function(){
			_movePositions = {};
			
			var previousPosition = _findPreviousPosition(this);
			if(previousPosition != null){
				_movePositions.up = previousPosition;
			}
			
			var nextPosition = _findNextPosition(this);
			if(nextPosition != null){
				_movePositions.down = nextPosition;
			}
			
			if(_movePositions.up)
				this.getDomElement().find("> span.actions > span.move-up").show();
			else
				this.getDomElement().find("> span.actions > span.move-up").hide();

			
			if(_movePositions.down)
				this.getDomElement().find("> span.actions > span.move-down").show();
			else
				this.getDomElement().find("> span.actions > span.move-down").hide();
			
			
			this.getDomElement().find("> span.actions > span.add").hide();
			this.getDomElement().find("> span.actions > span.remove").show();
		};
		
		this.isSortable = function(){
			return false;
		};
		
		this.getParent = function(){
			return _getObject(this.getParentId());
		};
		
		this.getPreviousSibling = function(){
			return _getPreviousSibling(this);
		};
		
		this.getNextSibling = function(){
			return _getNextSibling(this);
		};
	}
	
	/**
	 * Page class.
	 */
	function Page(id, name, parentChannelId, position, isTemplate){
		var _isChanged = false;
		var _isNew = /new-\d+/.test(id);
		var _name = name;
		var _parentChannelId = parentChannelId;
		var _position = position;
		var _domElement = $("#elem_"+id);
		var _type = "page";
		var _movePositions = {};
		
		this.setName = function(name){
			if(_name != name)
				_setChanged();
			_name = name;
		};
		
		this.setParentChannelId = function(parentChannelId){
			if(parentChannelId != _parentChannelId)
				_setChanged();
			_parentChannelId = parentChannelId;
		};
		
		this.setPosition = function(position){
			if(position != _position)
				_setChanged();
			_position = position;
		};
		
		function _setChanged(){
			if(!_isNew && !_isChanged)
			{
				_isChanged = true;
				_addAction({type: "update", key: id});
			}
		}
		
		this.getId = function(){
			return id;
		};
		
		this.toJSON = function(){
			return {
				id: id,
				name: _name,
				position: _position,
				parentId: _parentChannelId,
				isNew: _isNew,
				isChanged: _isChanged,
				isTemplate : isTemplate,
				type: _type
			};
		};
		
		this.getDomElement = function(){
			return _domElement;
		};
		
		this.getType = function(){
			return _type;
		};
		
		this.isTemplate = function(){
			return isTemplate;
		};
		
		this.isNew = function(){
			return _isNew;
		};
		
		this.getParentId = function(){
			return _parentChannelId;
		};
		
		this.getTypePosition = function(){
			return _objectTypesOrder[this.getType() + (this.isTemplate() ? "template" : "")];
		};
		
		this.getName = function(){
			return _name;
		};
		
		this.isSortable = function(){
			return true;
		};
		
		this.getParent = function(){
			return _getObject(this.getParentId());
		};
		
		this.getPreviousSibling = function(){
			return _getPreviousSibling(this);
		};
		
		this.getNextSibling = function(){
			return _getNextSibling(this);
		};
		
		this.move = function(position){
			switch(position){
			case "up":
				var position = _movePositions.up;
				if(position == undefined || position == null){
					throw "Cannot move " + this.getId() + " up";
				}
				_executeMove(this, position);
				break;
				
			case "down":
				var position = _movePositions.down;
				if(position == undefined || position == null){
					throw "Cannot move " + this.getId() + " down";
				}
				_executeMove(this, position);
				break;
				
			default:
				throw "Unrecognizewd move direction " + position;
			}
		};
		
		this.updateActions = function(){
			_movePositions = {};
			
			var previousPosition = _findPreviousPosition(this);
			if(previousPosition != null){
				_movePositions.up = previousPosition;
			}
			
			var nextPosition = _findNextPosition(this);
			if(nextPosition != null){
				_movePositions.down = nextPosition;
			}
			
			if(_movePositions.up)
				this.getDomElement().find("> span.actions > span.move-up").show();
			else
				this.getDomElement().find("> span.actions > span.move-up").hide();
			
			
			if(_movePositions.down)
				this.getDomElement().find("> span.actions > span.move-down").show();
			else
				this.getDomElement().find("> span.actions > span.move-down").hide();
			
			
			this.getDomElement().find("> span.actions > span.add").hide();
			this.getDomElement().find("> span.actions > span.remove").show();
		};
	}
	
	
	/**
	 * Channel class.
	 */
	function Channel(id, name, parentChannelId, position, isTemplate){
		var _isChanged = false;
		var _isNew = /new-\d+/.test(id);
		var _name = name;
		var _parentChannelId = parentChannelId;
		var _position = position;
		var _domElement = $("#elem_"+id);
		var _type = "channel";
		var _movePositions = {};
		
		this.setName = function(name){
			if(_name != name)
				_setChanged();
			_name = name;
		};
		
		this.setParentChannelId = function(parentChannelId){
			if(parentChannelId != _parentChannelId)
				_setChanged();
			_parentChannelId = parentChannelId;
		};
		
		this.setPosition = function(position){
			if(position != _position)
				_setChanged();
			_position = position;
		};
		
		function _setChanged(){
			if(!_isNew && !_isChanged)
			{
				_isChanged = true;
				_addAction({type: "update", key: id});
			}
		}
		
		this.getId = function(){
			return id;
		};
		
		this.isNew = function(){
			return _isNew;
		};
		
		this.getChildren = function(){
			return (_objectsByParentMap[id] != undefined && _objectsByParentMap[id] != null) ? _objectsByParentMap[id] : null;
		};
		
		this.getTypePosition = function(){
			return _objectTypesOrder[this.getType() + (this.isTemplate() ? "template" : "")];
		};
		
		this.getName = function(){
			return _name;
		};
		
		this.toJSON = function(){
			return {
				id: id,
				name: _name,
				position: _position,
				parentId: _parentChannelId,
				isTemplate : isTemplate,
				isNew: _isNew,
				isChanged: _isChanged,
				type: _type,
				children: this.getChildren()
			};
		};
		
		/**
		 * Toggles the visibility of this channel's children (open / close this channel).
		 */
		this.toggleVisibility = function(){
			_domElement.toggleClass("channel-closed").toggleClass("channel-opened");
			
			// if didn't load this channel's children yet, load them now
			if($("#elem_"+id+">ul").length==0){
				var renderedChildren;
				if(this.isNew()){
					renderedChildren = $("<ul></ul>");
				}
				else{
					var objectJson = readObjectTree(id);
					if(objectJson && objectJson.children){
						renderedChildren = $.tmpl($("#render-channel-children-template"), objectJson);
					}
					else{
						renderedChildren = $("<ul></ul>");
					}
				}
				$("#elem_"+id).append(renderedChildren);
				
				if(objectJson && objectJson.children){
		    		for(var i in objectJson.children){
		    			var createdChild = _createObject(objectJson.children[i]);
		    			if(_objectsByParentMap[id] == undefined || _objectsByParentMap[id] == null)
		    				_objectsByParentMap[id] = new Array();
		    			_objectsByParentMap[id].push(createdChild);
		    		}
		    	}
			}
			_updateAllActions();
		}
		
		this.isClosed = function(){
			return _domElement.hasClass("channel-closed");
		}
		
		this.isOpened = function(){
			return !this.isClosed();
		}
		
		this.isSortable = function(){
			return true;
		};
		
		this.getParent = function(){
			var parentId = this.getParentId();
			if(parentId == null)
				return null;
			
			return _getObject(parentId);
		};
		
		this.getPreviousSibling = function(){
			return _getPreviousSibling(this);
		};
		
		this.getNextSibling = function(){
			return _getNextSibling(this);
		};
		
		this.isAncestralOf = function(obj){
			var children = this.getChildren();
			if(children != null){
				for(var i in children){
					var child = children[i];
					if(child == obj)
						return true;
					
					if(child.getType() == "channel"){
						if(child.isAncestralOf(obj)){
							return true;
						}
					}
				}
			}
			
			return false;
		};
		
		this.move = function(position){
			switch(position){
			case "up":
				var position = _movePositions.up;
				if(position == undefined || position == null){
					throw "Cannot move " + this.getId() + " up";
				}
				_executeMove(this, position);
				break;
				
			case "down":
				var position = _movePositions.down;
				if(position == undefined || position == null){
					throw "Cannot move " + this.getId() + " down";
				}
				_executeMove(this, position);
				break;
				
			default:
				throw "Unrecognized move direction " + position;
			}
		};
		
		this.updateActions = function(){
			_movePositions = {};
			
			if(_rootChannel != this){
				var previousPosition = _findPreviousPosition(this);
				if(previousPosition != null){
					_movePositions.up = previousPosition;
				}
				
				var nextPosition = _findNextPosition(this);
				if(nextPosition != null){
					_movePositions.down = nextPosition;
				}
				
				if(_movePositions.up)
					this.getDomElement().find("> span.actions > span.move-up").show();
				else
					this.getDomElement().find("> span.actions > span.move-up").hide();
				
				
				if(_movePositions.down)
					this.getDomElement().find("> span.actions > span.move-down").show();
				else
					this.getDomElement().find("> span.actions > span.move-down").hide();
			}
			else{
				this.getDomElement().find("> span.actions > span.move-up").hide();
				this.getDomElement().find("> span.actions > span.move-down").hide();
			}
			
			this.getDomElement().find("> span.actions > span.add").show();
			
			if(_rootChannel != this){
				this.getDomElement().find("> span.actions > span.remove").show();
			}
			else{
				this.getDomElement().find("> span.actions > span.remove").hide();
			}
		};
		
		/**
		 * Removes a child object from this channel (do not remove DOM element).
		 */
		this.removeChild = function(child){
			var array = _objectsByParentMap[this.getId()];
			_objectsByParentMap[this.getId()] = _removeItemFromArray(child, array);
		};
		
		/**
		 * Adds a child object in this channel (do not add the DOM element).
		 */
		this.addChild = function(child, baseObject, before){
			var array = _objectsByParentMap[this.getId()];
			var newArray = [];
			var hasBase = baseObject != undefined;
			if(!hasBase){
				newArray.push(child);
			}
			
			for(var i in array){
				var curChild = array[i];
				if(hasBase){
					if(curChild == baseObject){
						if(before){
							newArray.push(child);
							newArray.push(curChild);
						}
						else{
							newArray.push(curChild);
							newArray.push(child);
						}
					}
					else{
						newArray.push(curChild);
					}
				}
				else{
					newArray.push(curChild);
				}
			}
			
			_objectsByParentMap[this.getId()] = newArray;
		}
		
		/**
		 * Creates an add entry to allow user to select the type of object he wants.
		 */
		this.createAddEntry = function(){
			_checkState(CONST_STATE_IDLE);
			
			if(this.isClosed())
				this.toggleVisibility();
			
			var renderedAddEntrySelectTypeElem = $.tmpl($("#render-add-entry-select-type-template"));
			
			var lis = $("#elem_"+id+">ul>li");
			if(lis.length > 0)
				$(lis[0]).before(renderedAddEntrySelectTypeElem);
			else
				$("#elem_"+id+">ul").append(renderedAddEntrySelectTypeElem);
			
			$(".add-entry-select-type")[0].scrollIntoView();
			
			// create handlers for the options
			$(".add-entry-select-type > span > ul > li.new-channel").click(function(e){
				_createNewChannelEntry(false);
				e.stopPropagation();
			});
			
			$(".add-entry-select-type > span > ul > li.new-channel-template").click(function(e){
				_createNewChannelEntry(true);
				e.stopPropagation();
			});
			
			$(".add-entry-select-type > span > ul > li.new-page").click(function(e){
				_createNewPageEntry(false);
				e.stopPropagation();
			});
			
			$(".add-entry-select-type > span > ul > li.new-page-template").click(function(e){
				_createNewPageEntry(true);
				e.stopPropagation();
			});
			
			$(".add-entry-select-type > span > ul > li.new-service-instance").click(function(e){
				_createNewServiceInstanceSelectServiceEntry();
				e.stopPropagation();
			});
			
			_state = CONST_STATE_ADD_SELECT_TYPE;
		}
		
		/**
		 * Creates a new service instance entry (select service option).
		 */
		function _createNewServiceInstanceSelectServiceEntry(){
			_checkState(CONST_STATE_ADD_SELECT_TYPE);
			_removeAddEntrySelectTypeIfRequired();
			
			var newId = _generateNewId();
			var opts = {
				key: newId,
				services: _readPortalServices()
			};
			
			var itemToInsertSI = _findItemToInsertServiceInstance(isTemplate);
			var renderedSelectService = $.tmpl($("#render-add-service-instance-select-service-template"), opts);
			if(itemToInsertSI == null || itemToInsertSI.domElement == null){
				var innerUL = _domElement.find("> ul");
				innerUL.append(renderedSelectService);
			}
			else{
				if(itemToInsertSI.after)
					itemToInsertSI.domElement.after(renderedSelectService);
				else
					itemToInsertSI.domElement.before(renderedSelectService);
			}
			
			$(".select-service-filter > ul").perfectScrollbar();
			
			$(".select-service-filter > input").focus();
			$(".select-service")[0].scrollIntoView();
			
			$(".select-service-filter > input").keyup(function(e){
				// remove no-service-found class
				$(".select-service > span.select-service-filter").removeClass("no-service-found");
				
				var filter = $(this).val().toLowerCase();
				if(filter.length == 0){
					$(".select-service > span.select-service-filter > ul > li").each(function(){
						$(this).show();
					});
				}
				else{
					$(".select-service > span.select-service-filter > ul > li").each(function(){
						var curName = $(this).find("> span.service-information > span.service-select-title").text().toLowerCase();
						var curDescription = $(this).find("> span.service-information > span.service-select-description").text().toLowerCase();
						
						if(curName.indexOf(filter) != -1 || curDescription.indexOf(filter) != -1)
							$(this).show();
						else
							$(this).hide();
					});
				}
				
				// add no-service-found class
				if($(".select-service > span.select-service-filter > ul > li:visible").length == 0)
					$(".select-service > span.select-service-filter").addClass("no-service-found");

				if(e.which != 38 && e.which != 40 && e.which != 29 && e.which != 27){
					if(_curSelectedService != null){
						$(_curSelectedService).removeClass("currently-selected-service");
						_curSelectedService = null;
					}
					
					var visibleLis = $(".select-service > span.select-service-filter > ul > li:visible");
					if(visibleLis.length > 0){
						var filterContainer = $(".select-service-filter > ul");
						_scrollIntoView($(visibleLis[0]), filterContainer, 100 + filterContainer.offset().top);
					}
				}
				
				$(".select-service-filter > ul").perfectScrollbar("update");
			});

			$(".select-service-filter").click(function(e){
				e.stopPropagation();
			});
			
			$(".select-service-filter > input").keydown(function(e){
				if(e.which == CONST_VK_CONFIRM){ // enter
					
					if(_curSelectedService != null){
						_curSelectedService.click();
					}
					
					e.stopPropagation();
					return false;
				}
			});
			
			$(".select-service > span.select-service-filter > ul > li").each(function(){
				$(this).click(function(e){
					var serviceId = $(this).find("> input[type='hidden']").val();
					var name = $(this).find("> span.service-information > span.service-select-title").text();
					
					var opts = {
							key: newId,
							serviceName: name,
							serviceId: serviceId
					};
					
					var renderedInsertTitle = $.tmpl($("#render-add-service-instance-insert-title-template"), opts);
					var selectServiceLi = $(".select-service");
					selectServiceLi.before(renderedInsertTitle);
					selectServiceLi.remove();
					$("#new-item-title-"+newId).focus();
					
					var jsonCreator = {
							create: function(newId, title, isTemplate, id){
								return {
									key: newId,
									title: title,
									type: "serviceinstance",
									parentId: id,
									serviceId: serviceId
								};
							}
					};
					
					$("#new-item-title-" + newId).keypress(function (e){
						switch(e.which){
						case CONST_VK_CONFIRM: //enter
							if(_confirmObjectCreation(newId, jsonCreator, "#render-service-instance-template", itemToInsertSI))
								_getObject(newId).setServiceId(serviceId);
							e.stopPropagation();
							return false;
						}
					});
					
					$("li.insert-title > span.actions > span.ok").click(function (e){
						if(_confirmObjectCreation(newId, jsonCreator, "#render-service-instance-template", itemToInsertSI)){
							_getObject(newId).setServiceId(serviceId);
						}
						else{
							e.stopPropagation();
							return false;
						}
					});
					
					$("#new-item-title-" + newId).click(function (e){
						e.stopPropagation();
					});
					
					e.stopPropagation();
					$("#new-item-title-" + newId).focus();
					_state = CONST_STATE_ADD_SERVICE_INSTANCE_SET_TITLE;
				});
			});
			
			_state = CONST_STATE_ADD_SERVICE_INSTANCE_SELECT_SERVICE;
		}
		
		/**
		 * Gets the portal services available for instantiating.
		 */
		function _readPortalServices(){
			var json;
			$.ajax(g_LumisRoot_href + "lumis/api/rest/lum-internal/admin/portal-studio/structureeditor/getservices",{
				async: false,
				dataType: 'json',
				complete: function(jqXHR, text){
					json = $.parseJSON(jqXHR.responseText);
				}
			});
			
			if(json){
				json.sort(function(o1, o2){
					return o1.name.toLowerCase().localeCompare(o2.name.toLowerCase());
				});
			}
			
			return json;
		}
		
		/**
		 * Creates a new channel entry (insert title option).
		 */
		function _createNewChannelEntry(isTemplate){
			_checkState(CONST_STATE_ADD_SELECT_TYPE);
			_removeAddEntrySelectTypeIfRequired();
			var newId = _generateNewId();
			var options = {
				key: newId,
				isTemplate: isTemplate,
				title: ""
			};
			
			var itemToInsertChannel = _findItemToInsertChannel(isTemplate);
			var renderedInsertTitle = $.tmpl($("#render-add-channel-insert-title-template"), options);
			if(itemToInsertChannel == null || itemToInsertChannel.domElement == null){
				var innerUL = _domElement.find("> ul");
				innerUL.append(renderedInsertTitle);
			}
			else{
				if(itemToInsertChannel.after)
					itemToInsertChannel.domElement.after(renderedInsertTitle);
				else
					itemToInsertChannel.domElement.before(renderedInsertTitle);
			}
			
			$("#new-item-title-"+newId).focus();
			
			_state = isTemplate ? CONST_STATE_ADD_CHANNEL_TEMPLATE_SET_TITLE : CONST_STATE_ADD_CHANNEL_SET_TITLE;
			
			var jsonCreator = {
					create: function(newId, title, isTemplate, id){
						return {
							isTemplate: isTemplate,
							isFolder: true,
							key: newId,
							title: title,
							type: "channel",
							parentId: id
						};
					}
			};
			
			// add the handles to create the new channel
			$("#new-item-title-"+newId).keypress(function (e){
				switch(e.which){
				case CONST_VK_CONFIRM: //enter
					_confirmObjectCreation(newId, jsonCreator, "#render-channel-template", itemToInsertChannel, isTemplate);
					e.stopPropagation();
					return false;
				}
			});
			
			$(".insert-title > span.title-entry").click(function(e){
				e.stopPropagation();
				return false;
			});
			
			$(".insert-title > span.actions > span.ok").click(function(e){
				_confirmObjectCreation(newId, jsonCreator, "#render-channel-template", itemToInsertChannel, isTemplate);
				e.stopPropagation();
				return false;
			});
		}
		
		/**
		 * Creates a new page entry (insert title option).
		 */
		function _createNewPageEntry(isTemplate){
			_checkState(CONST_STATE_ADD_SELECT_TYPE);
			_removeAddEntrySelectTypeIfRequired();
			var newId = _generateNewId();
			var options = {
				key: newId,
				isTemplate: isTemplate,
				title: ""
			};
			
			var itemToInsertPage = _findItemToInsertPage(isTemplate);
			var renderedInsertTitle = $.tmpl($("#render-add-page-insert-title-template"), options);
			if(itemToInsertPage == null || itemToInsertPage.domElement == null){
				var innerUL = _domElement.find("> ul");
				innerUL.append(renderedInsertTitle);
			}
			else{
				if(itemToInsertPage.after)
					itemToInsertPage.domElement.after(renderedInsertTitle);
				else
					itemToInsertPage.domElement.before(renderedInsertTitle);
			}
			
			$("#new-item-title-"+newId).focus();
			
			_state = isTemplate ? CONST_STATE_ADD_PAGE_TEMPLATE_SET_TITLE : CONST_STATE_ADD_PAGE_SET_TITLE;
			
			var jsonCreator = {
					create: function(newId, title, isTemplate, id){
						return {
							isTemplate: isTemplate,
							key: newId,
							title: title,
							type: "page",
							parentId: id
						};
					}
			};
			
			// add the handles to create the new channel
			$("#new-item-title-"+newId).keypress(function (e){
				switch(e.which){
				case CONST_VK_CONFIRM: //enter
					_confirmObjectCreation(newId, jsonCreator, "#render-page-template", itemToInsertPage, isTemplate);
					e.stopPropagation();
					return false;
				}
			});
			
			$(".insert-title > span.title-entry").click(function(e){
				e.stopPropagation();
				return false;
			});
			
			$(".insert-title > span.actions > span.ok").click(function(e){
				_confirmObjectCreation(newId, jsonCreator, "#render-page-template", itemToInsertPage, isTemplate);
				e.stopPropagation();
				return false;
			});
		}
		
		/**
		 * Confirms an object creation.
		 */
		function _confirmObjectCreation(newId, jsonCreator, templateId, itemToInsertObj, isTemplate){
			var title = $("#new-item-title-"+newId).val();
			if(title && title.length > 0){
				
				var opts = jsonCreator.create(newId, title, isTemplate, id);
				
				var renderedNewChannel = $.tmpl($(templateId), opts);
				$("#new-item-title-"+newId).parent().parent().before(renderedNewChannel);
				$("#new-item-title-"+newId).parent().parent().remove();
				
				// create the object
				var createdObject = _createObject(opts);
				
				// add the created object as child of the current object
				var newArray = new Array();
				if(!itemToInsertObj){
					newArray.push(createdObject)
				}
				else{
					var added = false;
					var idxNewArray = 0;
					var idxOldArray = 0;
					for(;idxNewArray <= _objectsByParentMap[id].length; idxOldArray++, idxNewArray++){
						
						if(!added && idxOldArray == itemToInsertObj.index){
							var curObj = _objectsByParentMap[id][idxOldArray];
							if(itemToInsertObj.after){
								newArray.push(curObj);
								newArray.push(createdObject);
							}
							else{
								newArray.push(createdObject);
								newArray.push(curObj);
							}
							idxNewArray++;
							added = true;
						}
						else{
							var curObj = _objectsByParentMap[id][idxOldArray];
							newArray.push(curObj);
						}
					}
				}
				
				_objectsByParentMap[id] = newArray;
				_state = CONST_STATE_IDLE;
				_addAction({type: "add", key: newId});
				
				if(createdObject.getType() == "channel" || createdObject.getType() == "page")
					_getObject(id).reorderChildren(createdObject.getType(), isTemplate);
				
				if(createdObject.getType() == "channel"){
					createdObject.toggleVisibility();
					// _updateAllActions(); already done in togglevisibility
				}
				else{
					_updateAllActions();
				}
				
				_addFocus(createdObject.getId());
				window.focus();
				return true;
			}
			else{
				// ignore empty titles
				window.focus();
				return false;
			}
		}
		
		function _findItemToInsertChannel(isTemplate){
			return _findItemToInsert(isTemplate, function(child, isTemplate, idx, curItem){
				if(!isTemplate && child.getType() == "channel"){
					if(curItem == null){
						return {
							domElement: child.getDomElement(),
							after: false,
							index: idx
						};
					}
					else{
						return {
							domElement: curItem,
							after: true,
							index: idx - 1
						};
					}
				}
				
				if(child.getType() == "channel" && child.isTemplate()){
					if(curItem == null){
						return {
							domElement: child.getDomElement(),
							after: false,
							index: idx
						};
					}
					else{
						return {
							domElement: curItem,
							after: true,
							index: idx - 1
						};
					}
				}
				
				return null;
			});
		}
		
		function _findItemToInsertPage(isTemplate){
			return _findItemToInsert(isTemplate, function(child, isTemplate, idx, curItem){
				if(child.getType() == "channel"){
					return {
						domElement: child.getDomElement(),
						after: false,
						index: idx
					};
				}
				
				if(!isTemplate && child.getType() == "page"){
					if(curItem == null){
						return {
							domElement: child.getDomElement(),
							after: false,
							index: idx
						};
					}
					else{
						return {
							domElement: curItem,
							after: true,
							index: idx - 1
						};
					}
				}
				
				if(child.getType() == "page" && child.isTemplate()){
					if(curItem == null){
						return {
							domElement: child.getDomElement(),
							after: false,
							index: idx
						};
					}
					else{
						return {
							domElement: curItem,
							after: true,
							index: idx - 1
						};
					}
				}
				
				return null;
			});
		}
		
		function _findItemToInsertServiceInstance(){
			return _findItemToInsert(null, function(child, isTemplate, idx, curItem){
				return {
					domElement: child.getDomElement(),
					after: false,
					index: idx
				};
			});
		}
		
		function _findItemToInsert(isTemplate, checkChildFunction){
			var children = _objectsByParentMap[id];
			if(!children || children.length == 0)
				return null;
			
			// search for the right position considering this order
			//	 	service instance
			// 		page
			// 		page template
			// 		channel
			// 		channel template
			
			var curItem = null;
			var idx = 0;
			for(var i in children){
				var child = children[i];
				
				var res = checkChildFunction(child, isTemplate, idx, curItem);
				if(res != null){
					return res;
				}
				
				idx++;
				curItem = child.getDomElement();
			}
			
			return {
				after: true,
				domElement: children[children.length - 1].getDomElement(),
				index: children.length - 1
			};
		}

		this.getDomElement = function(){
			return _domElement;
		};
		
		this.getType = function(){
			return _type;
		};
		
		this.isTemplate = function(){
			return isTemplate;
		}
		
		this.getParentId = function(){
			return _parentChannelId;
		}
		
		this.reorderChildren = function(type, isTemplate){
			if(_objectsByParentMap[id] != undefined && _objectsByParentMap[id] != null){
				var curIdx = 1;
				for(var i in _objectsByParentMap[id]){
					var child = _objectsByParentMap[id][i];
					if(child.getType() == type && child.isTemplate() == isTemplate){
						child.setPosition(curIdx);
						curIdx++;
					}
				}
			}
		};
	}
	
	/**
	 * Searches for the previous sibling of a node.
	 */
	function _getPreviousSibling(obj){
		if(obj.getParent() == null){
			return null;
		}
		
		var children = obj.getParent().getChildren();
		var idx = children.indexOf(obj);
		
		if(idx == 0){
			return null;
		}
		
		return children[idx - 1];
	}
	
	/**
	 * Searches for the next sibling of a node.
	 */
	function _getNextSibling(obj){
		if(obj.getParent() == null){
			return null;
		}
		
		var children = obj.getParent().getChildren();
		var idx = children.indexOf(obj);
		
		if(idx == children.length - 1){
			return null;
		}
		
		return children[idx + 1];
	}
	
	/**
	 * Executes a move.
	 */
	function _executeMove(object, position){
		var originalParent = object.getParent();
		var relativePosition = position.position;
		
		var newParent = relativePosition == "inside" ? position.anchor : position.anchor.getParent();
		var sameParent = originalParent == newParent;
		
		var objectDomElement = object.getDomElement();
		
		object.getParent().removeChild(object);
		objectDomElement.detach();
		window.focus();
		if(relativePosition == "inside"){
			position.anchor.addChild(object);
			position.anchor.getDomElement().find("> ul").append(objectDomElement);
		}
		else{
			var before = relativePosition == "before";
			position.anchor.getParent().addChild(object, position.anchor, before);
			if(before){
				position.anchor.getDomElement().before(objectDomElement);
			}
			else{
				position.anchor.getDomElement().after(objectDomElement);
			}
		}
		
		if(object.isSortable()){
			newParent.reorderChildren(object.getType(), object.isTemplate());
			
			if(!sameParent){
				originalParent.reorderChildren(object.getType(), object.isTemplate());
			}
		}
		
		object.setParentChannelId(newParent.getId());
		_updateAllActions();
		
		_scrollIntoView(objectDomElement);
	}
	
	function _scrollIntoView(objectDomElement, scrollContainer, margin){
		scrollContainer = scrollContainer || $('.lum-property-page-content');
		margin = margin || 200;
		var scrollTop = scrollContainer.scrollTop() + objectDomElement.offset().top - margin;
		console.log(objectDomElement);
		if (scrollTop < 0)
			scrollTop = 0;
		scrollContainer.scrollTop(scrollTop);
	}
	
	function _getInsertAvailablePositionsForUp(obj, previousVisibleObject){
		if(obj.getType() == "channel" && obj.isAncestralOf(previousVisibleObject))
			return null;
		
		var available = null;
		
		var objType = obj.getTypePosition();
		var destType = previousVisibleObject.getTypePosition();
		
		// check after
		if(objType >= destType && (previousVisibleObject.getType() != "channel" || !previousVisibleObject.isAncestralOf(obj))){
			if(obj.isSortable() || obj.getParent() != previousVisibleObject.getParent()){
				var nextSibling = previousVisibleObject.getNextSibling();
				if(nextSibling == null || nextSibling != obj){
					if(nextSibling == null){
						available = available || {};
						available.after = true;	
					}
					else{
						if(objType <= nextSibling.getTypePosition()){
							available = available || {};
							available.after = true;
						}
					}
				}
			}
		}
		
		// check inside
		if(previousVisibleObject.getType() == "channel" && previousVisibleObject.isOpened() && (previousVisibleObject.getChildren() == null || previousVisibleObject.getChildren().length == 0) && previousVisibleObject != obj.getParent()){
			available = available || {};
			available.inside = true;
		}
		
		// check before
		if(objType <= destType){
			if(obj.isSortable() || obj.getParent() != previousVisibleObject.getParent()){
				var destParent = previousVisibleObject.getParent();
				if(destParent != null){
					var previousSibling = previousVisibleObject.getPreviousSibling();
					if(previousSibling == null){
						available = available || {};
						available.before = true;
					}
					else if(previousSibling != obj){
						if(objType >= previousSibling.getTypePosition()){
							available = available || {};
							available.before = true;
						}
					}
				}
			}
		}
		
		return available;
	}
	
	function _getInsertAvailablePositionsForDown(obj, nextVisibleObject){
		if(obj.getType() == "channel" && obj.isAncestralOf(nextVisibleObject))
			return null;
		
		var available = null;
		
		var objType = obj.getTypePosition();
		var destType = nextVisibleObject.getTypePosition();
		
		// check after
		if(objType >= destType/* && obj.getParent() != nextVisibleObject*/){
			if(obj.isSortable() || obj.getParent() != nextVisibleObject.getParent()){
				var nextSibling = nextVisibleObject.getNextSibling();
				if(nextSibling == null || nextSibling != obj){
					if(nextSibling == null){
						available = available || {};
						available.after = true;	
					}
					else{
						if(objType <= nextSibling.getTypePosition()){
							available = available || {};
							available.after = true;
						}
					}
				}
			}
		}
		
		// check inside
		if(nextVisibleObject.getType() == "channel" && nextVisibleObject.isOpened() && (nextVisibleObject.getChildren() == null || nextVisibleObject.getChildren().length == 0) && nextVisibleObject != obj.getParent()){
			available = available || {};
			available.inside = true;
		}
		
		// check before
		if(objType <= destType){
			if(obj.isSortable() || obj.getParent() != nextVisibleObject.getParent()){
				var destParent = nextVisibleObject.getParent();
				if(destParent != null){
					var previousSibling = nextVisibleObject.getPreviousSibling();
					if(previousSibling == null){
						available = available || {};
						available.before = true;
					}
					else if(previousSibling != obj){
						if(objType >= previousSibling.getTypePosition()){
							available = available || {};
							available.before = true;
						}
					}
				}
			}
		}
		
		return available;
	}
	
	function _findPreviousPosition(obj){
		// root channel must not be moved
		if(obj == _rootChannel){
			return null;
		}
		
		// try to find the previous position under the same parent
		var objType = obj.getTypePosition();
		
		// try to find another element of the same type under the same parent 
		var parentId = obj.getParentId();
		var parent = _getObject(parentId);
		
		if(parent != null){
			// find the previous position in parents
			var previousVisibleObject = _findPreviousVisibleObject(obj);
			var availableInsertPosition = null;
			while(true){
				if(previousVisibleObject == null){
					break;
				}
				
				availableInsertPosition = _getInsertAvailablePositionsForUp(obj, previousVisibleObject);
				if(availableInsertPosition == null){
					previousVisibleObject = _findPreviousVisibleObject(previousVisibleObject);
					continue;
				}
				
				break;
			}
			
			// the order of insertion is:
			//    - after
			//    - inside
			//    - before
			
			if(previousVisibleObject == null || availableInsertPosition == null)
				return null;
			
			if(availableInsertPosition.after){
				return {
					anchor: previousVisibleObject,
					position: "after"
				};
			}
			else if(availableInsertPosition.inside){
				// find the last object recursivelly
				var lastChild = _findLastChildRecursively(previousVisibleObject);
				if(lastChild != previousVisibleObject){
					availableInsertPosition = _getInsertAvailablePositionsForUp(obj, lastChild);
					
					var position;
					if(availableInsertPosition.after){
						position = "after";
					}
					else if(availableInsertPosition.inside){
						position = "inside";
					}
					else if(availableInsertPosition.before){
						position = "before";
					}
					else{
						// shouldn't happen
						throw "Unexpected insert position found: " + availableInsertPosition;
					}
					
					return {
						anchor: lastChild,
						position: position
					}
				}
				else{
					return {
						anchor: previousVisibleObject,
						position: "inside"
					};
				}
			}
			else if(availableInsertPosition.before){
				return {
					anchor: previousVisibleObject,
					position: "before"
				};
			}
			else{
				// shouldn't happen
				throw "Unexpected insert position found: " + availableInsertPosition;
			}
		}
		else{
			// shouldn't happen
			throw "Cannot move root channel.";
		}
	}
	
	function _findPreviousVisibleObject(baseObj){
		var parent = baseObj.getParent();
		if(parent == null){
			return null;
		}
		
		var indexOfBase = parent.getChildren().indexOf(baseObj);
		if(indexOfBase > 0){
			var previousObj = parent.getChildren()[indexOfBase - 1];
			if(previousObj.getType() != "channel" || previousObj.isClosed()){
				return previousObj;
			}
			
			return _findLastChildRecursively(previousObj);
		}
		
		return parent;	
	}
	
	function _findNextVisibleObject(baseObj){
		if(baseObj.getType() == "channel" && baseObj.isOpened() && baseObj.getChildren() != null && baseObj.getChildren().length > 0){
			return baseObj.getChildren()[0];
		}
		
		var nextSibling = baseObj.getNextSibling();
		
		if(nextSibling == null){
			return _findNextVisibleParentRecursively(baseObj);
		}
		else{
			return nextSibling;
		}
	}
	
	function _findNextVisibleParentRecursively(obj){
		var parent = obj.getParent();
		if(parent == null){
			return null;
		}
		
		var parentNextSibling = parent.getNextSibling();
		if(parentNextSibling != null){
			return parentNextSibling;
		}
		else{
			return _findNextVisibleParentRecursively(parent);
		}
	}
	
	function _findLastChildRecursively(obj){
		if(obj.getType() != "channel" || obj.isClosed() || obj.getChildren() == null || obj.getChildren().length == 0){
			return obj;
		}
		
		return _findLastChildRecursively(obj.getChildren()[obj.getChildren().length - 1]);
	}
	
	function _findNextPosition(obj){
		// root channel must not be moved
		if(obj == _rootChannel){
			return null;
		}
		
		// try to find the previous position under the same parent
		var objType = obj.getTypePosition();
		
		// try to find another element of the same type under the same parent 
		var parent = obj.getParent();
		
		if(parent != null){
			// find the previous position in parents
			var nextVisibleObject = _findNextVisibleObject(obj);
			var availableInsertPosition = null;
			while(true){
				if(nextVisibleObject == null){
					break;
				}
				
				availableInsertPosition = _getInsertAvailablePositionsForDown(obj, nextVisibleObject);
				if(availableInsertPosition == null || 
						((availableInsertPosition.after && !availableInsertPosition.before && !availableInsertPosition.inside) && nextVisibleObject != null && nextVisibleObject.getType() == "channel" && nextVisibleObject.isOpened() && nextVisibleObject.getChildren() != null && nextVisibleObject.getChildren().length > 0)){
					nextVisibleObject = _findNextVisibleObject(nextVisibleObject);
					continue;
				}
				
				break;
			}
			
			// the order of insertion is:
			//    - before
			//    - inside
			//    - after
			
			if(nextVisibleObject == null || availableInsertPosition == null){
				var destParent = parent;
				while(destParent != null && destParent != _rootChannel){
					var availablePositions = _getInsertAvailablePositionsForDown(obj, destParent);
					if(availablePositions != null && availablePositions.after){
						return {
							anchor: destParent,
							position: "after"
						};
					}
					
					destParent = destParent.getParent();
				}
				
				return null;
			}
			
			if(availableInsertPosition.before){
				return {
					anchor: nextVisibleObject,
					position: "before"
				};
			}
			else if(availableInsertPosition.inside){
				// find the first object recursivelly
				var pos = _findNextAvailablePositionInsideRecursively(obj, nextVisibleObject);
				if(pos != null){
					return pos;
				}
				else{
					// shouldn't happen
					throw "Couldn't find an insert position";
				}
			}
			else if(availableInsertPosition.after){
				return {
					anchor: nextVisibleObject,
					position: "after"
				};
			}
			else{
				// shouldn't happen
				throw "Found an invalid insert position: " + availableInsertPosition;
			}
		}
		else{
			// shouldn't happen
			throw "Cannot move root channel.";
		}
	}
	
	function _findNextAvailablePositionInsideRecursively(obj, nextVisibleObject){
		var availableInsertPosition = _getInsertAvailablePositionsForDown(obj, nextVisibleObject);
		
		if(availableInsertPosition != null && availableInsertPosition.before){
			return {
				anchor: nextVisibleObject,
				position: "before"
			};
		}
		
		if(availableInsertPosition != null && availableInsertPosition.inside){
			var children = nextVisibleObject.getChildren();
			if(children == null || children.length == 0){
				return {
					anchor: nextVisibleObject,
					position: "inside"
				};
			}
			else{
				for(var i in children){
					var child = children[i];
					var childInsertPosition = _findNextAvailablePositionInsideRecursively(obj, child);
					if(childInsertPosition != null)
						return childInsertPosition;
				}
			}
		}
		else if(availableInsertPosition != null){
			var position;
			if(availableInsertPosition.before){
				position = "before";
			}
			else if (availableInsertPosition.after){
				position = "after";
			}
			else{
				// shouldn't happen
				throw "Found an invalid insert position: " + availableInsertPosition;
			}
			
			return {
				anchor: nextVisibleObject,
				position: position
			};
		}
		
		return null;
	}
	
	function _createChangeTitleInput(id){
		_checkState(CONST_STATE_IDLE);
		
		var obj = _getObject(id);
		var opts = {
			key: 	obj.getId(),
			type: 	obj.getType(),
			isTemplate: obj.getType() == "serviceinstance" ? false : obj.isTemplate(),
			isFolder: (obj.getType() == "channel"),
			expand: (obj.getType() == "channel" && !obj.isClosed()),
			title: obj.getName()
		};
		
		var renderedTitleChange = $.tmpl($("#render-title-change-template"), opts);
		var elem = $("#elem_" + id);
		elem.before(renderedTitleChange);
		elem.hide();
		
		var ul = elem.find("> ul");
		if(ul != null && ul.length > 0){
			var subElements = $(ul[0]).detach();
			$(".change-title").append(subElements);
		}
		
		$("#title-change-" + id + " > span.channel-toggle").click(function(e){
			_removeChangeTitleInputInRequired();
			obj.toggleVisibility();
			e.stopPropagation();
		});
		
		$("#new-item-title-" + id).focus();
		
		$("#new-item-title-" + id).keydown(function(e){
			if(e.which == CONST_VK_CONFIRM){ // enter
				_confirmTitleChange();
				e.stopPropagation();
				return false;
			}
		});
		
		$("#new-item-title-" + id).click(function(e){
			e.stopPropagation();
		});
		
		$("li#title-change-" + id + " > span.actions > span.ok").click(function(){
			_confirmTitleChange();
		});
		
		_objSettingTitleId = id;
		_state = CONST_STATE_CHANGE_TITLE;
		
		function _confirmTitleChange(){
			var newTitle = $("#new-item-title-" + id).val().trim();
			
			if(newTitle.length > 0){
				_getObject(id).setName(newTitle);
				_removeChangeTitleInputInRequired();
				$("#elem_" + id + " > span.structureitem").text(newTitle);
			}
			else{
				// ignore an empty title
			}
			window.focus();
		}
	}
	
	function _removeChangeTitleInputInRequired(){
		if(_state == CONST_STATE_CHANGE_TITLE){
			var elem = $("#elem_" + _objSettingTitleId);
			var titleChange = $("li#title-change-" + _objSettingTitleId);
			
			var ul = titleChange.find("> ul");
			if(ul != null && ul.length > 0){
				var subElements = $(ul[0]).detach();
				elem.append(subElements);
			}
			
			elem.show();
			titleChange.remove();
			_objSettingTitleId = null;
			_state = CONST_STATE_IDLE;
		}
	}

	function _toggleFocus(id){
		if(_isFocused(id)){
			_removeFocus(id);
		}
		else{
			_addFocus(id);
		}
	}
	
	function _removeFocus(id){
		$("#elem_"+id).removeClass("focus");
		_focusItem = null;
		_curSelectedObject = null;
	}
	
	function _addFocus(id){
		_cancelAction();
		if(_focusItem != undefined && _focusItem != null)
			_removeFocus(_focusItem);
		
		$("#elem_"+id).addClass("focus");
		_focusItem = id;
		_curSelectedObject = _getObject(id);
	}
	
	function _isFocused(id){
		return $("#elem_"+id).hasClass("focus");
	}
	
	function initObject(id, type){
		$("#elem_"+id+">span.structureitem").click(function(e){
			_toggleFocus(id);
			e.stopPropagation();
			_removeAddEntrySelectTypeIfRequired();
		});
		$("#elem_"+id+">span.channel-toggle").click(function(e){
			_getObject(id).toggleVisibility();
			e.stopPropagation();
			_removeAddEntrySelectTypeIfRequired();
		});
		
		$("#elem_"+id+">span.actions>span.add").click(function(e){
			_getObject(id).createAddEntry();
			_removeFocus(id);
			e.stopPropagation();
		});
		
		$("#elem_"+id+">span.actions>span.remove").click(function(e){
			$("#elem_"+id).remove();
			
			// removes the item form curObjects map
			var obj = _getObject(id);
			if(obj.getParentId() != null && _objectsByParentMap[obj.getParentId()] != undefined && _objectsByParentMap[obj.getParentId()] != null){
				var arrChildren = _objectsByParentMap[obj.getParentId()];
				
				var idx = 0;
				for(var i in arrChildren){
					if(arrChildren[i].getId() == id){
						break;
					}
					
					idx++;
				}
				
				arrChildren.splice(idx, 1);
			}
			
			delete _getObject(id);
			_addAction({type: "remove", key: id, objectType: type});
			
			e.stopPropagation();
		});
		
		$("#elem_"+id+">span.actions>span.move-up").click(function(e){
			_getObject(id).move("up");
			e.stopPropagation();
		});
		
		$("#elem_"+id+">span.actions>span.move-down").click(function(e){
			_getObject(id).move("down");
			e.stopPropagation();
		});
		
		$("#elem_"+id+">span.structureitem").dblclick(function(e){
			_createChangeTitleInput(id)
			
			e.stopPropagation();
			return false;
		});
	}
	
	function _cancelAction(){
		_removeAddEntrySelectTypeIfRequired();
		_removeInsertTitleIfRequired();
		_removeAddServiceInstanceInsertTitleIfRequired();
		_removeAddServiceInstanceSelectServiceIfRequired();
		_removeChangeTitleInputInRequired();
		window.focus();
	}
	
	function initTree(parentElem, rootId){
		_renderChannel(parentElem, rootId, true);
		_rootChannel = _getObject(rootId);
		
		// add a click handler in document to force an item to lost focus
		$(document).click(function(e){
			if(_focusItem != undefined && _focusItem != null){
				_removeFocus(_focusItem);
				e.stopPropagation();
			}
			
			_cancelAction();
		});
		
		// add keyboard handles
		$(document).keydown(function(e){
			if(e.which == 27){ // escape
				_cancelAction();
				e.stopPropagation();
				return;
			}
			
			switch(_state){
			case CONST_STATE_ADD_SELECT_TYPE:
				switch(e.which){
				case CONST_VK_UP:
					if(_curSelectedAddOption == null){
						var firstOption = $(".add-entry-select-type > span > ul > li")[0];
						_curSelectedAddOption = firstOption;
						$(_curSelectedAddOption).addClass("currently-selected-option");
					}
					else{
						var lis = $(".add-entry-select-type > span > ul > li");
						var length = lis.length;
						var index = 0;
						var found = false;
						lis.each(function(i, o){
							if(!found){
								if(lis[i] == _curSelectedAddOption){
									index = i;
									found = true;
								}
							}
						});
						
						if(!found){
							// shouldn't happen
							throw "Couldn't find " + _curSelectedAddOption + " among " + lis;
						}
						
						if(index != 0){
							var newIndex = index - 1;
							$(_curSelectedAddOption).removeClass("currently-selected-option");
							_curSelectedAddOption = lis[newIndex];
							$(_curSelectedAddOption).addClass("currently-selected-option");
						}
					}
					
					break;
				
				case CONST_VK_CONFIRM: 
					if(_curSelectedAddOption != null){
						$(_curSelectedAddOption).click();				
					}
					
					break;
				
				case CONST_VK_DOWN:
					if(_curSelectedAddOption == null){
						var firstOption = $(".add-entry-select-type > span > ul > li")[0];
						_curSelectedAddOption = firstOption;
						$(_curSelectedAddOption).addClass("currently-selected-option");
					}
					else{
						var lis = $(".add-entry-select-type > span > ul > li");
						var length = lis.length;
						var index = 0;
						var found = false;
						lis.each(function(i, o){
							if(!found){
								if(lis[i] == _curSelectedAddOption){
									index = i;
									found = true;
								}
							}
						});
						
						if(!found){
							// shouldn't happen
							throw "Couldn't find " + _curSelectedAddOption + " among " + lis;
						}
						
						if(index != lis.length - 1){
							var newIndex = index + 1;
							$(_curSelectedAddOption).removeClass("currently-selected-option");
							_curSelectedAddOption = lis[newIndex];
							$(_curSelectedAddOption).addClass("currently-selected-option");
						}
					}
					
					break;
				
				}
				
				e.stopPropagation();
				return false;
				
			case CONST_STATE_ADD_SERVICE_INSTANCE_SELECT_SERVICE:
				// if the state is selecting service, the direction change will affect the currently selected service
				switch(e.which){
				case CONST_VK_UP: // up
					var originalSelectedService = _curSelectedService;
					if(_curSelectedService == null){
						var visibleServices = $(".select-service > span.select-service-filter > ul > li:visible");
						if(visibleServices.length > 0){
							$(visibleServices[0]).toggleClass("currently-selected-service");
							_curSelectedService = visibleServices[0];
						}
					}
					else{
						var visibleServices = $(".select-service > span.select-service-filter > ul > li:visible");
						if(visibleServices.length > 0){
							var curSelectedServiceIndex = -1;
							var found = false;
							visibleServices.each(function(i, o){
								if(!found && this == _curSelectedService){
									curSelectedServiceIndex = i;
									found = true;
								}
							});
							
							if(curSelectedServiceIndex == -1){
								$(visibleServices[0]).toggleClass("currently-selected-service");
								_curSelectedService = visibleServices[0];
							}
							else if(curSelectedServiceIndex > 0){
								$(visibleServices[curSelectedServiceIndex]).toggleClass("currently-selected-service");
								$(visibleServices[curSelectedServiceIndex  - 1]).toggleClass("currently-selected-service");
								_curSelectedService = visibleServices[curSelectedServiceIndex - 1];
							}
						}
						else{
							_curSelectedService = null;
						}
					}
					
					if(_curSelectedService != null && _curSelectedService != originalSelectedService){
						var filterContainer = $(".select-service-filter > ul");
						filterContainer.perfectScrollbar("update");
						_scrollIntoView($(_curSelectedService), filterContainer, 100 + filterContainer.offset().top);
					}
					
					e.stopPropagation();
					return false;
					
				case CONST_VK_DOWN: // down
					var originalSelectedService = _curSelectedService;
					if(_curSelectedService == null){
						var visibleServices = $(".select-service > span.select-service-filter > ul > li:visible");
						if(visibleServices.length > 0){
							$(visibleServices[0]).toggleClass("currently-selected-service");
							_curSelectedService = visibleServices[0];
						}
					}
					else{
						var visibleServices = $(".select-service > span.select-service-filter > ul > li:visible");
						if(visibleServices.length > 0){
							var curSelectedServiceIndex = -1;
							var found = false;
							visibleServices.each(function(i, o){
								if(!found && this == _curSelectedService){
									curSelectedServiceIndex = i;
									found = true;
								}
							});
							
							if(curSelectedServiceIndex == -1){
								$(visibleServices[0]).toggleClass("currently-selected-service");
								_curSelectedService = visibleServices[0];
							}
							else if(curSelectedServiceIndex < visibleServices.length - 1){
								$(visibleServices[curSelectedServiceIndex]).toggleClass("currently-selected-service");
								$(visibleServices[curSelectedServiceIndex  + 1]).toggleClass("currently-selected-service");
								_curSelectedService = visibleServices[curSelectedServiceIndex + 1];
							}
						}
						else{
							_curSelectedService = null;
						}
					}
					
					if(_curSelectedService != null && _curSelectedService != originalSelectedService){
						var filterContainer = $(".select-service-filter > ul");
						filterContainer.perfectScrollbar("update");
						_scrollIntoView($(_curSelectedService), filterContainer, 100 + filterContainer.offset().top);
					}
					
					e.stopPropagation();
					return false;
				}
				
				break;
				
			case CONST_STATE_IDLE:
				// if the state is idle, the direction change will affect the currently selected item
				switch(e.which){
				case CONST_VK_UP: // up
					if(e.ctrlKey){
						if(_curSelectedObject != null){
							// get the move up button
							var moveup = _curSelectedObject.getDomElement().find("> span.actions > span.move-up");
							if(moveup.is(":visible")){
								moveup.click();
							}
						}
					}
					else{
						var originalSelectedItem = _curSelectedObject;
						if(_curSelectedObject == null){
							_toggleFocus(_rootChannel.getId());
						}
						else{
							// find the previous object of the same parent
							var parentId = _curSelectedObject.getParentId();
							if(parentId != null && _getObject(parentId) != undefined && _getObject(parentId) != null && _objectsByParentMap[parentId] != null){
								var positionOfCurrentSelectedObject = _objectsByParentMap[parentId].indexOf(_curSelectedObject);
								
								if(positionOfCurrentSelectedObject == 0){
									// go to parent
									_toggleFocus(_curSelectedObject.getId());
									_toggleFocus(parentId);
								}
								
								else if(positionOfCurrentSelectedObject > 0){
									function _findLastVisibleObjectRecursively(object){
										if(object.getType() == "channel"){
											if(object.isClosed()){
												return object;
											}
											else{
												if(object.getChildren() && object.getChildren().length > 0){
													return _findLastVisibleObjectRecursively(object.getChildren()[object.getChildren().length - 1]);
												}
												else{
													return object;
												}
											}
										}
										else
											return object;
									}
									
									// the selected object will be the previous
									var previousObject = _objectsByParentMap[parentId][positionOfCurrentSelectedObject - 1];
									_toggleFocus(_curSelectedObject.getId());
									_toggleFocus(_findLastVisibleObjectRecursively(previousObject).getId());
								}
								else{
									// shouldn't happen (didn't find the current item among parent's children)
									throw "Couldn't find " + _curSelectedObject + " among " + _objectsByParentMap[parentId];
								}
							}
						}
						
						if(_curSelectedObject != null && originalSelectedItem != _curSelectedObject){
							_scrollIntoView(_curSelectedObject.getDomElement());
						}
					}
					
					e.stopPropagation();
					return false;
					
				case CONST_VK_DOWN: // down
					if(e.ctrlKey){
						if(_curSelectedObject != null){
							// get the move up button
							var movedown = _curSelectedObject.getDomElement().find("> span.actions > span.move-down");
							if(movedown.is(":visible")){
								movedown.click();
							}
						}
					}
					else{
						var originalSelectedItem = _curSelectedObject;
						if(_curSelectedObject == null){
							_toggleFocus(_rootChannel.getId());
						}
						else{
							// find the next object child object
							if(
									_curSelectedObject.getType() == "channel" &&
									_curSelectedObject.isOpened() &&
									_objectsByParentMap[_curSelectedObject.getId()] != null 
									&& _objectsByParentMap[_curSelectedObject.getId()].length > 0){
								
								// select the first child
								var curObj = _curSelectedObject;
								var nextObj = _objectsByParentMap[_curSelectedObject.getId()][0];
								_toggleFocus(curObj.getId());
								_toggleFocus(nextObj.getId());
							}
							else{
								var parentId = _curSelectedObject.getParentId();
								if(parentId != null && _getObject(parentId) != undefined && _getObject(parentId) != null && _objectsByParentMap[parentId] != null){
									var positionOfCurrentSelectedObject = _objectsByParentMap[parentId].indexOf(_curSelectedObject);
									
									if(positionOfCurrentSelectedObject == _objectsByParentMap[parentId].length - 1){
										// go to next child of parent recursively
										
										function _findNextVisibleObjectRecursively(object){
											// get parent
											var parentId = object.getParentId();
											if(parentId == null)
												return null;
								
											var parent = _getObject(parentId);
											if(parent == undefined || parent == null)
												return null;
											
											var indexOfChild = parent.getChildren().indexOf(object);
											if(indexOfChild == parent.getChildren().length - 1){
												return _findNextVisibleObjectRecursively(parent);
											}
											else{
												return parent.getChildren()[indexOfChild + 1];
											}
										}
										
										var curObj = _curSelectedObject;
										var next = _findNextVisibleObjectRecursively(curObj);
										
										if(next){
											_toggleFocus(curObj.getId());
											_toggleFocus(next.getId());
										}
									}
									else{
										_toggleFocus(_curSelectedObject.getId());
										_toggleFocus(_objectsByParentMap[parentId][positionOfCurrentSelectedObject + 1].getId());
									}	
								}
							}
						}
	
						if(_curSelectedObject != null && originalSelectedItem != _curSelectedObject){
							_scrollIntoView(_curSelectedObject.getDomElement());
						}
					}
					
					e.stopPropagation();
					return false;
					
					
				case CONST_VK_LEFT: // left
					
					if(_curSelectedObject != null){
						function _goToParent(){
							if(_curSelectedObject.getParentId() != null && _getObject(_curSelectedObject.getParentId())){
								var parentId = _curSelectedObject.getParentId();
								_toggleFocus(_curSelectedObject.getId());
								_toggleFocus(parentId);
							}
						}

						switch(_curSelectedObject.getType()){
						case "channel":
							
							if(_curSelectedObject.isOpened()){
								_curSelectedObject.toggleVisibility();
							}
							else{
								_goToParent();
							}
							
							break;
							
						default:
							_goToParent();
							break;
						}
					}
					
					e.stopPropagation();
					return false;
					
				case CONST_VK_RIGHT: // right
					if(_curSelectedObject != null){
						function _goToChild(){
							if(_curSelectedObject.getChildren() != null && _curSelectedObject.getChildren().length > 0){
								var firstChild = _curSelectedObject.getChildren()[0];
								_toggleFocus(_curSelectedObject.getId());
								_toggleFocus(firstChild.getId());
							}
						}

						if(_curSelectedObject.getType() == "channel"){
							if(_curSelectedObject.isClosed()){
								_curSelectedObject.toggleVisibility();
							}
							else{
								_goToChild();
							}
						}
					}
					
					e.stopPropagation();
					return false;
					
					
				case CONST_VK_RENAME:
					if(_curSelectedObject != null){
						_curSelectedObject.getDomElement().find("> span.structureitem").dblclick();
					}
					
					e.stopPropagation();
					return false;
					
				case CONST_VK_DELETE:
					if(_curSelectedObject != null){
						var rem = _curSelectedObject.getDomElement().find("> span.actions > span.remove");
						if(rem.is(":visible")){
							rem.click();
						}
					}
					
					e.stopPropagation();
					return false;
					
				case CONST_VK_ADD:
					if(_curSelectedObject != null){
						var add = _curSelectedObject.getDomElement().find("> span.actions > span.add");
						if(add.is(":visible")){
							add.click();
						}
					}

					e.stopPropagation();
					return false;
				}
			}
		});
		_updateAllActions();
		$(document).disableSelection();
		window.focus();
	}
	
	function _updateAllActions(){
		for(var i in _curObjects){
			_getObject(i).updateActions();
		}
	}
	
	function _removeAddServiceInstanceSelectServiceIfRequired(){
		if(_state == CONST_STATE_ADD_SERVICE_INSTANCE_SELECT_SERVICE){
			$(".select-service").remove();
			_state = CONST_STATE_IDLE;
			_curSelectedService = null;
		}
	}
	
	function _removeAddServiceInstanceInsertTitleIfRequired(){
		if(_state == CONST_STATE_ADD_SERVICE_INSTANCE_SET_TITLE){
			$(".insert-title").remove();
			_state = CONST_STATE_IDLE;
		}
	}
	
	function _removeAddEntrySelectTypeIfRequired(){
		if(_state == CONST_STATE_ADD_SELECT_TYPE){
			_curSelectedAddOption = null;
			$(".add-entry-select-type").remove();
			_state = CONST_STATE_IDLE;
		}
	}
	
	function _removeInsertTitleIfRequired(){
		if(	_state == CONST_STATE_ADD_CHANNEL_SET_TITLE
			|| _state == CONST_STATE_ADD_CHANNEL_TEMPLATE_SET_TITLE
			|| _state == CONST_STATE_ADD_PAGE_SET_TITLE
			|| _state == CONST_STATE_ADD_PAGE_TEMPLATE_SET_TITLE
			|| _state == CONST_STATE_ADD_SERVICE_INSTANCE_SET_TITLE
			)
		{
			$(".insert-title").remove();
			_state = CONST_STATE_IDLE;
		}
	}
	
	function _renderChannel(parentElem, id, isRoot){
		var channelJson = readObjectTree(id);
		if(isRoot && channelJson)
			channelJson.isRoot = true;
		
		var values = [
			channelJson
		];
		
		var renderedTemplate = $.tmpl($("#render-channel-template"), values);
    	parentElem.append(renderedTemplate);
    	
    	_createObject(channelJson);
	}
	
	var _structureObjectFactory = {
			create: function(jsonObject){
				switch(jsonObject.type){
				case "channel":
					return new Channel(jsonObject.key, jsonObject.title, jsonObject.parentId, jsonObject.position, jsonObject.isTemplate != null && jsonObject.isTemplate != undefined && jsonObject.isTemplate);
					
				case "page":
					return new Page(jsonObject.key, jsonObject.title, jsonObject.parentId, jsonObject.position, jsonObject.isTemplate != null && jsonObject.isTemplate != undefined && jsonObject.isTemplate);
					
				case "serviceinstance":
					return new ServiceInstance(jsonObject.key, jsonObject.title, jsonObject.parentId, null);
				
				default:
					throw "Unexpected type found.";
				}
			}
	};
	
	function _createObject(objectJson){
		var createdObj = _structureObjectFactory.create(objectJson);
		_curObjects[createdObj.getId()] = createdObj;
    	if(objectJson.children){
    		for(var i in objectJson.children){
    			var child = objectJson.children[i];
    			var createdChild = _createObject(child);
    			
    			if(_objectsByParentMap[createdObj.getId()] == undefined || _objectsByParentMap[createdObj.getId()] == null)
    				_objectsByParentMap[createdObj.getId()] = new Array();
    			
    			_objectsByParentMap[createdObj.getId()].push(createdChild);
    		}
    	}
    	
    	return createdObj;
	}

	function readObjectTree(id){
		var json;
		$.ajax(g_LumisRoot_href + "lumis/api/rest/lum-internal/admin/portal-studio/channeltree/getpartialinitialtree/" + id + "/all",{
			async: false,
			dataType: 'json',
			complete: function(jqXHR, text){
				json = $.parseJSON(jqXHR.responseText);
			}
		});
		
		// sort the channel children (if any) in the following order:
		// 		service instance
		// 		page
		// 		page template
		// 		channel
		// 		channel template
		if(json && json.children){
			json.children.sort(function(a, b){
				if(a.type == "serviceinstance" && b.type == "serviceinstance")
					return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
				
				if(a.type == "serviceinstance")
					return -1;
				
				if(b.type == "serviceinstance")
					return 1;
				
				var isATemplate = a.isTemplate;
				var isBTemplate = b.isTemplate;
				
				if(a.type == "page" && !isATemplate && b.type == "page" && !isBTemplate){
					var aPosition = a.position;
					var bPosition = b.position;
					if(aPosition < bPosition)
						return -1;
					else if(aPosition > bPosition)
						return 1;
					
					return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
				}
				
				if(a.type == "page" && !isATemplate)
					return -1;
				
				if(b.type == "page" && !isBTemplate)
					return 1;
				
				if(a.type == "page" && isATemplate && b.type == "page" && isBTemplate){
					var aPosition = a.position;
					var bPosition = b.position;
					if(aPosition < bPosition)
						return -1;
					else if(aPosition > bPosition)
						return 1;
					
					return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
				}
				
				if(a.type == "page" && isATemplate)
					return -1;
				
				if(b.type == "page" && isBTemplate)
					return 1;
				
				if(a.type == "channel" && !isATemplate && b.type == "channel" && !isBTemplate){
					var aPosition = a.position;
					var bPosition = b.position;
					if(aPosition < bPosition)
						return -1;
					else if(aPosition > bPosition)
						return 1;
					
					return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
				}
				
				if(a.type == "channel" && !isATemplate)
					return -1;
				
				if(b.type == "channel" && !isBTemplate)
					return 1;
				
				if(a.type == "channel" && isATemplate && b.type == "channel" && isBTemplate){
					var aPosition = a.position;
					var bPosition = b.position;
					if(aPosition < bPosition)
						return -1;
					else if(aPosition > bPosition)
						return 1;
					
					return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
				}
				
				if(a.type == "channel" && isATemplate)
					return -1;
				
				if(b.type == "channel" && isBTemplate)
					return 1;
				
				// should never reach this point of code
				return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
			});
			
			// fill parent ids
			var fillParentIds = function(obj){
				if(obj && obj.children){
					for(var i in obj.children){
						obj.children[i].parentId = obj.key;
						fillParentIds(obj.children[i]);
					}	
				}
			};
			
			fillParentIds(json);
		}
		return json;
	}
	
	function _removeItemFromArray(item, array){
		var newArray = [];
		for(var i = 0; i < array.length; i++){
			var child = array[i];
			if(child != item){
				newArray.push(child);
			}
		}
		
		return newArray;
	}
	
	function _checkState(expected){
		if(_state != expected)
			throw "Unexpected state. Found: " + _state + ", expected: " + expected;
	}
	
	function _generateNewId(){
		return "new-" + _newIdCount++;
	}
	
	function _addAction(action){
		_actions.push(action);
	}
	
	function _getObject(id){
		return _curObjects[id];
	}
	
	this.toJSON = function(){
		if(_state != CONST_STATE_IDLE)
			_cancelAction();
		
		var obj = {
			actions: _actions,
			structureRoot: _rootChannel.toJSON()
		};
		
		return JSON.stringify(obj);
	};
};