/* $Revision: 17226 $ $Date: 2015-04-15 18:55:33 -0300 (Wed, 15 Apr 2015) $ */
(function(){
	// create the command to be executed when the button is pressed
	var command = {
		exec:function(editor){
			var globals = $_LumisCKEDITORGlobalVariables[editor.name];
			setTimeout("LumisLightBox.open('" + g_LumisRootPath + "main.jsp?lumPageId=" + g_LumisPageId + 
																	"&lumChannelId=" + g_LumisChannelId +
																	"&serviceInstanceId=" + globals.serviceInstanceId +
																	"&sourceId="+ globals.sourceId +
																	"&fieldId="+ globals.fieldId +
																	"&lumRTI=lumis.service.doui.htmlsnippet.addHtmlSnippet" +
																	"&callbackFunction=LumisPortal.opener.CKEDITOR.instances." + editor.name + ".LumisHtmlSnippetCommand.callbackFunction" +
																	"',{width:830,height:560,showCloseButton:true})", 0);
		}
	},
	
	// add the plugin
	commandName = 'lumisHtmlSnippet';
	
	CKEDITOR.plugins.add(commandName, {
		
		// supported languages
		lang : [ 'en', 'pt-br' ],
		
		// plugin initialization function
		init:function(editor){
			
			// define the plugin handler object for this editor
			editor.LumisHtmlSnippetCommand = {
					
					// define the callback function
					callbackFunction : function(html) {
						editor.insertHtml(html);
						
						// focus the editor
						editor.focusManager.focus();
					}
			};
			
			// adds the command to be executed when the button is pressed
			editor.addCommand(commandName, command);
			
			// adds the button to the editor
			editor.ui.addButton(commandName, {
				    label: editor.lang.lumisHtmlSnippet.buttonTitle, 
				    icon:this.path+"../../../htmleditor/plugins/lumisHtmlSnippet/htmlSnippet.gif",
				    command: commandName
			    });
		}
	}); 
})();

