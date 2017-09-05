// $Revision: 17548 $ $Date: 2015-07-09 19:47:45 -0300 (Thu, 09 Jul 2015) $
(function($)
{
	window.LumisTopBar = new function()
	{
		this.changeMode = changeMode;
		this.setLocale = setLocale;
		
		function changeMode(e, newModeId)
		{
			var xmlHttp = LumisPortal.getXmlHttpObject();
			var responseText = null;
			var modeUrlServer = g_LumisRootPath+"lumis/api/rest/lum-internal/admin/mode/getmodeurl?destModeId="+newModeId+"&lumCurrentDisplayModeId="+g_LumisDisplayMode+"&lumReferer="+LumisPortal.lumisEncodeURIComponent(document.location.href)+"&lumPageId="+g_LumisPageId+"&lumChannelId="+g_LumisChannelId;
			xmlHttp.open("POST", modeUrlServer, true);
			xmlHttp.onreadystatechange = function()
			{
				if (xmlHttp.readyState==4 && xmlHttp.status==200)
				{
					var json = eval("(" + xmlHttp.responseText + ")");
					if(json && json.modeUrl)
					{
						var originalTarget = document.forms["LumisPortalForm"].target;
						document.forms["LumisPortalForm"].action = json.modeUrl;
						document.forms["LumisPortalForm"].elements["lumToggleModeOriginUrl"].value = window.location.href;
						
						if(e.ctrlKey || e.which === 2)
						{
							document.forms["LumisPortalForm"].target = "_blank";
							$('.lum-mode-menu').slideUp(200);
						}
						
						document.forms["LumisPortalForm"].submit();
						this.isSubmitting = true;
						document.forms["LumisPortalForm"].target = originalTarget;
					}
				}
			};
			xmlHttp.send();
		}
		
		function setLocale(localeId)
		{
			$.get(g_LumisRootPath+"lumis/portal/controller/html/SetLocale.jsp?lumUserLocale="+localeId, function(data)
			{
				LumisPortal.onRefresh();
			});
		}
	}();
	
	$(document).ready(function()
	{
		$('.lum-mode-select').click(function(e) 
		{
			if($('.lum-mode-menu').is(':visible'))
			{
				$('.lum-mode-select').removeClass('lum-admin-bar-selected');
			}
			else
			{
				$('.lum-mode-select').addClass('lum-admin-bar-selected');
			}
			$('.lum-mode-menu').slideToggle(200);e.stopPropagation();
			$('.lum-admin-bar-settings-menu').slideUp(200);
			$('.lum-admin-bar-settings-menu-language').slideUp(200);
			$('.lum-admin-bar-user').removeClass('lum-admin-bar-selected');
			$('.lum-admin-page-view-menu').slideUp(200);
			$('.lum-admin-switch-page-view').removeClass('lum-admin-selected');
			$('.lum-admin-channel-admin-menu').slideUp(200);
			$('.lum-admin-switch-channel-admin').removeClass('lum-admin-selected');
		});
		$('.lum-admin-bar-user').click(function(e) 
		{
			if($('.lum-admin-bar-settings-menu').is(':visible'))
			{
				$('.lum-admin-bar-user').removeClass('lum-admin-bar-selected');
			}
			else
			{
				$('.lum-admin-bar-user').addClass('lum-admin-bar-selected');
			}
			$('.lum-admin-bar-settings-menu').slideToggle(200);e.stopPropagation();
			$('.lum-admin-bar-settings-menu-language').slideUp(200);
			$('.lum-mode-menu').slideUp(200);
			$('.lum-mode-select').removeClass('lum-admin-bar-selected');
			$('.lum-admin-page-view-menu').slideUp(200);
			$('.lum-admin-switch-page-view').removeClass('lum-admin-selected');
			$('.lum-admin-channel-admin-menu').slideUp(200);
			$('.lum-admin-switch-channel-admin').removeClass('lum-admin-selected');
		});
		$('.lum-admin-bar-language').click(function(e) 
		{
			if($('.lum-admin-bar-settings-menu-language').is(':visible'))
			{
				$('.lum-admin-bar-language').removeClass('lum-admin-bar-selected');
			}
			else
			{
				$('.lum-admin-bar-language').addClass('lum-admin-bar-selected');
			}
			$('.lum-admin-bar-settings-menu-language').slideToggle(200);e.stopPropagation();
			$('.lum-admin-bar-settings-menu').slideUp(200);
			$('.lum-mode-menu').slideUp(200);
			$('.lum-mode-select').removeClass('lum-admin-bar-selected');
			$('.lum-admin-page-view-menu').slideUp(200);
			$('.lum-admin-switch-page-view').removeClass('lum-admin-selected');
			$('.lum-admin-channel-admin-menu').slideUp(200);
			$('.lum-admin-switch-channel-admin').removeClass('lum-admin-selected');
		});
		$('html').click(function() 
		{
			$('.lum-mode-select').removeClass('lum-admin-bar-selected');
			$('.lum-admin-bar-user').removeClass('lum-admin-bar-selected');
			$('.lum-mode-menu').slideUp(200);
			$('.lum-admin-bar-settings-menu').slideUp(200);
			$('.lum-admin-bar-settings-menu-language').slideUp(200);
			$('.lum-admin-page-view-menu').slideUp(200);
			$('.lum-admin-switch-page-view').removeClass('lum-admin-selected');
			$('.lum-admin-channel-admin-menu').slideUp(200);
			$('.lum-admin-switch-channel-admin').removeClass('lum-admin-selected');
		});
	});
})(jQuery)