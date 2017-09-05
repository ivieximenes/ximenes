/* $Revision: 16203 $ $Date: 2014-03-18 11:13:04 -0300 (Tue, 18 Mar 2014) $ */
function LumisServiceInterfaceListHeader(element)
{
	element.reloadData = reloadData;
	var pCurrentChannel = document.createElement("DIV");
	pCurrentChannel.className = "lum-admin-interface-header-current-channel";
	pCurrentChannel.innerHTML = "<div class=\"lum-admin-label\">"+LumisPortalAdmin.localize("STR_SERVICES_IN")+":</div>"+"<div class=\"lum-admin-channel-name-and-path\"><span id=\"lum-admin-channel-name\" class=\"lum-admin-channel-name\"></span><span id=\"lum-admin-channel-path\" class=\"lum-admin-channel-path\"></span></div>";
	element.appendChild(pCurrentChannel);
	
	var pChangeChannel = document.createElement("DIV");
	pChangeChannel.noWrap = true;
	pChangeChannel.title = LumisPortalAdmin.localize("STR_CHANGE_CHANNEL");
	pChangeChannel.className = "lum-admin-interface-header-text lum-admin-interface-header-change-channel";
	pChangeChannel.innerHTML = "<a onclick=\"function f2(){var additionalParams;additionalParams='&scptCallbackFunction=window.parent.LumisPortalAdmin.onChangeChannel';LumisLightBox.open(LumisPortal.mainName+'?"+LumisPortal.pageParameterPageIdName+"=LumisBlankPage&'+LumisPortal.pageParameterChannelIdName+'="+g_LumisChannelId+"&lumRTI=lumis.service.portalmanagement.channel.selectChannelOrChannelTemplate&scptChannelId="+g_LumisChannelId+"'+additionalParams,{'width':900,showCloseButton:false,hideOnOverlayClick:false,padding:0});}f2();\">"+LumisPortalAdmin.localize("STR_CHANGE_CHANNEL")+"</a>";

	element.appendChild(pChangeChannel);

	var pAddServiceDiv = document.createElement("DIV");
	pAddServiceDiv.noWrap = true;
	pAddServiceDiv.title = LumisPortalAdmin.localize("STR_ADD_SERVICE_INSTANCE");
	pAddServiceDiv.className = "lum-admin-interface-header-text lum-admin-interface-header-add-service";
	pAddServiceDiv.innerHTML = "<a onclick=\"function f1(){LumisLightBox.open(LumisPortal.mainName+'?"+LumisPortal.pageParameterPageIdName+"=LumisBlankPage&'+LumisPortal.pageParameterChannelIdName+'="+g_LumisChannelId+"&lumRTI=lumis.service.portalmanagement.serviceinstance.add&fromNavigationPane=1',{'width':900,showCloseButton:false,hideOnOverlayClick:false,padding:0});}f1();\">"+LumisPortalAdmin.localize("STR_ADD_SERVICE_INSTANCE")+"</a>";
	
	element.appendChild(pAddServiceDiv);

	//-------------------------------------------------------------------

	function reloadData(strChannelId)
	{
		pChangeChannel.innerHTML = "<a onclick=\"function f2(){var additionalParams;additionalParams='&scptCallbackFunction=window.parent.LumisPortalAdmin.onChangeChannel';LumisLightBox.open(LumisPortal.mainName+'?"+LumisPortal.pageParameterPageIdName+"=LumisBlankPage&'+LumisPortal.pageParameterChannelIdName+'="+strChannelId+"&lumRTI=lumis.service.portalmanagement.channel.selectChannelOrChannelTemplate'+additionalParams,{'width':900,showCloseButton:false,hideOnOverlayClick:false,padding:0});}f2();\">"+LumisPortalAdmin.localize("STR_CHANGE_CHANNEL")+"</a>";
		pAddServiceDiv.innerHTML = "<a onclick=\"function f1(){LumisLightBox.open(LumisPortal.mainName+'?"+LumisPortal.pageParameterPageIdName+"=LumisBlankPage&'+LumisPortal.pageParameterChannelIdName+'="+strChannelId+"&lumRTI=lumis.service.portalmanagement.serviceinstance.add&fromNavigationPane=1',{'width':900,showCloseButton:false,hideOnOverlayClick:false,padding:0});}f1();\">"+LumisPortalAdmin.localize("STR_ADD_SERVICE_INSTANCE")+"</a>";
	}
}