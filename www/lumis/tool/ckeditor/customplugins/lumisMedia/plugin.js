/* $Revision: 16671 $ $Date: 2014-12-03 18:17:29 -0200 (Wed, 03 Dec 2014) $ */
(function(){
	// create the command to be executed when the button is pressed
	var command = {
		exec:function(editor){
			setTimeout(function(){
				LumisLightBox.open(
						g_LumisRootPath + 'lumis/tool/htmleditor/plugins/lumisImage/selectImage.jsp?lumPageId=' 
						+ g_LumisPageId + '&lumChannelId=' + g_LumisChannelId 
						+ '&callbackFunction=LumisPortal.opener.CKEDITOR.instances.' + editor.name 
						+ '.LumisMediaCommand.callbackFunction&serviceInstanceId=' 
						+ $_LumisCKEDITORGlobalVariables[editor.name].serviceInstanceId,
						{
							width:830,
							height:540,
							showCloseButton	: true
						}
				)
			}, 0);
		}
	},
	
	// add the plugin
	commandName = 'lumisMedia';
	
	CKEDITOR.plugins.add(commandName, {
		
		// supported languages
		lang : [ 'en', 'pt-br' ],
		
		// plugin initialization function
		init:function(editor){
			
			// define the plugin handler object for this editor
			editor.LumisMediaCommand = {
					
					// define the callback function
					callbackFunction : function(id, title, filename, url, inlineUrl, legend, size, macrotype, contentType) {
						if (url.indexOf('://') == -1)
							url = g_LumisRootPath + url;
						if (inlineUrl.indexOf('://') == -1)
							inlineUrl = g_LumisRootPath + inlineUrl;
						
						var html = "";
						if(contentType != null && contentType == "application/x-shockwave-flash")
						{
							html += "<object classid=\"clsid:d27cdb6e-ae6d-11cf-96b8-444553540000\" codebase=\"http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0\">";
							html += "<param name=\"movie\" value=\"" + inlineUrl + "\" />";
					 		html += "<param name=\"menu\" value=\"false\" />";
					 		html += "<param name=\"quality\" value=\"high\" />";
					 		html += "<embed src=\"" + inlineUrl + "\" menu=\"false\" quality=\"high\" type=\"application/x-shockwave-flash\" pluginspage=\"http://www.macromedia.com/go/getflashplayer\"></embed>";
					 		html += "</object>";
						}
						else if(macrotype == "IMAGE")
						{
							html += "<img src=\"" + inlineUrl + "\" alt=\"" + title + "\" />";
						}
						else if(macrotype == "VIDEO")
						{
							html += "<video src=\"" + inlineUrl + "\" controls=\"controls\"/>";
						}
						else if(macrotype == "AUDIO")
						{
							html += "<audio src=\"" + inlineUrl + "\" controls=\"controls\"/>";
						}
						else if(url != "" && title != "")
						{
							html += "<a href=\"" + url + "\">" + title + "</a>";
						}

						if(html != "")
							editor.insertHtml(html);
						
						// focus the editor
						editor.focusManager.focus();
					}
			};
			
			// adds the command to be executed when the button is pressed
			editor.addCommand(commandName, command);
			
			// adds the button to the editor
			editor.ui.addButton(commandName, {
				    label: editor.lang.lumisMedia.buttonTitle, 
				    icon:this.path+"../../../htmleditor/plugins/lumisImage/image.gif",
				    command: commandName
			    });
		}
	}); 
})();

