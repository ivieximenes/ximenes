// $Revision: 10268 $ $Date: 2009-03-27 17:14:43 -0300 (Fri, 27 Mar 2009) $
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

//FCKConfig.ToolbarSets["Lumis"] = [
//	['Source','-','Cut','Copy','Paste','PasteText','PasteWord','-','Bold','Italic','Underline','-','RemoveFormat','LumisLocalImage','LumisPage','LumisDocument','LumisContentLink','Link','LumisHtmlEditor']
//] ;

FCKConfig.ToolbarSets["Lumis"] = [
	['Cut','Copy','Paste','PasteText','PasteWord'],	
	['Bold','Italic','Underline','StrikeThrough','-','Subscript','Superscript'],
	['Undo','Redo','-','Find','Replace','-','RemoveFormat'],	
	'/',
	['OrderedList','UnorderedList','-','Outdent','Indent'],
	['JustifyLeft','JustifyCenter','JustifyRight','JustifyFull'],
	['LumisPage','LumisLocalImage','LumisContentLink','Link'],
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
