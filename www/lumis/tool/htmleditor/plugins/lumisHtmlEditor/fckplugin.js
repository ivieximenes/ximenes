// $Revision: 11835 $ $Date: 2010-08-05 16:29:01 -0300 (Thu, 05 Aug 2010) $
// create the command
var LumisHtmlEditorCommand=function(){};
LumisHtmlEditorCommand.prototype.Execute=function(){};
LumisHtmlEditorCommand.GetState=function() { return FCK_TRISTATE_OFF };
LumisHtmlEditorCommand.Execute=function() 
{
	//open a popup window when the button is clicked
	FCK.Focus();
	setTimeout("window.open(\"../../../../../main.jsp?lumPageId=LumisBlankPage&lumChannelId=\" + window.parent.g_LumisChannelId + \"&lumRTI=lumis.service.doui.htmleditor.editHtml&serviceInstanceId=\" + window.parent.oFCKeditor_" + FCK.Name + ".serviceInstanceId + \"&callbackFunction=" + encodeURIComponent("window.opener.LumisHtmlEditorCommand.SetHTML") + "\", \"_blank\", \"width=800,height=600,top=20,resizable=yes,scrolling=yes,location=no,toolbar=no\")", 0);
}
LumisHtmlEditorCommand.SetHTML=function(html) 
{
	FCK.doTheSwitch = true;
	FCK.OnAfterSetHTML = function() { if (this.doTheSwitch) {this.SwitchEditMode(); this.SwitchEditMode(); this.doTheSwitch=false;}}
	FCK.Focus();
	FCK.SetHTML(html);
}

LumisHtmlEditorCommand.GetHTML=function() 
{
	return FCK.GetXHTML();
}

// register the command.
FCKCommands.RegisterCommand('LumisHtmlEditor', LumisHtmlEditorCommand);

// create the toolbar buttons.
var oLumisHtmlEditorItem = new FCKToolbarButton( 'LumisHtmlEditor', FCKLang.LumisHtmlEditorBtn ) ;
oLumisHtmlEditorItem.IconPath = FCKPlugins.Items['lumisHtmlEditor'].Path + 'image.gif' ;
FCKToolbarItems.RegisterItem( 'LumisHtmlEditor', oLumisHtmlEditorItem ) ;
