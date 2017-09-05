// $Revision: 15972 $ $Date: 2013-11-05 14:53:10 -0200 (Tue, 05 Nov 2013) $﻿
// create the command
var LumisPageCommand=function(){};
LumisPageCommand.prototype.Execute=function(){};
LumisPageCommand.GetState=function() { return FCKCommands.LoadedCommands['Cut'].GetState(); };
LumisPageCommand.Execute=function() 
{
	//open a popup window when the button is clicked
	FCK.Focus();
	setTimeout("window.open('../../../../../main.jsp?lumPageId=LumisBlankPage&lumChannelId=' + window.parent.g_LumisChannelId + '&lumRTI=lumis.service.portalmanagement.page.selectPage&scptCallbackFunction=window.opener.LumisPageCommand.callbackFunction&pageId=' + window.parent.oFCKeditor_" + FCK.Name + ".pageId, '_blank', 'width=600,height=330,scrollbars=no,scrolling=no,location=no,toolbar=no')", 0);
}
LumisPageCommand.callbackFunction=function(channelId, channelPath, pageId) 
{
	FCK.Focus();
	var lp = window.parent.LumisPortal;
    FCK.CreateLink(lp.mainName + '?' + lp.pageParameterPageIdName + '=' + pageId);
}

// register the command.
FCKCommands.RegisterCommand('LumisPage', LumisPageCommand);

// create the toolbar buttons.
var oLumisPageItem = new FCKToolbarButton( 'LumisPage', FCKLang.LumisPageBtn, null, null, false, true ) ;
oLumisPageItem.IconPath = FCKPlugins.Items['lumisPage'].Path + 'image.gif' ;
FCKToolbarItems.RegisterItem( 'LumisPage', oLumisPageItem ) ;


