
// create the command
var LumisContentLinkCommand=function(){};
LumisContentLinkCommand.prototype.Execute=function(){};
LumisContentLinkCommand.GetState=function() { return FCK_TRISTATE_OFF; };
LumisContentLinkCommand.Execute=function() 
{
	//open a popup window when the button is clicked
	FCK.Focus();
	setTimeout("window.open('../../plugins/lumisContentLink/selectContent.jsp?lumPageId=' + window.parent.g_LumisPageId + '&lumChannelId=' + window.parent.g_LumisChannelId + '&callbackFunction=opener.LumisContentLinkCommand.callbackFunction&serviceInstanceId=' + window.parent.oFCKeditor_" + FCK.Name + ".serviceInstanceId, '_blank', 'width=600,height=315,top=20,scrollbars=no,scrolling=no,location=no,toolbar=no')", 0);
}
LumisContentLinkCommand.callbackFunction=function(title, url) 
{
	FCK.Focus();
    FCK.InsertHtml('<a href="' + url + '">' + title + '</a>');
}

// register the command.
FCKCommands.RegisterCommand('LumisContentLink', LumisContentLinkCommand);

// create the toolbar buttons.
var oLumisContentLinkItem = new FCKToolbarButton( 'LumisContentLink', FCKLang.LumisContentLinkBtn ) ;
oLumisContentLinkItem.IconPath = FCKPlugins.Items['lumisContentLink'].Path + 'image.gif' ;
FCKToolbarItems.RegisterItem( 'LumisContentLink', oLumisContentLinkItem ) ;