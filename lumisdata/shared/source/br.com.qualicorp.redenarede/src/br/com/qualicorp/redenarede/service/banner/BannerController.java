package br.com.qualicorp.redenarede.service.banner;

import lumis.portal.PortalContext;
import lumis.portal.PortalException;
import lumis.portal.PortalRequestParameters;
import lumis.portal.UnexpectedException;
import lumis.portal.controller.ControllerException;
import lumis.portal.manager.ManagerFactory;
import lumis.portal.monitor.IMonitor;
import lumis.portal.page.PageConfig;
import lumis.portal.service.ServiceException;
import lumis.portal.servicecontainer.ServiceContainerRenderRequest;
import lumis.portal.servicecontainer.ServiceContainerRenderResponse;
import lumis.portal.serviceinstance.ServiceInstanceConfig;
import lumis.portal.serviceinterfaceinstance.ServiceInterfaceInstanceConfig;
import lumis.portal.serviceinterfaceinstance.ServiceInterfaceInstanceControllerHtml;
import lumis.portal.transaction.PortalTransactionFactory;
import lumis.util.ITransaction;
import lumis.util.TextUtil;
import lumis.util.log.ILogger;
import lumis.util.log.LoggerFactory;

import java.io.IOException;
import java.util.EnumSet;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.jsp.PageContext;

/**
 * 
 * 
 * @since 4.0.0
 * @version $Revision: 16824 $ $Date: 2015-01-23 18:49:12 -0200 (Fri, 23 Jan 2015) $
 */
public class BannerController extends ServiceInterfaceInstanceControllerHtml
{
	public static final String METHOD_GET_BANNER = "getBanner";
	public static final String METHOD_CLICK_BANNER = "clickBanner";
	
	private static BannerLogger loggerViews =  new BannerLogger("views");
	private static BannerLogger loggerClicks =  new BannerLogger("clicks");
	private static final ILogger LOGGER = LoggerFactory.getLogger(BannerController.class);
	
	public BannerController(HttpServletRequest request, HttpServletResponse response, PageContext pageContext) throws ControllerException, PortalException
	{
		super(request, response, pageContext);
	}
	
	public static BannerLogger getLoggerViews()
	{
		return loggerViews;
	}
	
	public static BannerLogger getLoggerClicks()
	{
		return loggerClicks;
	}
	
	@Override
	public void handleRequest() throws Exception
	{
		ITransaction transaction = PortalTransactionFactory.createTransaction();

		try
		{
			transaction.begin();
			
			String method = request.getParameter("bannerMethod");
			loadUserInfo(transaction);
			
			if(method.equals(METHOD_GET_BANNER))
			{
				getBanner(transaction);
			}	
			else if(method.equals(METHOD_CLICK_BANNER))
			{
				clickBanner(transaction);
			}
			
			transaction.commit();
		}
		catch(Exception e)
		{
			transaction.rollback();
			LOGGER.error(e);
		}
		finally
		{
			transaction.close();
		}
	}
	
