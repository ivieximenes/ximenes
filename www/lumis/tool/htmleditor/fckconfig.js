// $Revision: 12743 $ $Date: 2011-03-30 14:18:58 -0300 (Wed, 30 Mar 2011) $
// Change the default plugin path.
FCKConfig.SkinPath = FCKConfig.BasePath + '../../skins/lumis/' ;
//FCKConfig.PluginsPath = FCKConfig.BasePath + 'plugins/' ;
FCKConfig.PluginsPath = FCKConfig.BasePath.substr(0, FCKConfig.BasePath.length - 17) + 'plugins/';

// Add the plugins
FCKConfig.Plugins.Add( 'lumisContentLink', 'en,pt-br' ) ;
FCKConfig.Plugins.Add( 'lumisImage', 'en,pt-br' ) ;
FCKConfig.Plugins.Add( 'lumisDocument', 'en,pt-br' ) ;
FCKConfig.Plugins.Add( 'lumisPage', 'en,pt-br' ) ;
FCKConfig.Plugins.Add( 'lumisChannel', 'en,pt-br' ) ;
FCKConfig.Plugins.Add( 'lumisHtmlEditor', 'en,pt-br' ) ;
FCKConfig.Plugins.Add( 'lumisHtmlSnippet', 'en,pt-br' ) ;
FCKConfig.Plugins.Add( 'lumisURLAccessibilityEvaluation', 'en,pt-br' ) ;

FCKConfig.ToolbarSets["Lumis"] = [
	['Source','-',
	 'Cut','Copy','Paste','PasteText','PasteWord','-',
	 'Bold','Italic','Underline','-',
	 'RemoveFormat',
	 'LumisImage','LumisPage','LumisDocument','LumisContentLink','Link','LumisHtmlEditor','LumisURLAccessibilityEvaluation']
] ;

FCKConfig.ToolbarSets["LumisPopup"] = [
	['Source'],
	['Cut','Copy','Paste','PasteText','PasteWord'],	
	['Bold','Italic','Underline','StrikeThrough','-','Subscript','Superscript'],
	['Undo','Redo','-','Find','Replace','-','RemoveFormat'],	
	'/',
	['OrderedList','UnorderedList','-','Outdent','Indent'],
	['JustifyLeft','JustifyCenter','JustifyRight','JustifyFull'],
	['LumisHtmlSnippet','LumisImage','LumisPage','LumisDocument','LumisContentLink','Link'],
	['Image','Table','Rule','Smiley','SpecialChar'],	
	'/',
	['FontFormat','FontName','FontSize'],
	['TextColor','BGColor']
	
] ;
FCKConfig.LinkDlgHideAdvanced	= true;
FCKConfig.ImageDlgHideAdvanced	= true;
FCKConfig.FlashDlgHideAdvanced	= true;

FCKConfig.LinkBrowser = false;
FCKConfig.ImageBrowser = false;
FCKConfig.FlashBrowser = false;
FCKConfig.LinkUpload = false;
FCKConfig.ImageUpload = false;
FCKConfig.FlashUpload = false;
