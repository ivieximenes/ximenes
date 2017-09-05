// $Revision: 9865 $ $Date: 2008-10-29 17:00:03 -0200 (Wed, 29 Oct 2008) $
/* Lumis Wiki Link Article FCKEditor Configuration */

// change the default skin path.
FCKConfig.SkinPath = FCKConfig.BasePath + '../../skins/lumis/' ;

// sets path of default plugins
FCKConfig.PluginsPath = FCKConfig.BasePath.substr(0, FCKConfig.BasePath.length - 17) + 'plugins/';
	/*FCKConfig.PluginsPath = FCKConfig.BasePath + 'plugins/' ;*/

//add custom lumisWikiLinkArticle plug-in
FCKConfig.Plugins.Add( 'lumisWikiLinkArticle', 'en,pt-br' ) ;

//add the default version plugins
FCKConfig.Plugins.Add( 'lumisContentLink', 'en,pt-br' ) ;
FCKConfig.Plugins.Add( 'lumisImage', 'en,pt-br' ) ;
FCKConfig.Plugins.Add( 'lumisDocument', 'en,pt-br' ) ;
FCKConfig.Plugins.Add( 'lumisPage', 'en,pt-br' ) ;
FCKConfig.Plugins.Add( 'lumisChannel', 'en,pt-br' ) ;
FCKConfig.Plugins.Add( 'lumisHtmlEditor', 'en,pt-br' ) ;

FCKConfig.ToolbarSets["Wiki"] = [
	['Source'],
	['Cut','Copy','Paste','PasteText','PasteWord'],	
	['Bold','Italic','Underline','StrikeThrough','-','Subscript','Superscript'],
	['Undo','Redo','-','Find','Replace','-','RemoveFormat'],	
	['OrderedList','UnorderedList','-','Outdent','Indent'],
	['JustifyLeft','JustifyCenter','JustifyRight','JustifyFull'],
	['LumisImage','LumisPage','LumisDocument','LumisContentLink','LumisWikiLinkArticle','Link'],
	['Image','Table','Rule','Smiley','SpecialChar'],	
	['FontFormat','FontName','FontSize'],
	['TextColor','BGColor']
];

FCKConfig.LinkDlgHideAdvanced	= true;
FCKConfig.ImageDlgHideAdvanced	= true;
FCKConfig.FlashDlgHideAdvanced	= true;

FCKConfig.LinkBrowser = false;
FCKConfig.ImageBrowser = false;
FCKConfig.FlashBrowser = false;
FCKConfig.LinkUpload = false;
FCKConfig.ImageUpload = false;
FCKConfig.FlashUpload = false;