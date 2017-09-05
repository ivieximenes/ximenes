// $Revision: 16540 $ $Date: 2014-10-23 16:21:33 -0200 (Thu, 23 Oct 2014) $

/**
 * Auxiliary class to control AJAX calls.
 * @param {String} controllerName - the controller name.
 * @param {boolean} synchronize - indicates if this controller must synchronize AJAX calls.
 */
function LumisChatMessagesController(controllerName, synchronize)
{
	this.controllerName = controllerName;
	var lock = null;
	var xmlhttp = null;
	this.makeHttpRequest = makeHttpRequest;
	this.getXmlHttpObj = getXmlHttpObj;
	
	/**
	 * Makes an HTTP request.
	 * @param {String} url the url.
	 * @param {String} methodString the method string.
	 * @param {Method} onReadyStateChangeMethod the ready change method.
	 * @param {boolean} bReturnXml indicates if a XML should be returned.
	 */
	function makeHttpRequest(url, methodString, onReadyStateChangeMethod, bReturnXml)
	{
		if(synchronize)
		{
			if(lock != null)
			{
				setTimeout(arguments.callee, 10);
				return;
			}
			lock = new Object();
		}
		
		try
		{
			xmlhttp = LumisPortalUtil.getXmlHttpObject();
			LumisPortalUtil.makeHttpRequest(url, methodString, onReadyStateChangeMethod, bReturnXml, xmlhttp);	
		}
		finally
		{
			lock = null;
		}
	}
	
	function getXmlHttpObj()
	{
		return xmlhttp;
	}
}

