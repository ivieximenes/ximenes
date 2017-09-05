/*
 * Copyright 2005 Lumis EIP Tecnologia da Informa��o
 */
package br.com.qualicorp.redenarede.service.banner;

import lumis.doui.control.DataBoundControl;
import lumis.doui.source.ISourceData;
import lumis.doui.source.TabularData;
import lumis.doui.source.TabularSource;
import lumis.portal.PortalContext;
import lumis.portal.PortalException;
import lumis.portal.UnexpectedException;
import lumis.portal.authentication.SessionConfig;
import lumis.portal.file.FileConfig;
import lumis.portal.file.FileDownloadControllerHtml;
import lumis.portal.manager.ManagerFactory;
import lumis.portal.monitor.IMonitor;
import lumis.portal.page.PageConfig;
import lumis.portal.presentation.mode.PortalModes;
import lumis.portal.servicecontainer.ServiceContainerHttpServletRequest;
import lumis.portal.servicecontainer.ServiceContainerRequest;
import lumis.portal.serviceinstance.ServiceInstanceConfig;
import lumis.portal.serviceinterface.IServiceInterfaceRequest;
import lumis.portal.serviceinterfaceinstance.IServiceInterfaceInstanceManager;
import lumis.service.media.field.MediaDataType;
import lumis.util.ITransaction;
import lumis.util.TextUtil;
import lumis.util.XmlUtil;
import lumis.util.log.ILogger;
import lumis.util.log.LoggerFactory;

import java.util.EnumSet;

/**
 * Banner control
 *
 * @version $Revision: 15382 $ $Date: 2013-05-23 19:04:46 -0300 (Thu, 23 May 2013) $
 * @since 4.0.0
 */
public class BannerControl extends DataBoundControl<TabularSource<?>>
{
	/**
	 * Logger.
	 */
	private static final ILogger logger = LoggerFactory.getLogger(BannerControl.class);
	
	/**
	 * Banner number control identifier (parameter name).
	 */
	static final String BANNER_NUMBER_PARAMETER_NAME = "bannerNumber";

	@Override
	public void buildSubControls() throws PortalException
	{
		super.buildSubControls();

		if (douiContext.getRequest().getMode() != PortalModes.MODE_NAVIGATION.getId())
			return;

		// checks whether this banner is dynamic
		IServiceInterfaceRequest request = douiContext.getRequest();
		if (isDynamicBanner(request.getSessionConfig(), request.getServiceInterfaceInstanceConfig().getId(), douiContext.getTransaction()))
		{
			// get the timeout
			Long timeout = getDynamicTimeout(request.getSessionConfig(), request.getServiceInterfaceInstanceConfig().getId(), douiContext.getTransaction());
			if (timeout == null)
			{
				logger.warn("Banner interface instance " + request.getServiceInterfaceInstanceConfig().getId() + " is dynamic but doesn't provide a timeout. Using default ("
						+ BannerPropertiesDataProvider.DEFAULT_TIMEOUT + ").");
				timeout = Long.valueOf(BannerPropertiesDataProvider.DEFAULT_TIMEOUT);
			}

			if (timeout.longValue() <= 0)
			{
				logger.warn("Banner interface instance " + request.getServiceInterfaceInstanceConfig().getId() + " is dynamic and provide an invalid timeout (" + timeout + "). Using default ("
						+ BannerPropertiesDataProvider.DEFAULT_TIMEOUT + ").");
				timeout = Long.valueOf(BannerPropertiesDataProvider.DEFAULT_TIMEOUT);
			}
			
			buildDynamicChangeScriptControl(timeout);
		}
	}

