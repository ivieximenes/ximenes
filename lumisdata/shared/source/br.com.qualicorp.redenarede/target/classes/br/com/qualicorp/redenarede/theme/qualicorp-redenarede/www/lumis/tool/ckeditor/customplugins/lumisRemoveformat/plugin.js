(function () {
	
	var listNodeNames = { ol: 1, ul: 1 };
	
	CKEDITOR.plugins.add( 'lumisRemoveformat', {
		// jscs:disable maximumLineLength
		lang: 'af,ar,bg,bn,bs,ca,cs,cy,da,de,de-ch,el,en,en-au,en-ca,en-gb,eo,es,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn', // %REMOVE_LINE_CORE%
		// jscs:enable maximumLineLength
		icons: 'lumisRemoveformat', // %REMOVE_LINE_CORE%
		hidpi: true, // %REMOVE_LINE_CORE%
		init: function( editor ) {
			editor.addCommand( 'lumisRemoveformat', CKEDITOR.plugins.lumisRemoveformat.commands.lumisRemoveformat );
			editor.ui.addButton && editor.ui.addButton( 'lumisRemoveformat', {
				label: editor.lang.removeformat.toolbar,
				command: 'lumisRemoveformat',
				toolbar: 'cleanup,10'
			} );
		}
	} );
	
	CKEDITOR.plugins.lumisRemoveformat = {
		commands: {
			lumisRemoveformat: {
				exec: function( editor ) {
					
					var tagsRegex = editor._.removeFormatRegex || ( editor._.removeFormatRegex = new RegExp( '^(?:' + editor.config.lumisRemoveformatTags.replace( /,/g, '|' ) + ')$', 'i' ) );
	
					var removeAttributes = editor._.removeAttributes || ( editor._.removeAttributes = editor.config.lumisRemoveformatAttributes.split( ',' ) ),
						filter = CKEDITOR.plugins.lumisRemoveformat.filter,
						ranges = editor.getSelection().getRanges(),
						iterator = ranges.createIterator(),
						isElement = function( element ) {
							return element.type == CKEDITOR.NODE_ELEMENT;
						},
						range;
	
					while ( ( range = iterator.getNextRange() ) )
					{
						if ( !range.collapsed )
							range.enlarge( CKEDITOR.ENLARGE_ELEMENT );
	
						// Bookmark the range so we can re-select it after processing.
						var bookmark = range.createBookmark(),
							// The style will be applied within the bookmark boundaries.
							startNode = bookmark.startNode,
							endNode = bookmark.endNode,
							currentNode;
	
						// We need to check the selection boundaries (bookmark spans) to break
						// the code in a way that we can properly remove partially selected nodes.
						// For example, removing a <b> style from
						//		<b>This is [some text</b> to show <b>the] problem</b>
						// ... where [ and ] represent the selection, must result:
						//		<b>This is </b>[some text to show the]<b> problem</b>
						// The strategy is simple, we just break the partial nodes before the
						// removal logic, having something that could be represented this way:
						//		<b>This is </b>[<b>some text</b> to show <b>the</b>]<b> problem</b>
	
						var breakParent = function( node )
						{
								// Let's start checking the start boundary.
								var path = editor.elementPath( node ),
									pathElements = path.elements;
	
								for ( var i = 1, pathElement; pathElement = pathElements[ i ]; i++ )
								{
									if ( pathElement.equals( path.block ) || pathElement.equals( path.blockLimit ) )
										break;
	
									// If this element can be removed (even partially).
									if ( tagsRegex.test( pathElement.getName() ) && filter( editor, pathElement ) )
										node.breakParent( pathElement );
								}
						};
	
						breakParent( startNode );
						
						if ( endNode ) {
							breakParent( endNode );
	
							// Navigate through all nodes between the bookmarks.
							currentNode = startNode.getNextSourceNode( true, CKEDITOR.NODE_ELEMENT );
	
							while ( currentNode )
							{
								// If we have reached the end of the selection, stop looping.
								if ( currentNode.equals( endNode ) )
									break;
	
								if ( currentNode.isReadOnly() )
								{
									// In case of non-editable we're skipping to the next sibling *elmenet*.
	
									// We need to be aware that endNode can be nested within current non-editable.
									// This condition tests if currentNode (non-editable) contains endNode. If it does
									// then we should break the filtering
									if ( currentNode.getPosition( endNode ) & CKEDITOR.POSITION_CONTAINS )
									{
										break;
									}
	
									currentNode = currentNode.getNext( isElement );
									continue;
								}
	
								// Cache the next node to be processed. Do it now, because
								// currentNode may be removed.
								var nextNode = currentNode.getNextSourceNode( false, CKEDITOR.NODE_ELEMENT ),
									isFakeElement = currentNode.getName() == 'img' && currentNode.data( 'cke-realelement' );
	
								// This node must not be a fake element, and must not be read-only.
								if ( !isFakeElement && filter( editor, currentNode ) )
								{
									// Remove elements nodes that match with this style rules.
									if ( tagsRegex.test( currentNode.getName() ) )
									{
										currentNode.remove( 1 );
									}
									else
									{
										currentNode.removeAttributes( removeAttributes );
										editor.fire( 'removeFormatCleanup', currentNode );
									}
								}
	
								currentNode = nextNode;
							}
						}
	
						range.moveToBookmark( bookmark );
					}
	
					// The selection path may not changed, but we should force a selection
					// change event to refresh command states, due to the above attribution change. (#9238)
					editor.forceNextSelectionCheck();
					editor.getSelection().selectRanges( ranges );
					
					
					
					
					
					//ADICIONANDO A REMOÇÂO DE BULLET E LIST
					(function () {
						
						var config = editor.config,
						selection = editor.getSelection(),
						ranges = selection && selection.getRanges();
						
						var rangesBoumdFakes = getRangesBoundFakes(ranges, editor);
						
						// Group the blocks up because there are many cases where multiple lists have to be created,
						// or multiple lists have to be cancelled.
						var listGroups = [],
							database = {},
							rangeIterator = ranges.createIterator(),
							index = 0;

						while ( ( range = rangeIterator.getNextRange() ) && ++index )
						{
							var boundaryNodes = range.getBoundaryNodes(),
								startNode = boundaryNodes.startNode,
								endNode = boundaryNodes.endNode;

							if ( startNode.type == CKEDITOR.NODE_ELEMENT && startNode.getName() == 'td' )
								range.setStartAt( boundaryNodes.startNode, CKEDITOR.POSITION_AFTER_START );

							if ( endNode.type == CKEDITOR.NODE_ELEMENT && endNode.getName() == 'td' )
								range.setEndAt( boundaryNodes.endNode, CKEDITOR.POSITION_BEFORE_END );

							var iterator = range.createIterator(),
								block;

							//iterator.forceBrBreak = ( this.state == CKEDITOR.TRISTATE_OFF );

							while ( ( block = iterator.getNextParagraph() ) )
							{
								if (range.endContainer.equals(block))
									continue;
								
								// Avoid duplicate blocks get processed across ranges.
								if ( block.getCustomData( 'list_block' ) )
									continue;
								else
									CKEDITOR.dom.element.setMarker( database, block, 'list_block', 1 );

								var path = editor.elementPath( block ),
									pathElements = path.elements,
									pathElementsCount = pathElements.length,
									processedFlag = 0,
									blockLimit = path.blockLimit,
									element;

								// First, try to group by a list ancestor.
								for ( var i = pathElementsCount - 1; i >= 0 && ( element = pathElements[ i ] ); i-- )
								{
									// Don't leak outside block limit (#3940).
									if ( listNodeNames[ element.getName() ] && blockLimit.contains( element ) ) {
										// If we've encountered a list inside a block limit
										// The last group object of the block limit element should
										// no longer be valid. Since paragraphs after the list
										// should belong to a different group of paragraphs before
										// the list. (Bug #1309)
										blockLimit.removeCustomData( 'list_group_object_' + index );

										var groupObj = element.getCustomData( 'list_group_object' );
										if ( groupObj )
										{
											groupObj.contents.push( block );
										}
										else
										{
											groupObj = { root: element, contents: [ block ] };
											listGroups.push( groupObj );
											CKEDITOR.dom.element.setMarker( database, element, 'list_group_object', groupObj );
										}
										
										processedFlag = 1;
										break;
									}
								}

								if ( processedFlag )
									continue;

								// No list ancestor? Group by block limit, but don't mix contents from different ranges.
								var root = blockLimit;
								
								if ( root.getCustomData( 'list_group_object_' + index ) )
								{
									root.getCustomData( 'list_group_object_' + index ).contents.push( block );
								}
								else
								{
									groupObj = { root: root, contents: [ block ] };
									CKEDITOR.dom.element.setMarker( database, root, 'list_group_object_' + index, groupObj );
									listGroups.push( groupObj );
								}
							}
						}
						
						
						var listsCreated = [];
						
						while ( listGroups.length > 0 )
						{
							groupObj = listGroups.shift();
							
							if( listNodeNames[ groupObj.root.getName() ] )
							{
								removeList.call( this, editor, groupObj, database );
							}
						}
						
						

						
						
						// Clean up, restore selection and update toolbar button states.
						CKEDITOR.dom.element.clearAllMarkers( database );
						editor.focus();
						
						var rangesBoumd = [];
						
						//ACERTANDO A SELEÇÂO DO TEXTO						
						for ( var i = 0; i < rangesBoumdFakes.length; i++ )
						{
							var boundaryNodes = rangesBoumdFakes[i];
							
							var start = isBody(boundaryNodes.startNode) ? boundaryNodes.startNode.getChild(0) : getNext(boundaryNodes.startNode);
							var startList = getParentList(start);
							
							if (startList)
								start = getNext(startList);
							
							var end = isBody(boundaryNodes.endNode) ? boundaryNodes.endNode.getChild(boundaryNodes.endNode.getChildCount() - 1) : getPrevious(boundaryNodes.endNode);
							var endList = getParentList(end);
							
							if (endList)
								end = getPrevious(endList);
							
							var range = editor.createRange();
							
							if ( start )
								range.setStartAt( start, CKEDITOR.POSITION_AFTER_START );
	
							if ( end )
								range.setEndAt( end, CKEDITOR.POSITION_BEFORE_END );
							
							rangesBoumd.push(range);
						}
						
						editor.getSelection().selectRanges( rangesBoumd );
					})();
					
				}
			}
		},
	
		// Perform the remove format filters on the passed element.
		// @param {CKEDITOR.editor} editor
		// @param {CKEDITOR.dom.element} element
		filter: function( editor, element ) {
			// If editor#addRemoveFotmatFilter hasn't been executed yet value is not initialized.
			var filters = editor._.removeFormatFilters || [];
			for ( var i = 0; i < filters.length; i++ ) {
				if ( filters[ i ]( element ) === false )
					return false;
			}
			return true;
		}
	};
	
	 /*
	 * **Note:** Only available with the existence of `lumisRemoveformat` plugin.
	 *
	 *		// Don't remove empty span.
	 *		editor.addRemoveFormatFilter( function( element ) {
	 *			return !( element.is( 'span' ) && CKEDITOR.tools.isEmpty( element.getAttributes() ) );
	 *		} );
	 *
	 */
	CKEDITOR.editor.prototype.addLumRemoveFormatFilter = function( func ) {
		if ( !this._.removeFormatFilters )
			this._.removeFormatFilters = [];
	
		this._.removeFormatFilters.push( func );
	};
	
	CKEDITOR.config.lumisRemoveformatTags = 'b,big,cite,code,del,dfn,em,font,i,ins,kbd,q,s,samp,small,span,strike,strong,sub,sup,tt,u,var';
	
	CKEDITOR.config.lumisRemoveformatAttributes = 'class,style,lang,width,height,align,hspace,valign';





	
	function removeList( editor, groupObj, database )
	{
		// This is very much like the change list type operation.
		// Except that we're changing the selected items' indent to -1 in the list array.
		var listArray = CKEDITOR.plugins.list.listToArray( groupObj.root, database ),
			selectedListItems = [];

		for ( var i = 0; i < groupObj.contents.length; i++ )
		{
			var itemNode = groupObj.contents[ i ];
			
			itemNode = itemNode.getAscendant( 'li', true );
			
			if ( !itemNode || itemNode.getCustomData( 'list_item_processed' ) )
				continue;
			
			selectedListItems.push( itemNode );
			CKEDITOR.dom.element.setMarker( database, itemNode, 'list_item_processed', true );
		}

		var lastListIndex = null;
		
		for ( i = 0; i < selectedListItems.length; i++ )
		{
			var listIndex = selectedListItems[ i ].getCustomData( 'listarray_index' );
			listArray[ listIndex ].indent = -1;
			lastListIndex = listIndex;
		}

		// After cutting parts of the list out with indent=-1, we still have to maintain the array list
		// model's nextItem.indent <= currentItem.indent + 1 invariant. Otherwise the array model of the
		// list cannot be converted back to a real DOM list.
		for ( i = lastListIndex + 1; i < listArray.length; i++ )
		{
			if ( listArray[ i ].indent > listArray[ i - 1 ].indent + 1 )
			{
				var indentOffset = listArray[ i - 1 ].indent + 1 - listArray[ i ].indent;
				var oldIndent = listArray[ i ].indent;
				
				while ( listArray[ i ] && listArray[ i ].indent >= oldIndent )
				{
					listArray[ i ].indent += indentOffset;
					i++;
				}
				
				i--;
			}
		}

		var newList = CKEDITOR.plugins.list.arrayToList( listArray, database, null, editor.config.enterMode, groupObj.root.getAttribute( 'dir' ) );

		// Compensate <br> before/after the list node if the surrounds are non-blocks.(#3836)
		var docFragment = newList.listNode,
			boundaryNode, siblingNode;

		function compensateBrs( isStart ) {
			if (
				( boundaryNode = docFragment[ isStart ? 'getFirst' : 'getLast' ]() ) &&
				!( boundaryNode.is && boundaryNode.isBlockBoundary() ) &&
				( siblingNode = groupObj.root[ isStart ? 'getPrevious' : 'getNext' ]( CKEDITOR.dom.walker.invisible( true ) ) ) &&
				!( siblingNode.is && siblingNode.isBlockBoundary( { br: 1 } ) )
			) {
				editor.document.createElement( 'br' )[ isStart ? 'insertBefore' : 'insertAfter' ]( boundaryNode );
			}
		}
		compensateBrs( true );
		compensateBrs();

		docFragment.replace( groupObj.root );

		editor.fire( 'contentDomInvalidated' );
	}
	
	
	// Merge list adjacent, of same type lists.
	function mergeListSiblings( listNode )
	{
		function mergeSibling( rtl )
		{
			var sibling = listNode[ rtl ? 'getPrevious' : 'getNext' ]( nonEmpty );
			
			if ( sibling && sibling.type == CKEDITOR.NODE_ELEMENT && sibling.is( listNode.getName() ) )
			{
				// Move children order by merge direction.(#3820)
				mergeChildren( listNode, sibling, null, !rtl );

				listNode.remove();
				listNode = sibling;
			}
		}

		mergeSibling();
		mergeSibling( 1 );
	}

	function getParentList(element)
	{
		while ( element && (!element.$.nodeName || !listNodeNames[element.$.nodeName.toLowerCase()]) )
			element = element.getParent();
		
		return element;
	}
	
	function getNext(element)
	{
		while ( !element.getNext() && !isBody(element) )
			element = element.getParent();
		
		if (isBody(element))
			return element;
		
		return element.getNext();
	}
	
	function getPrevious(element)
	{
		while ( !element.getPrevious() && !isBody(element) )
			element = element.getParent();
		
		if (isBody(element))
			return element;
		
		return element.getPrevious();
	}
	
	function isBody(element)
	{
		return element.$.tagName && element.$.tagName.toLowerCase() == "body"
	}
	
	function getRangesBoundFakes(ranges, editor)
	{
		var rangesBoumd = [];
		
		for (var i = 0; i < ranges.length; i++)
		{
			var rangefake = {};
			
			var range = ranges[i];
			
			var boundaryNodes = range.getBoundaryNodes();
			
			rangefake.startNode = getPrevious(boundaryNodes.startNode);

			var listStartNode = getParentList(boundaryNodes.startNode);
			var listStartNodePrevius = getParentList(rangefake.startNode);
			
			if (listStartNode && listStartNode.equals(listStartNodePrevius))
				rangefake.startNode = getPrevious(listStartNodePrevius);
			
			
			rangefake.endNode = getNext(boundaryNodes.endNode);

			var listEndNode = getParentList(boundaryNodes.endNode);
			var listEndNodePrevius = getParentList(rangefake.endNode);
			
			if (listEndNode && listEndNode.equals(listEndNodePrevius))
				rangefake.endNode = getNext(listEndNodePrevius);
			
			rangesBoumd.push(rangefake);
		}
		
		return rangesBoumd;
	}
})();