function LumisChatMessages(element, getMessagesToModerate, conversationId, chatUserId, serviceInterfaceInstanceId)
{
	if(conversationId == null || conversationId.length == 0)
		return;
		
	this.getLatestMessages = getLatestMessages;
	this.rejectMessage = rejectMessage;
	this.approveMessage = approveMessage;
		
	var lastMessageDate = null;
	var timer = window.setTimeout(getLatestMessages, 1);
	
	//-------------------------------------------------------------------
	//-------------------- message controllers --------------------------
	//-------------------------------------------------------------------
	
	var getLatestMessagesChatMessagesController = new LumisChatMessagesController("getLatestMessages", true);
	var rejectMessageChatMessagesController = new LumisChatMessagesController("rejectMessage", true);
	var approveMessageChatMessagesController = new LumisChatMessagesController("approveMessage", true);
	
	//-------------------------------------------------------------------
	
	function getLatestMessages()
	{
		if(timer != null)
		{
			window.clearTimeout(timer);
			timer = null;
		}
		
		var strMethod = "<method name=\"getLatestMessages\">";
		strMethod += "<conversationId>"+conversationId+"</conversationId>";
		strMethod += "<chatUserId>"+chatUserId+"</chatUserId>";
		strMethod += "<serviceInterfaceInstanceId>"+serviceInterfaceInstanceId+"</serviceInterfaceInstanceId>";
		if(lastMessageDate != null)
			strMethod += "<lastMessageDate>"+lastMessageDate+"</lastMessageDate>";
		
		if(getMessagesToModerate == true)
		{
			strMethod += "<getMessagesToModerate>true</getMessagesToModerate>";
			strMethod += "<maxMessages>100</maxMessages>";
		}
		
		strMethod += "</method>";
		getLatestMessagesChatMessagesController.makeHttpRequest(g_LumisRootPath + "lumis/collaboration/chat/controller/xml/ChatControllerXml.jsp", strMethod, onMessagesLoaded, true);
	}

	//-------------------------------------------------------------------

	function onMessagesLoaded()
	{
		var state = getLatestMessagesChatMessagesController.getXmlHttpObj().readyState;
		if(state == 4)
  		{
  			if(insertMessages())
				timer = window.setTimeout(getLatestMessages, 5000);
		}
	}
	
	//-------------------------------------------------------------------

	function updateUsers(xmlDom)
	{
		//Get all users from xmlDom
		var userNodes = xmlDom.getElementsByTagName("user");

		var selectedUserActive = false;

		// obtain chat users select
		var chatUsersSelect = null;
		var selects = document.getElementsByTagName('select');
		for (var i=0; i<selects.length; i++)
		{
			var className = selects[i].parentNode.parentNode && selects[i].parentNode.parentNode.className; 
			if (className && className.search(/\blum-form-field-id-sayTo\b/) !== -1)
			{
				chatUsersSelect = selects[i];
				break;
			}
		}

		if (!chatUsersSelect)
			return;

		// get currently selected user
		var selectedUserId = null;
		var selectedOption = 0;
		if(chatUsersSelect.selectedIndex > -1)
		{
			selectedOption = chatUsersSelect.options[chatUsersSelect.selectedIndex];
			if(selectedOption)
				selectedUserId = selectedOption.value;
		}
		
		if(typeof (userChange) == 'function')
		{
			var userArr = new Array();
			for (var i=0; i<userNodes.length; i++)
			{
				var userId = userNodes[i].getAttribute('id');
				var nameNode = userNodes[i].getElementsByTagName("name");
				var name = nameNode[0].text;
				if (!name)
					name = nameNode[0].textContent;
				
				userArr[userId] = name;
			}

			selectedUserActive = userChange(userArr, selectedUserId);

			userArr.length = 0;
		}
		else
		{
			// delete all but the "everyone" option
			chatUsersSelect.length=1;
	
			// overwrite current options with users from the xml
			var optionIndex=1;
		
			for (var i=0; i<userNodes.length; i++)
			{
				// read user information
				var userId = userNodes[i].getAttribute('id');
				var nameNode = userNodes[i].getElementsByTagName("name");
				var name = nameNode[0].text;
				if (!name)
					name = nameNode[0].textContent;
				
				// insert new option
				var newOpt = new Option(name, userId);
				chatUsersSelect.options[optionIndex] = newOpt;
				
				if (selectedUserId == userId)
				{
					chatUsersSelect.selectedIndex = optionIndex;
					selectedUserActive = true;
				}
	
				optionIndex++;
			}		
		}
		if (selectedUserId != '' && !selectedUserActive)
		{
			chatUsersSelect.selectedIndex = 0;
			if (STR_SELECTED_USER_LEFT)
				alert(STR_SELECTED_USER_LEFT);
		}
	}
	
	//-------------------------------------------------------------------

	function insertMessages()
	{
		try
		{
			LumisPortalUtil.validateResponse(getLatestMessagesChatMessagesController.getXmlHttpObj().responseXML);
		}
		catch(e)
		{
			alert(e.description);
			return false;
		}
		
		// to avoid a firefox text truncation at 4k bytes, uses the responseText, do not use responseXml 
		var responseText = getLatestMessagesChatMessagesController.getXmlHttpObj().responseText;
		// try to find the html tags
		var begin = responseText.indexOf("<html>");
		var end = responseText.lastIndexOf("</html>");
		if(begin != end)
		{
			begin = begin +6;
			// get the text that matter
			var innerHtmlResponse = responseText.substring(begin, end);
			// decode xml
			var response = xmlDecode(innerHtmlResponse);
			if(response != null && response != "")
			{
				// remove lum-last from last element
				if (element.lastChild)
					element.lastChild.className = element.lastChild.className.replace(/ lum-last\b/, '');
				
				// add response into html
				var tempDiv = document.createElement("div");
				tempDiv.innerHTML = response;
				var messageElements = tempDiv.childNodes;
				for (var i=0; i<messageElements.length; i++)
					element.appendChild(messageElements[i]);
				
				// add lum-first to first element's class
				if (element.firstChild.className.indexOf('lum-first') === -1)
					element.firstChild.className += ' lum-first';
				
				// add lum-last to last element
				element.lastChild.className += ' lum-last';
				
				// scroll to the bottom of the message box
				element.scrollTop = element.scrollHeight;
			}
		}
		
		var xmlDom = getLatestMessagesChatMessagesController.getXmlHttpObj().responseXML;
		var tempLastMessageDate = xmlDom.getElementsByTagName("lastMessageDate");
		if(tempLastMessageDate.length > 0)
		{
			lastMessageDate = tempLastMessageDate.item(0).firstChild.data;
		}
		
		updateUsers(xmlDom);
		
		return true;
	}
	
	function xmlDecode(text)
	{
		text = text.replace(/\&amp;/gi, "&") ;
		text = text.replace(/\&quot;/gi, "\"") ;
		text = text.replace(/\&lt;/gi, "<") ;
		text = text.replace(/\&gt;/gi, ">") ;
	
		return text ;
	}
	
	//-------------------------------------------------------------------

	function rejectMessage(messageId)
	{
		var messageDiv = document.getElementById("message_"+messageId);
		var strMethod = "<method name=\"rejectMessage\">";
		strMethod += "<conversationId>"+conversationId+"</conversationId>";
		strMethod += "<chatUserId>"+chatUserId+"</chatUserId>";
		strMethod += "<messageId>"+messageId+"</messageId>";
		strMethod += "</method>";
		
		rejectMessageChatMessagesController.makeHttpRequest(g_LumisRootPath + "lumis/collaboration/chat/controller/xml/ChatControllerXml.jsp", strMethod, null, true);
		try
		{
			LumisPortalUtil.validateResponse(rejectMessageChatMessagesController.getXmlHttpObj().responseXML);
		}
		catch(e)
		{
			alert(e.description);
			return false;
		}
		
		messageDiv.parentNode.removeChild(messageDiv);
	}

	//-------------------------------------------------------------------

	function approveMessage(messageId)
	{
		var messageDiv = document.getElementById("message_"+messageId);
		var strMethod = "<method name=\"approveMessage\">";
		strMethod += "<conversationId>"+conversationId+"</conversationId>";
		strMethod += "<chatUserId>"+chatUserId+"</chatUserId>";
		strMethod += "<messageId>"+messageId+"</messageId>";
		strMethod += "</method>";
		
		approveMessageChatMessagesController.makeHttpRequest(g_LumisRootPath + "lumis/collaboration/chat/controller/xml/ChatControllerXml.jsp", strMethod, null, true);
		
		try
		{
			LumisPortalUtil.validateResponse(approveMessageChatMessagesController.getXmlHttpObj().responseXML);
		}
		catch(e)
		{
			alert(e.description);
			return false;
		}
		
		messageDiv.parentNode.removeChild(messageDiv);

		if(LumisChatMessage_chatMessageList)
			LumisChatMessage_chatMessageList.getLatestMessages();
	}
}

