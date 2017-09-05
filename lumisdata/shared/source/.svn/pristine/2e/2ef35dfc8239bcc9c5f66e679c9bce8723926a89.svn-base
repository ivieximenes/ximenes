/*
 * Copyright 2005 Lumis EIP Tecnologia da Informa��o
 */
package br.com.qualicorp.redenarede.service.banner;

import javax.servlet.http.HttpServletRequest;

import lumis.portal.authentication.SessionConfig;
import lumis.portal.manager.ManagerFactory;
import lumis.portal.page.PageConfig;
import lumis.util.ITransaction;
import lumis.util.log.ILogger;
import lumis.util.log.LoggerFactory;
import lumis.util.log.NavigationLogger;

/**
 * Logs banner events in the W3C Extended format.
 *
 * @version $Revision: 7370 $ $Date: 2007-06-12 13:50:49 -0300 (Tue, 12 Jun 2007) $
 * @since 4.0.0
 */
public class BannerLogger extends NavigationLogger
{
	private static ILogger logger = LoggerFactory.getLogger(BannerLogger.class);
	
	/**
	 * The attribute name used to read the banner identifier from the request.
	 * @sincen 4.0.11
	 */
	public static final String BANNER_ID_ATTRIBUTE_NAME = "bannerId";
	
	public BannerLogger(String type)
	{
		super();
		navigationLogger = LoggerFactory.getServiceLogger("lumis.service.banner."+ type);
	}
	
	@Override
	protected void generateLogURI(HttpServletRequest request, StringBuilder logOutput, SessionConfig sessionConfig, PageConfig pageConfig, ITransaction transaction)
	{
		// generate friendly path
		try
		{
			String bannerId = request.getParameter("bannerId");
			if(bannerId == null)
				bannerId = (String)request.getAttribute(BANNER_ID_ATTRIBUTE_NAME);
			
			if(bannerId == null)
				throw new Exception("banner identifier not found");
			
			BannerDaoJdbc bannerDao = new BannerDaoJdbc();
			BannerConfig banner = bannerDao.get(bannerId, transaction);
			
			String path = ManagerFactory.getChannelManager().getFriendlyPath(sessionConfig, pageConfig.getChannelId(), transaction)
					+ "/" + pageConfig.getName() + "/" + banner.getName();
			if (!path.startsWith("/"))
				path = "/" + path;

			logOutput.append(encodeToW3cLog(path)); // cs-uri-stem
			logOutput.append(" - "); // cs-uri-query
		}
		catch(Exception e)
		{
			logger.warn("Could not generate friendly path for page " + request.getRequestURI() + "?" + request.getQueryString(), e);
			
			// friendly path could not be generated. Use real accessed path
			logOutput.append(encodeToW3cLog(request.getRequestURI())); // cs-uri-stem
			logOutput.append(" ");
			
			logOutput.append(encodeToW3cLog(request.getQueryString())); // cs-uri-query
			logOutput.append(" ");				
		}
		
	}
	
}
