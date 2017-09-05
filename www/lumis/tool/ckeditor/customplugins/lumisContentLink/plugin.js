/* $Revision: 15947 $ $Date: 2013-10-25 16:42:52 -0200 (Fri, 25 Oct 2013) $ */
(function(){
	// create the command to be executed when the button is pressed
	var command = {
		exec:function(editor){
			editor.LumisContentLinkCommand.selection = editor.getSelection();
			editor.LumisContentLinkCommand.bookmarks = (editor.LumisContentLinkCommand.selection != null ? 
					editor.LumisContentLinkCommand.selection.createBookmarks("1") : null);
			setTimeout("LumisLightBox.open('" + g_LumisRootPath + "lumis/tool/htmleditor/plugins/lumisContentLink/selectContent.jsp?lumPageId=' + g_LumisPageId + '&lumChannelId=' + g_LumisChannelId + " +
					"'&callbackFunction=LumisPortal.opener.CKEDITOR.instances." + editor.name + ".LumisContentLinkCommand.callbackFunction&serviceInstanceId=" + $_LumisCKEDITORGlobalVariables[editor.name].serviceInstanceId + 
					"',{width:830,height:540,showCloseButton:true})", 0);
		}
	},
	
	// add the plugin
	commandName = 'lumisContentLink';
	
	CKEDITOR.plugins.add(commandName, {
		
		// supported languages
		lang : [ 'en', 'pt-br' ],
		
		// plugin initialization function
		init:function(editor){
			
			// define the plugin handler object for this editor
			editor.LumisContentLinkCommand = {
					
					// define the callback function
					callbackFunction : function(title, url) {
						// put back the user's selection (if any) because IE looses it when user clicks in plugin's iframe
						if(editor.LumisContentLinkCommand.bookmarks)
							editor.LumisContentLinkCommand.selection.selectBookmarks(editor.LumisContentLinkCommand.bookmarks); 
						
						if(
							(editor.getSelection() && editor.getSelection().getSelectedText() != null && editor.getSelection().getSelectedText() != '' )
							|| (editor.getSelection() && editor.getSelection().getSelectedElement())
							)
						{
							// if something is selected, add a link to the selection
							var attributes = Array();
							attributes["href"] = url;
							var style = new CKEDITOR.style( { element : 'a', attributes : attributes } );
							style.type = CKEDITOR.STYLE_INLINE;
							style.apply(editor.document);
						}
						else
						{
							// if nothing is selected, add a link with the channel path as the text
							editor.insertHtml( '<a href="' + url + '">'+LumisPortal.htmlEncode(title)+'</a>');
						}
						
						// focus the editor
						editor.focusManager.focus();
					}
			};
			
			// adds the command to be executed when the button is pressed
			editor.addCommand(commandName, command);
			
			// adds the button to the editor
			editor.ui.addButton(commandName, {
				    label: editor.lang.lumisContentLink.buttonTitle, 
				    icon:this.path+"../../../htmleditor/plugins/lumisContentLink/image.gif",
				    command: commandName
			    });
		}
	}); 
})();

