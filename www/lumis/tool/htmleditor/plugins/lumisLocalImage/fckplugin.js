// $Revision: 14036 $ $Date: 2012-02-14 11:07:31 -0200 (Tue, 14 Feb 2012) $
// create the command
var LumisLocalImageCommand=function(){};
LumisLocalImageCommand.prototype.Execute=function(){};
LumisLocalImageCommand.GetState=function() { return FCK_TRISTATE_OFF; };
LumisLocalImageCommand.Execute=function() 
{
	//open a popup window when the button is clicked
	FCK.Focus();
	setTimeout("window.open('../../../../../main.jsp?lumPageId=' + window.parent.g_LumisPageId + '&lumRTI=lumis.service.doui.filelist.imageFilesAdministration'+ '&filesId='+ window.parent.document.getElementsByName('" + FCK.Name + "Images')[0].value + '&files.sourceId=' + window.parent.oFCKeditor_" + FCK.Name + ".sourceId + '&files.fieldId=" + FCK.Name+ "Images&files.serviceInstanceId=' + window.parent.oFCKeditor_" + FCK.Name + ".serviceInstanceId+'&selectImageCallbackFunction=window.opener.LumisLocalImageCommand.callbackFunction', '_blank', 'width=770,height=420,top=20,scrollbars=no,scrolling=no,location=no,toolbar=no')", 0);
}
LumisLocalImageCommand.callbackFunction=function(url, title) 
{
	FCK.Focus();
    FCK.InsertHtml('<img src="../../../../../' + xmlEncode(url) + '" alt="'+xmlEncode(title)+'" />');
}

function xmlEncode(string)
{
	string = string.replace(/\&/g,'&amp;');
	string = string.replace(/</g,'&lt;');
	string = string.replace(/>/g,'&gt;');
	string = string.replace(/\'/g,'&apos;');
	string = string.replace(/\"/g,'&quot;');
	
	return string;
}

// register the command.
FCKCommands.RegisterCommand('LumisLocalImage', LumisLocalImageCommand);

// create the toolbar buttons.
var oLumisLocalImageItem = new FCKToolbarButton( 'LumisLocalImage', FCKLang.LumisLocalImageBtn ) ;
oLumisLocalImageItem.IconPath = FCKPlugins.Items['lumisLocalImage'].Path + 'image.gif' ;
FCKToolbarItems.RegisterItem( 'LumisLocalImage', oLumisLocalImageItem ) ;


