// $Revision: 11835 $ $Date: 2010-08-05 16:29:01 -0300 (Thu, 05 Aug 2010) $
// create the command
var LumisHtmlSnippetCommand=function(){};
LumisHtmlSnippetCommand.prototype.Execute=function(){};
LumisHtmlSnippetCommand.GetState=function() { return FCK_TRISTATE_OFF; };
LumisHtmlSnippetCommand.Execute=function() 
{
	//open a popup window when the button is clicked
	FCK.Focus();
	setTimeout("window.open(\"../../../../../main.jsp?lumPageId=LumisBlankPage&lumChannelId=\" + window.parent.g_LumisChannelId + \"&lumRTI=lumis.service.doui.htmlsnippet.addHtmlSnippet\", \"_blank\", \"width=500,height=500,top=20,resizable=no,scrolling=no,location=no,toolbar=no\")", 0);
}
LumisHtmlSnippetCommand.callbackFunction=function(html) 
{
	FCK.Focus();
	FCK.InsertHtml(html);
}

// register the command.
FCKCommands.RegisterCommand('LumisHtmlSnippet', LumisHtmlSnippetCommand);

// create the toolbar buttons.
var oLumisHtmlSnippetItem = new FCKToolbarButton( 'LumisHtmlSnippet', FCKLang.LumisHtmlSnippetBtn ) ;
oLumisHtmlSnippetItem.IconPath = FCKPlugins.Items['lumisHtmlSnippet'].Path + 'htmlSnippet.gif' ;
FCKToolbarItems.RegisterItem( 'LumisHtmlSnippet', oLumisHtmlSnippetItem ) ;