//===========================================================================

function LumisChatSendMessage(messageTextElement, usersListElement, privateMessageElement, conversationId, chatUserId, automaticApprovalId)
{
	this.sendMessage = sendMessage;
	this.userLeftConversation = userLeftConversation;
	this.automaticApprovalId=automaticApprovalId; 
	
	//-------------------------------------------------------------------
	//-------------------- message controllers --------------------------
	//-------------------------------------------------------------------
	
	var sendMessageChatMessagesController = new LumisChatMessagesController("sendMessage", true);
	var userLeftConversationChatMessagesController = new LumisChatMessagesController("userLeftConversation", true);
	
	//-------------------------------------------------------------------
		
	function sendMessage()
	{
		if(conversationId == null || conversationId.length == 0)
			return;
			
		var message = messageTextElement.value;
		if(message!=null && message.length > 0)
		{
			var toUserValue = null;
			if(usersListElement)
				toUserValue = usersListElement.options[usersListElement.selectedIndex].value;
			
			var isPrivateMessage = false;
			if(privateMessageElement)
				isPrivateMessage = privateMessageElement.checked;

			var strMethod = "<method name=\"addMessage\">";
			strMethod += "<conversationId>"+conversationId+"</conversationId>";
			strMethod += "<chatUserId>"+chatUserId+"</chatUserId>";
			strMethod += "<message>"+xmlEncode(message)+"</message>";
			if(automaticApprovalId)
			{
				strMethod += "<autoApprove>"+(automaticApprovalId.checked ? "true" : "false")+"</autoApprove>";
			}
			
			//if the target user is "everyone", toUserValue == null, private conversation is not avaible.
			if(toUserValue && toUserValue.length > 0)
			{
				strMethod += "<toUserId>"+xmlEncode(toUserValue)+"</toUserId>";
				if(isPrivateMessage)
					strMethod += "<isPrivate>true</isPrivate>";
			}

			strMethod += "</method>";
			
			sendMessageChatMessagesController.makeHttpRequest(g_LumisRootPath + "lumis/collaboration/chat/controller/xml/ChatControllerXml.jsp", strMethod, null, true);
			try
			{
				LumisPortalUtil.validateResponse(sendMessageChatMessagesController.getXmlHttpObj().responseXML);
			}
			catch(e)
			{
				alert(e.description);
				return;
			}
			
			messageTextElement.value = "";
			
			if(LumisChatMessage_chatMessageList)
				LumisChatMessage_chatMessageList.getLatestMessages();
			
			if(document.getElementById("chatModeratorMessageList_Messages"))
				LumisChatMessage_chatModeratorMessageList.getLatestMessages();
		}
	}
	
	function userLeftConversation()
	{
		if(conversationId == null || conversationId.length == 0)
			return;
			
		var strMethod = "<method name=\"userLeftConversation\">";
		strMethod += "<conversationId>"+conversationId+"</conversationId>";
		strMethod += "<chatUserId>"+chatUserId+"</chatUserId>";
		strMethod += "</method>";

		userLeftConversationChatMessagesController.makeHttpRequest(g_LumisRootPath + "lumis/collaboration/chat/controller/xml/ChatControllerXml.jsp", strMethod, null, true);
		try
		{
			LumisPortalUtil.validateResponse(userLeftConversationChatMessagesController.getXmlHttpObj().responseXML);
		}
		catch(e)
		{
			alert(e.description);
		}
		
		return;
	}
	
	function xmlEncode(text)
	{
		text = text.replace(/&/g, "&amp;") ;
		text = text.replace(/"/g, "&quot;") ;
		text = text.replace(/</g, "&lt;") ;
		text = text.replace(/>/g, "&gt;") ;
	
		return text ;
	}
}
