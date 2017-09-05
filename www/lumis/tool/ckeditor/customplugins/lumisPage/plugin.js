/* $Revision: 15952 $ $Date: 2013-10-29 14:06:41 -0200 (Tue, 29 Oct 2013) $ */
(function(){
	// create the command to be executed when the button is pressed
	var command = {
		exec:function(editor){
			editor.LumisPageCommand.selection = editor.getSelection();
			editor.LumisPageCommand.bookmarks = (editor.LumisPageCommand.selection != null ? 
					editor.LumisPageCommand.selection.createBookmarks("1") : null);
			setTimeout("LumisLightBox.open('" + g_LumisRootPath + "main.jsp?lumPageId=LumisBlankPage&lumChannelId=' + g_LumisChannelId + '&lumRTI=lumis.service.portalmanagement.page.selectPage&scptCallbackFunction=LumisPortal.opener.CKEDITOR.instances." + editor.name + ".LumisPageCommand.callbackFunction"+ ($_LumisCKEDITORGlobalVariables[editor.name].pageId ? "&pageId=" + $_LumisCKEDITORGlobalVariables[editor.name].pageId : "") + "',{width:830,height:540,showCloseButton:true})", 0);
		}
	},
	
	// add the plugin
	commandName = 'lumisPage';
	
	CKEDITOR.plugins.add(commandName, {
		
		// supported languages
		lang : [ 'en', 'pt-br' ],
		
		// plugin initialization function
		init:function(editor){
			
			// define the plugin handler object for this editor
			editor.LumisPageCommand = {
					
					// define the callback function
					callbackFunction : function(channelId, channelPath, pageId, pageName) {
						var lp = LumisPortal;
						var link = lp.mainName + '?' + lp.pageParameterPageIdName + '=' + pageId;
						
						// put back the user's selection (if any) because IE looses it when user clicks in plugin's iframe
						if(editor.LumisPageCommand.bookmarks)
							editor.LumisPageCommand.selection.selectBookmarks(editor.LumisPageCommand.bookmarks); 
						
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
							editor.insertHtml( '<a href="' + link + '">'+LumisPortal.htmlEncode(pageName)+'</a>');
						}
						
						// focus the editor
						editor.focusManager.focus();
					}
			};
			
			// adds the command to be executed when the button is pressed
			editor.addCommand(commandName, command);
			
			// adds the buttonto the editor
			editor.ui.addButton(commandName, {
				    label: editor.lang.lumisPage.buttonTitle, 
				    icon:this.path+"../../../htmleditor/plugins/lumisPage/image.gif",
				    command: commandName
			    });
		}
	}); 
})();

