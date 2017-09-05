
// create the command $Revision: 16298 $ $Date: 2014-06-26 16:31:29 -0300 (Thu, 26 Jun 2014) $
var LumisDocumentCommand=function(){};
LumisDocumentCommand.prototype.Execute=function(){};
LumisDocumentCommand.GetState=function() { return FCKCommands.LoadedCommands['Cut'].GetState(); };
LumisDocumentCommand.Execute=function() 
{
	//open a popup window when the button is clicked
	FCK.Focus();
	setTimeout("window.open('../../plugins/lumisDocument/selectDocument.jsp?lumPageId=' + window.parent.g_LumisPageId + '&lumChannelId=' + window.parent.g_LumisChannelId + '&callbackFunction=LumisPortal.opener.LumisDocumentCommand.callbackFunction&serviceInstanceId=' + window.parent.oFCKeditor_" + FCK.Name + ".serviceInstanceId, '_blank', 'width=595,height=540,top=20,scrollbars=yes,scrolling=no,location=no,toolbar=no')", 0);
}
LumisDocumentCommand.callbackFunction=function(id, title, filename, url) 
{
	FCK.Focus();
    FCK.CreateLink(url);
}

// register the command.
FCKCommands.RegisterCommand('LumisDocument', LumisDocumentCommand);

// create the toolbar buttons.
var oLumisDocumentItem = new FCKToolbarButton( 'LumisDocument', FCKLang.LumisDocumentBtn, null, null, false, true ) ;
oLumisDocumentItem.IconPath = FCKPlugins.Items['lumisDocument'].Path + 'image.gif' ;
FCKToolbarItems.RegisterItem( 'LumisDocument', oLumisDocumentItem ) ;