/* $Revision: 16174 $ $Date: 2014-03-11 22:08:35 -0300 (Tue, 11 Mar 2014) $ */
(function(){
	// create the command to be executed when the button is pressed
	var command = {
		exec:function(editor){
			var imagesElementName = $(document.getElementById(editor.name)).attr("name") + "Images";
			var url = g_LumisRootPath + 'main.jsp?lumPageId=' + g_LumisPageId 
				+ '&lumRTI=lumis.service.doui.filelist.imageFilesAdministration'
				+ '&filesId='+ document.getElementsByName(imagesElementName)[0].value 
				+ '&files.sourceId=' + $_LumisCKEDITORGlobalVariables[editor.name].sourceId
				+ '&files.fieldId=' + editor.name+ 'Images'
				+ '&files.serviceInstanceId=' + $_LumisCKEDITORGlobalVariables[editor.name].serviceInstanceId
				+ '&selectImageCallbackFunction=LumisPortal.opener.CKEDITOR.instances.' + editor.name + '.LumisLocalImageCommand.callbackFunction';
			var lightboxProperties = "{width:830,height:540,showCloseButton:true}";
			setTimeout("LumisLightBox.open('" + url + "'," + lightboxProperties + ")", 0);
		}
	},
	
	// add the plugin
	commandName = 'lumisLocalImage';
	
	CKEDITOR.plugins.add(commandName, {
		
		// supported languages
		lang : [ 'en', 'pt-br' ],
		
		// plugin initialization function
		init:function(editor){
			
			// define the plugin handler object for this editor
			editor.LumisLocalImageCommand = {
					
					// define the callback function
					callbackFunction : function(url, title) {
						editor.insertHtml('<img src="'+ g_LumisRoot_href + LumisPortal.htmlEncode(url) + '" alt="'+LumisPortal.htmlEncode(title)+'" />');
						
						// focus the editor
						editor.focusManager.focus();
					}
			};
			
			// adds the command to be executed when the button is pressed
			editor.addCommand(commandName, command);
			
			// adds the buttonto the editor
			editor.ui.addButton(commandName, {
				    label: editor.lang.lumisLocalImage.buttonTitle, 
				    icon:this.path+"../../../htmleditor/plugins/lumisLocalImage/image.gif",
				    command: commandName
			    });
		}
	}); 
})();