	/**
	 * Builds needed sub-controls for the dynamic banner.
	 * @param timeout the dynamic timeout.
	 * @since 6.2.0
	 */
	private void buildDynamicChangeScriptControl(long timeout) throws PortalException
	{
		String ii = douiContext.getRequest().getServiceInterfaceInstanceConfig().getId();
		String script =
				"var lumBannerChangeTimeout" + ii + " = " +
				"window.setTimeout('LumisPortal.onSubmitForm(\"" + controlContainer.getFormName() + "\", " +
				"\"" + ii + "\", \"lumII\", false, null, \"lum_banner" + ii + 
				"\"); window.clearTimeout(lumBannerChangeTimeout" + ii + ");', "
				+ (1000L * timeout) + ");"
			;
		
		String controlStr = 
			"<d>" +
				"<control type=\"lum_script\">" +
					"<script>" + script + "</script>" +
				"</control>" +
				"<control type=\"lum_inputHidden\" id=\"" + BANNER_NUMBER_PARAMETER_NAME + "\" sourceId=\"none\" />" +
				"<control type=\"lum_inputHidden\" id=\"bannerMethod\" value=\"getBanner\" sourceId=\"none\" />" +
			"</d>";
		appendSubControls(controlStr);
	}
	
	/**
	 * Returns whether the banner is dynamic or not.
	 * @param sessionConfig the user's session.
	 * @param serviceInterfaceInstanceId the banner service interface instance identifier.
	 * @param transaction the transaction.
	 * @return whether the banner is dynamic or not.
	 * @since 6.2.0
	 */
	private boolean isDynamicBanner(SessionConfig sessionConfig, String serviceInterfaceInstanceId, ITransaction transaction) throws PortalException
	{
		String dynamic = ManagerFactory.getServiceInterfaceInstanceManager().getCustomProperty(sessionConfig, serviceInterfaceInstanceId, BannerPropertiesDataProvider.PARAM_DYNAMIC, transaction);
		return BannerPropertiesDataProvider.PARAM_DYNAMIC_TRUE_VALUE.equals(dynamic);
	}


	/**
	 * Returns the dynamic timeout for the given banner.
	 * @param sessionConfig the user's session.
	 * @param serviceInterfaceInstanceId the banner service interface instance identifier.
	 * @param transaction the transaction.
	 * @return the dynamic timeout for the given banner.
	 * @since 6.2.0
	 */
	private Long getDynamicTimeout(SessionConfig sessionConfig, String serviceInterfaceInstanceId, ITransaction transaction) throws PortalException
	{
		String timeout = ManagerFactory.getServiceInterfaceInstanceManager().getCustomProperty(sessionConfig, serviceInterfaceInstanceId, BannerPropertiesDataProvider.PARAM_TIMEOUT, transaction);
		return timeout != null ? Long.parseLong(timeout) : null;
	}

