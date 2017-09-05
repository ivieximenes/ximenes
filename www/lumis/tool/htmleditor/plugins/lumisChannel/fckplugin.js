// $Revision: 11835 $ $Date: 2010-08-05 16:29:01 -0300 (Thu, 05 Aug 2010) $
// create the command
var LumisChannelCommand=function(){};
LumisChannelCommand.prototype.Execute=function(){};
LumisChannelCommand.GetState=function() { return FCKCommands.LoadedCommands['Cut'].GetState(); };
LumisChannelCommand.Execute=function() 
{
	//open a popup window when the button is clicked
	FCK.Focus();
	setTimeout("window.open('../../../../../main.jsp?lumPageId=' + window.parent.g_LumisPageId + '&lumChannelId=' + window.parent.g_LumisChannelId + '&lumRTI=lumis.service.portalmanagement.channel.selectChannel&scptCallbackFunction=window.opener.LumisChannelCommand.callbackFunction', '_blank', 'width=600,height=330,scrollbars=no,scrolling=no,location=no,toolbar=no')", 0);
}
LumisChannelCommand.callbackFunction=function(channelId, channelPath, pageId) 
{
	FCK.Focus();
	var lp = window.parent.LumisPortal;
    FCK.CreateLink(lp.mainName + '?' + lp.pageParameterChannelIdName + '=' + channelId);
}

// register the command.
FCKCommands.RegisterCommand('LumisChannel', LumisChannelCommand);

// create the toolbar buttons.
var oLumisChannelItem = new FCKToolbarButton( 'LumisChannel', FCKLang.LumisChannelBtn, null, null, false, true ) ;
oLumisChannelItem.IconPath = FCKPlugins.Items['lumisChannel'].Path + 'image.gif' ;
FCKToolbarItems.RegisterItem( 'LumisChannel', oLumisChannelItem) ;


