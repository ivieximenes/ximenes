/* $Revision: 15947 $ $Date: 2013-10-25 16:42:52 -0200 (Fri, 25 Oct 2013) $ */
(function(){
	// create the command to be executed when the button is pressed
	var command = {
		exec:function(editor){
			var url = g_LumisRootPath + "lumis/service/htmlevaluation/UrlAccessibilityEvaluation.jsp?contentHtml="+editor.getData();
			var error = false;
			$.ajax({
				async		:	false,
				success		: 	function(data, textStatus, jqXHR) {
									window.$_LumisURLAccessibilityEvaluation[editor.name] = data;
								},
				url			:	url,
				type		:	'get',
				error		:	function(jqXHR, textStatus, errorThrown) {
									error = true;
									alert(editor.lang.lumisURLAccessibilityEvaluation.errorMessage);
								},
				accepts		:	'text/html'
			});
			
			if(!error)
			{
				setTimeout(function(){
					LumisLightBox.open(g_LumisRootPath + 'main.jsp?lumPageId=' + g_LumisPageId + '&lumChannelId=' + g_LumisChannelId + '&lumRTI=lumis.service.htmlevaluation.validationResults&editorName=' + editor.name,
						{
							width:830,
							height:540,
							showCloseButton:true
						})
				}, 0);
			}
		}
	},
	
	// add the plugin
	commandName = 'lumisURLAccessibilityEvaluation';
	
	CKEDITOR.plugins.add(commandName, {
		
		// supported languages
		lang : [ 'en', 'pt-br' ],
		
		// plugin initialization function
		init:function(editor){
		
			// creates the array to store the html value
			window.$_LumisURLAccessibilityEvaluation=window.$_LumisURLAccessibilityEvaluation||new Array();
		
			// adds the command to be executed when the button is pressed
			editor.addCommand(commandName, command);
			
			// adds the button to the editor
			editor.ui.addButton(commandName, {
				    label: editor.lang.lumisURLAccessibilityEvaluation.buttonTitle, 
				    icon:this.path+"../../../htmleditor/plugins/lumisURLAccessibilityEvaluation/image.gif",
				    command: commandName
			    });
		}
	}); 
})();

