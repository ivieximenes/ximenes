// $Revision: 13269 $ $Date: 2011-07-27 19:29:14 -0300 (Wed, 27 Jul 2011) $
/* Lumis Wiki Link Article FCKEditor Plugin */

// create the command
var LumisWikiLinkArticleCommand = function() {};

LumisWikiLinkArticleCommand.prototype.Execute = function() {};

LumisWikiLinkArticleCommand.GetState = function() {	return FCK_TRISTATE_OFF };

LumisWikiLinkArticleCommand.callbackFunction = function(defaultTitle, url) 
{
	FCK.Focus();
	
	var selectedText = '';

	// get the selected text from FCKeditor
	if(FCK.EditorDocument.selection != null) {
		selectedText = FCK.EditorDocument.selection.createRange().text;
    } else {
    	selectedText = FCK.EditorWindow.getSelection().toString();
    }
	
	// if no text is selected, set the defaultTitle as link text
	if (selectedText == ''){selectedText = defaultTitle}

	// sets the link for an article
	FCK.InsertHtml('<a href=\"' + url + '\">' + selectedText + '</a>');
}

LumisWikiLinkArticleCommand.Execute = function()
{
	// open a popup window when the button is clicked
	FCK.Focus();

	// url for popup page request
	queryPage = '../../plugins/lumisWikiLinkArticle/selectArticle.jsp?';

	// HTML editor instance name
	editorName = 'oFCKeditor_content';

	// requesting parameters from parent page (who called this popup)
	requestParams = queryPage + 'lumPageId=' + window.parent.g_LumisPageId +
			'&serviceInstanceId=' + window.parent[editorName].serviceInstanceId + 
			'&lumRTI=' + 'lumis.service.wiki.linkArticle' +
			'&serviceInstanceId=' + 'lumis.service.wiki.linkArticle' +
			'&callbackFunction=' + 'LumisWikiLinkArticleCommand.callbackFunction';

	// function for popup parameters configuration
	function popUp(popH, popW, screenH, screenW, windowParameters)
	{
		this.height = popH;
		this.width = popW;
		this.posY = (screenH - popH - 50) / 2; // center vertically
		this.posX = (screenW - popW) / 2; // center horizontally
		this.windowParams = 'height='+this.height+',width='+this.width+',top='+this.posY+',left='+this.posX+','+windowParameters;
	}

	// a popup instance to be used below
	var wikiPop = new popUp(500, 600, screen.height, screen.width,
			'scrollbars=no,menubar=no,resizable=no,directories=no,location=no,status=no');

	// popup call
	window.open(requestParams, '_blank', wikiPop.windowParams);
}

// register the command.
FCKCommands.RegisterCommand('LumisWikiLinkArticle', LumisWikiLinkArticleCommand);

// create the toolbar buttons.
var oLumisWikiLinkArticleItem = new FCKToolbarButton('LumisWikiLinkArticle', FCKLang.WikiLinkArticleBtn);
oLumisWikiLinkArticleItem.IconPath = FCKPlugins.Items['lumisWikiLinkArticle'].Path + 'image.gif';
FCKToolbarItems.RegisterItem('LumisWikiLinkArticle', oLumisWikiLinkArticleItem);