// $Revision: 14842 $ $Date: 2012-10-23 12:54:24 -0200 (Tue, 23 Oct 2012) $

	if(typeof(LumisPortalWSRP) == 'undefined')
	{
		var LumisPortalWSRP = new WSRPLumisPortal();
	}
	
	function WSRPLumisPortal()
	{
		this.onSubmitForm = onSubmitForm;
		this.onRefresh = onRefresh;
		this.addMessage = addMessage;
		
		function onSubmitForm(formName, destId, destType, bProcessAction, includeAnchor, updateElementId)
		{
			var curForm = document.forms[formName];
			curForm.submit();
		}
		
		function onRefresh()
		{
			document.location.reload();
		}

		function addMessage(message)
		{
			alert(message);
		}
		
		this.executeReplaceInterfaceCommands = function(form, interfaceInstanceId, commands, parameters)
		{
			form.elements['lumWSRPReplIntfCommands'].value=commands;
			if(parameters)
				form.elements['lumWSRPReplIntfParams'].value=parameters;
			onSubmitForm(form.id||form.name, interfaceInstanceId, null, false);
		}
		
		this.closeInterfaceInstance = function(interfaceInstanceId, formName)
		{
			if(interfaceInstanceId)
			{
				if(formName == null)
					formName = "Form_" + interfaceInstanceId;
				
				var formAction = document.forms[formName].action;
				var parameterFindPattern = encodeURIComponent("lumWSRPReplIntfState=");
				var indexOfReplaceInterfaceParameter = formAction.indexOf(parameterFindPattern);
				if(indexOfReplaceInterfaceParameter != -1)
				{
					var state = formAction.substr(indexOfReplaceInterfaceParameter + parameterFindPattern.length);
					var indexOfAmpersand = state.indexOf("&");
					if(indexOfAmpersand != -1)
					{
						state = state.substr(0, indexOfAmpersand);
					}
					
					if(state.indexOf(interfaceInstanceId) != -1)
					{
						document.forms[formName].elements['lumWSRPReplIntfCommands'].value = 'r';
						onSubmitForm(formName, interfaceInstanceId, null, false);
						return;
					}
				}
			}
		}
		
		this.opener = null;
	}