	public void setRenderData() throws PortalException
	{
		super.setRenderData();
		try
		{
			if(getSource().getLoad() == true)
				return;
			
			boolean logViews = douiContext.getRequest().getMode() == PortalContext.MODE_USER;
			if (logViews)
			{
				// check interface custom property if the banner view should be logged
				String serviceInterfaceInstanceId = douiContext.getRequest().getServiceInterfaceInstanceConfig().getId();
				IServiceInterfaceInstanceManager interfaceInstanceManager = ManagerFactory.getServiceInterfaceInstanceManager();
				String paramLogViews = interfaceInstanceManager.getCustomProperty(douiContext.getRenderRequest().getSessionConfig(), serviceInterfaceInstanceId, BannerPropertiesDataProvider.PARAM_LOG_VIEWS,  douiContext.getTransaction());
				if(paramLogViews == null)
					paramLogViews = "1";
				logViews = paramLogViews.equals("1");
			}
			
			StringBuilder serializedBanners = new StringBuilder();
			serializedBanners.append("<banners>");
			serializedBanners.append("	<bannerControllerHtmlUrl>" + XmlUtil.encodeXml(douiContext.getResponse().encodeURL(douiContext.getRenderRequest().getContextPath() + "/" + BannerController.getBannerControllerUrl())) + "</bannerControllerHtmlUrl>");
			serializedBanners.append("	<userSessionId>" + douiContext.getRequest().getSessionConfig().getUserSessionId() + "</userSessionId>");
			serializedBanners.append("	<interfaceInstanceId>" + douiContext.getRequest().getServiceInterfaceInstanceId() + "</interfaceInstanceId>");
			
			IServiceInterfaceRequest request = douiContext.getRequest();
			String pageId = douiContext.getRequest().getServiceInterfaceInstanceConfig().getPageId();
			PageConfig pageConfig = ManagerFactory.getPageManager().get(request.getSessionConfig(), pageId, douiContext.getTransaction());
			
			BannerLogger logger = BannerController.getLoggerViews();
			TabularData tabularData = getSource().getData();
			for (ISourceData row : tabularData.getRows())
			{
				serializedBanners.append(serializeBanner(row));
				if(logViews)
				{
					String bannerName = row.get("name", String.class);
					String categoryId = row.get("categoryId", String.class);
					IMonitor monitor = BannerMonitorUtil.getBannerViewMonitor(
							douiContext.getRequest().getServiceInstanceConfig(),
							bannerName, categoryId, pageConfig, douiContext.getTransaction());
					monitor.setTransaction(douiContext.getTransaction(), 
							EnumSet.of(IMonitor.Setting.COLLECT_TO_INSTANT_BOUND_EVENT_DATA));
					
					ServiceContainerHttpServletRequest httpServletRequest = ((ServiceContainerRequest)request).getServiceContainerHttpServletRequest();
					httpServletRequest.setAttribute(BannerLogger.BANNER_ID_ATTRIBUTE_NAME, row.get("bannerId"));
					logger.logAccess(httpServletRequest, request.getSessionConfig(), pageConfig, douiContext.getTransaction());
					httpServletRequest.removeAttribute(BannerLogger.BANNER_ID_ATTRIBUTE_NAME);
				}
			}
			
			serializedBanners.append("</banners>");
			
			XmlUtil.addNodeFromXmlString(controlDefinitionNode, serializedBanners.toString());
		}
		catch (Exception e)
		{
			throw new UnexpectedException(e);
		}
	}
	