	private void clickBanner(ITransaction transaction) throws PortalException
	{
		try
		{
			String serviceInterfaceInstanceId = request.getParameter(PortalRequestParameters.PAGE_PARAMETER_INTERFACE_INST);
			
			String bannerId = request.getParameter("bannerId");
			BannerDaoJdbc bannerDao = new BannerDaoJdbc();
			BannerConfig banner = bannerDao.get(bannerId, transaction);
			
			boolean logClicks = PortalContext.MODE_USER == this.mode;
			if (logClicks)
			{
				// check if the custom property has disabled the banner click logging
				String paramLogClicks = ManagerFactory.getServiceInterfaceInstanceManager().getCustomProperty(
						sessionConfig, serviceInterfaceInstanceId, BannerPropertiesDataProvider.PARAM_LOG_CLICKS, transaction);
				if(paramLogClicks == null)
					paramLogClicks = "1";
				
				if(!paramLogClicks.equals("1"))
					logClicks = false;
			}
			
			if(logClicks)
			{	
				ServiceInterfaceInstanceConfig serviceInterfaceInstanceConfig = ManagerFactory.getServiceInterfaceInstanceManager().get(sessionConfig, serviceInterfaceInstanceId, transaction);
				PageConfig pageConfig = ManagerFactory.getPageManager().get(sessionConfig, serviceInterfaceInstanceConfig.getPageId(), transaction );
				ServiceInstanceConfig bannerServiceInstanceConfig = ManagerFactory.getServiceInstanceManager().get(serviceInterfaceInstanceConfig.getServiceInstanceId(), transaction);
				IMonitor monitor = BannerMonitorUtil.getBannerClickMonitor(bannerServiceInstanceConfig, 
						banner.getName(), banner.getCategoryId(), pageConfig, transaction);
				monitor.setTransaction(transaction, 
						EnumSet.of(IMonitor.Setting.COLLECT_TO_INSTANT_BOUND_EVENT_DATA));
				getLoggerClicks().logAccess(request, sessionConfig, pageConfig, transaction);
			}
			
			if(banner.getType() == BannerConfig.BANNER_TYPE_IMAGE)
			{
				if(banner.getOnClickLinkType() == BannerConfig.BANNER_LINK_TYPE_URL)
					response.sendRedirect(banner.getOnClickUrl());
				else if (banner.getOnClickLinkType() == BannerConfig.BANNER_LINK_TYPE_INTERNAL_PAGE)
					response.sendRedirect("../../../"+PageConfig.PAGE_MAIN+"?"+PortalRequestParameters.PAGE_PARAMETER_PAGEID+"="+banner.getOnClickPageId());
			}
			else
			{
				//TODO: Ariel - define where to redirect.
			}
		}
		catch (PortalException e)
		{
			throw e;
		}
		catch (Exception e)
		{
			throw new UnexpectedException(e);
		}
	}

	private void getBanner(ITransaction transaction) throws PortalException
	{
		renderServiceInterfaceInstance();
	}
	
	@Override
	protected void renderOutput(ServiceContainerRenderRequest renderRequest, ServiceContainerRenderResponse renderResponse, Map<String, String> originalMap, ITransaction portalTransaction) throws ServiceException, IOException, PortalException
	{
		renderRequest.setCheckForCacheEnabled(false);
		String serviceInterfaceHtml = serviceContainer.renderServiceInterfaceInstance(renderRequest, renderResponse, portalTransaction);
		
		serviceInterfaceHtml = processHTML(renderRequest, serviceInterfaceHtml);

		out.write(convertToWrites(serviceInterfaceHtml));
	}
	
	protected String convertToWrites(String content)
	{
		String[] bannerContent = content.split("\n");
		StringBuffer script = new StringBuffer();
		
		for(int i = 0; i < bannerContent.length; i++)
		{
			script.append("document.write(\"");
			
			script.append(
				TextUtil.stringReplace(
						TextUtil.stringReplace(
								TextUtil.stringReplace(
									TextUtil.stringReplace(
											TextUtil.stringReplace(
													TextUtil.stringReplace(
															bannerContent[i]
													 , "\\", "\\\\")
											 , "\"", "\\\"")
									, "'", "\\'")
								, "\r", "\\r")								
						  , "</script>", "</scr\"+\"ipt>")
				, "<script", "<scr\"+\"ipt")
			); 
			script.append("\\n\");\n");
		}
		
		return script.toString();
	}
	
	public static String getBannerControllerUrl()
	{
		/*original*/
		//return "lumis/service/banner/BannerController.jsp";
		
		//return "lumis/api/rest/banner-qualicorp/controller";
		
//		return "lumis/api/rest/2C96A2CE5AC7FD01015AC8D44CB757C1"+ /*BannerDouiInterface.getServiceInterfaceInstanceId() +*/"/banner-qualicorp/controller";
		return "lumis/api/rest/2C96A2CE5AC7FD01015AC8D44CB757C1/teste123";
		//return "lumis-ignore/url/banner-qualicorp/controller";
	}

}
