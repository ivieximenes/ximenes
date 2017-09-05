/* $Revision: 15947 $ $Date: 2013-10-25 16:42:52 -0200 (Fri, 25 Oct 2013) $ */
(function(){
	// create the command to be executed when the button is pressed
	var command = {
		exec:function(editor){
			editor.LumisWikiLinkArticleCommand.selection = editor.getSelection();
			editor.LumisWikiLinkArticleCommand.bookmarks = (editor.LumisWikiLinkArticleCommand.selection != null ? 
					editor.LumisWikiLinkArticleCommand.selection.createBookmarks("1") : null);
			
			var url = g_LumisRootPath+'lumis/tool/htmleditor/plugins/lumisWikiLinkArticle/selectArticle.jsp?'
				 + 'lumPageId=' + window.parent.g_LumisPageId
				 + '&serviceInstanceId=' + window.parent.$_LumisCKEDITORGlobalVariables[editor.name].serviceInstanceId 
				 + '&lumRTI=lumis.service.wiki.linkArticle'
				 + '&callbackFunction=CKEDITOR.instances.' + editor.name + '.LumisWikiLinkArticleCommand.callbackFunction';
			
			var lightboxOpts = "{width: 830, height: 540, showCloseButton: true}";
			setTimeout("window.parent.LumisLightBox.open('" + url + "'," + lightboxOpts + ")", 0);
		}
	},
	
	// add the plugin
	commandName = 'lumisWikiLinkArticle';
	
	CKEDITOR.plugins.add(commandName, {
		
		// supported languages
		lang : [ 'en', 'pt-br' ],
		
		// plugin initialization function
		init:function(editor){
			
			// define the plugin handler object for this editor
			editor.LumisWikiLinkArticleCommand = {
					
					// define the callback function
					callbackFunction : function(defaultTitle, url) {
						// put back the user's selection (if any) because IE looses it when user clicks in plugin's iframe
						if(editor.LumisWikiLinkArticleCommand.bookmarks)
							editor.LumisWikiLinkArticleCommand.selection.selectBookmarks(editor.LumisWikiLinkArticleCommand.bookmarks); 
						
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
							editor.insertHtml( '<a href="' + url + '">'+LumisPortal.htmlEncode(defaultTitle)+'</a>');
						}
						
						// focus the editor
						editor.focusManager.focus();
					}
			};
			
			// adds the command to be executed when the button is pressed
			editor.addCommand(commandName, command);
			
			// adds the buttonto the editor
			editor.ui.addButton(commandName, {
				    label: editor.lang.lumisWikiLinkArticle.buttonTitle, 
				    icon:this.path+"../../../htmleditor/plugins/lumisWikiLinkArticle/image.gif",
				    command: commandName
			    });
		}
	}); 
})();