	protected String serializeBanner(ISourceData row) throws PortalException
	{
		StringBuilder serializedBanner = new StringBuilder(500);
		String description = row.get("description") == null ? "" : row.get("description", String.class);
		String categoryId = row.get("categoryId") == null ? "" : row.get("categoryId", String.class);
		
		serializedBanner.append("	<banner>");
		serializedBanner.append("		<id>"+row.get("bannerId")+"</id>");
		serializedBanner.append("		<name>"+XmlUtil.encodeXml(row.get("name", String.class))+"</name>");
		serializedBanner.append("		<btncontent>"+XmlUtil.encodeXml(row.get("btncontent", String.class))+"</btncontent>");
		serializedBanner.append("		<description>"+XmlUtil.encodeXml(description)+"</description>");
		serializedBanner.append("		<categoryId>"+XmlUtil.encodeXml(categoryId)+"</categoryId>");
		serializedBanner.append("		<pointWeight>"+row.get("pointWeight")+"</pointWeight>");
		
		if (((Integer)row.get("type")).intValue() == BannerConfig.BANNER_TYPE_IMAGE)
		{
			MediaDataType.Data imageData = (MediaDataType.Data)row.get("image");
			if (imageData != null)
			{
				String pageId = row.get("onClickPageId") == null ? "" : row.get("onClickPageId", String.class);
				String url = row.get("onClickUrl") == null ? "" : row.get("onClickUrl", String.class);
				
				serializedBanner.append("		<type>image</type>");
				serializedBanner.append("		<image>");

				String srcUrl = ManagerFactory.getFileManager().getFileHref(douiContext.getRequest().getSessionConfig(),
						imageData.getFileId(), douiContext.getTransaction()).toString();

				serializedBanner.append("			<src>" + XmlUtil.encodeXml(srcUrl) + "</src>");
				serializedBanner.append("			<imageProperties>");
				serializedBanner.append("				<onclickLinkType>"+XmlUtil.encodeXml(row.get("onClickLinkType", String.class))+"</onclickLinkType>");
				serializedBanner.append("				<onclickPageId>"+XmlUtil.encodeXml(pageId)+"</onclickPageId>");
				serializedBanner.append("				<onclickUrl>"+XmlUtil.encodeXml(url)+"</onclickUrl>");
				serializedBanner.append("				<onClickPopup>"+XmlUtil.encodeXml(row.get("onClickPopup", String.class))+"</onClickPopup>");
				String onClickPopupProperties = row.get("onClickPopupProperties", String.class);
				if (onClickPopupProperties != null)
					serializedBanner.append("				<onClickPopupProperties>"+ XmlUtil.encodeXml(TextUtil.stringReplace(TextUtil.stringReplace(onClickPopupProperties, "'", ""), "\"", "")) +"</onClickPopupProperties>");
				serializedBanner.append("			</imageProperties>");
				serializedBanner.append("		</image>");				
			}
			else
			{
				serializedBanner.append("		<type>error</type>");
				serializedBanner.append("		<message>" + XmlUtil.encodeXml(localize("STR_BANNER_IMAGE_NOT_DEFINED;" + row.get("name"))) + "</message>");								
			}
		}
		else if (((Integer)row.get("type")).intValue() == BannerConfig.BANNER_TYPE_FLASH)
		{
			MediaDataType.Data imageData = (MediaDataType.Data)row.get("image");
			if (imageData != null)
			{
				serializedBanner.append("		<type>flash</type>");
				serializedBanner.append("		<flash>");

				// get URL fior the flash file
				String srcUrl;
				FileConfig fileConfig = ManagerFactory.getFileManager().get(douiContext.getRequest().getSessionConfig(), imageData.getFileId(), douiContext.getTransaction());
				ServiceInstanceConfig serviceInstanceConfig = ManagerFactory.getServiceInstanceManager().get(fileConfig.getServiceInstanceId(), douiContext.getTransaction());
				if (serviceInstanceConfig.getUsesPublicFileStorage()) 
				{
					srcUrl = ManagerFactory.getFileManager().getFileHref(douiContext.getRequest().getSessionConfig(), imageData.getFileId(), douiContext.getTransaction()).toString();
				}
				else 
				{
					srcUrl = FileDownloadControllerHtml.getFileDownloadUrl(imageData.getFileId(), true).toString();
				}
				srcUrl = douiContext.getResponse().encodeURL(douiContext.getRenderRequest().getContextPath() + "/" + srcUrl);
				
				serializedBanner.append("			<src>" + XmlUtil.encodeXml(srcUrl) + "</src>");				
				Integer width = row.get("width", Integer.class);
				if(width != null)
					serializedBanner.append("			<width>"+width.intValue()+"</width>");
				Integer height = row.get("height", Integer.class);
				if(height != null)
					serializedBanner.append("			<height>"+height.intValue()+"</height>");
				serializedBanner.append("		</flash>");
			}
			else
			{
				serializedBanner.append("		<type>error</type>");
				serializedBanner.append("		<message>" + XmlUtil.encodeXml(localize("STR_BANNER_IMAGE_NOT_DEFINED;" + row.get("name"))) + "</message>");				
			}
		}
		else if (((Integer)row.get("type")).intValue() == BannerConfig.BANNER_TYPE_HTML)
		{
			serializedBanner.append("		<type>html</type>");
			serializedBanner.append("		<htmlContent>");
			String html = XmlUtil.encodeXml(row.get("htmlContent", String.class));
			serializedBanner.append(html);
			serializedBanner.append("		</htmlContent>");
		}
		
		serializedBanner.append("</banner>");
		
		return serializedBanner.toString();
	}
	
	protected String getBannerControllerHtml()
	{
		// uses this method so the controllerHtmlUrl can be customized. 
		// Default url is the url of the default controller
		return BannerController.getBannerControllerUrl();
	}
}
