// $Revision: 14015 $ $Date: 2012-02-08 11:15:15 -0200 (Wed, 08 Feb 2012) $
// Change the default plugin path.
FCKConfig.SkinPath = FCKConfig.BasePath + '../../skins/lumis/' ;
//FCKConfig.PluginsPath = FCKConfig.BasePath + 'plugins/' ;
FCKConfig.PluginsPath = FCKConfig.BasePath.substr(0, FCKConfig.BasePath.length - 17) + 'plugins/';

// Add the plugins
FCKConfig.Plugins.Add( 'lumisContentLink', 'en,pt-br' ) ;
FCKConfig.Plugins.Add( 'lumisLocalImage', 'en,pt-br' ) ;
FCKConfig.Plugins.Add( 'lumisPage', 'en,pt-br' ) ;
FCKConfig.Plugins.Add( 'lumisChannel', 'en,pt-br' ) ;
FCKConfig.Plugins.Add( 'lumisHtmlEditor', 'en,pt-br' ) ;

FCKConfig.ToolbarSets["Lumis"] = [
	['Cut','Copy','Paste','PasteText'],	
	['Bold','Italic','Underline','StrikeThrough'],
	['Undo','Redo','-','Find','Replace','-','RemoveFormat'],	
	'/',
	['OrderedList','UnorderedList','-','Outdent','Indent'],
	['JustifyLeft','JustifyCenter','JustifyRight','JustifyFull'],
	['LumisLocalImage'],
	['Table'],	
	'/',
	['FontFormat','FontName','FontSize'],
	['TextColor']
	
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
