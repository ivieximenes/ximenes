/* $Revision: 15947 $ $Date: 2013-10-25 16:42:52 -0200 (Fri, 25 Oct 2013) $ */
(function(){
	// create the command to be executed when the button is pressed
	var command = {
		exec:function(editor){
			editor.LumisChannelCommand.selection = editor.getSelection();
			editor.LumisChannelCommand.bookmarks = (editor.LumisChannelCommand.selection != null ? 
					editor.LumisChannelCommand.selection.createBookmarks("1") : null);
			setTimeout("LumisLightBox.open('" + g_LumisRootPath + "main.jsp?lumPageId=' + g_LumisPageId + '&lumChannelId=' + g_LumisChannelId + '&lumRTI=lumis.service.portalmanagement.channel.selectChannel&scptCallbackFunction=LumisPortal.opener.CKEDITOR.instances." + editor.name + ".LumisChannelCommand.callbackFunction',{width:830,height:540,showCloseButton:true})", 0);
		}
	},
	
	// add the plugin
	commandName = 'lumisChannel';
	
	CKEDITOR.plugins.add(commandName, {
		
		// supported languages
		lang : [ 'en', 'pt-br' ],
		
		// plugin initialization function
		init:function(editor){
			
			// define the plugin handler object for this editor
			editor.LumisChannelCommand = {
					
					// define the callback function
					callbackFunction : function(channelId, channelPath, pageId) {
						var lp = LumisPortal;
						var link = lp.mainName + '?' + lp.pageParameterChannelIdName + '=' + channelId;
						
						// put back the user's selection (if any) because IE looses it when user clicks in plugin's iframe
						if(editor.LumisChannelCommand.bookmarks)
							editor.LumisChannelCommand.selection.selectBookmarks(editor.LumisChannelCommand.bookmarks); 
						
						if(
							(editor.getSelection() && editor.getSelection().getSelectedText() != null && editor.getSelection().getSelectedText() != '' )
							|| (editor.getSelection() && editor.getSelection().getSelectedElement())
							)
						{
							// if something is selected, add a link to the selection
							var attributes = Array();
							attributes["href"] = link;
							var style = new CKEDITOR.style( { element : 'a', attributes : attributes } );
							style.type = CKEDITOR.STYLE_INLINE;
							style.apply(editor.document);
						}
						else
						{
							// if nothing is selected, add a link with the channel path as the text
							editor.insertHtml( '<a href="' + link + '">'+LumisPortal.htmlEncode(channelPath)+'</a>');
						}
						
						// focus the editor
						editor.focusManager.focus();
					}
			};
			
			// adds the command to be executed when the button is pressed
			editor.addCommand(commandName, command);
			
			// adds the buttonto the editor
			editor.ui.addButton(commandName, {
				    label: editor.lang.lumisChannel.buttonTitle, 
				    icon:this.path+"../../../htmleditor/plugins/lumisChannel/image.gif",
				    command: commandName
			    });
		}
	}); 
})();

