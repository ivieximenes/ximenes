// $Revision: 16298 $ $Date: 2014-06-26 16:31:29 -0300 (Thu, 26 Jun 2014) $
// create the command
var LumisMediaCommand=function(){};
LumisMediaCommand.prototype.Execute=function(){};
LumisMediaCommand.GetState=function() { return FCK_TRISTATE_OFF; };
LumisMediaCommand.Execute=function() 
{
	//open a popup window when the button is clicked
	FCK.Focus();
	setTimeout("window.open('../../plugins/lumisImage/selectImage.jsp?lumPageId=' + window.parent.g_LumisPageId + '&lumChannelId=' + window.parent.g_LumisChannelId + '&callbackFunction=LumisPortal.opener.LumisMediaCommand.callbackFunction&serviceInstanceId=' + window.parent.oFCKeditor_" + FCK.Name + ".serviceInstanceId, '_blank', 'width=900,height=635,top=20,scrollbars=yes,scrolling=no,location=no,toolbar=no')", 0);
}
LumisMediaCommand.callbackFunction=function(id, title, filename, url, inlineUrl, legend) 
{
	FCK.Focus();
	var prefix = "";
	if (url.indexOf('://') == -1)
	{
		prefix = eval('window.parent.oFCKeditor_' + FCK.Name + '.LumImgPrefix');
		if(prefix == undefined || prefix == "")
			prefix = "../../../../../";
	}

	FCK.InsertHtml('<img src="' + prefix + url + '" alt="'+legend+'" />');
}

// register the command.
FCKCommands.RegisterCommand('LumisImage', LumisMediaCommand);

// create the toolbar buttons.
var oLumisImageItem = new FCKToolbarButton( 'LumisImage', FCKLang.LumisImageBtn ) ;
oLumisImageItem.IconPath = FCKPlugins.Items['lumisImage'].Path + 'image.gif' ;
FCKToolbarItems.RegisterItem( 'LumisImage', oLumisImageItem ) ;


