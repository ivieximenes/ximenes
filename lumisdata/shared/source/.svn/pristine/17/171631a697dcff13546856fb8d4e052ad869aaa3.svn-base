/*
 * Copyright 2005 Lumis EIP Tecnologia da Informa��o
 */
package br.com.qualicorp.redenarede.service.banner;

import lumis.doui.processaction.ProcessActionHandler;
import lumis.doui.source.Source;
import lumis.portal.PortalException;
import lumis.portal.manager.ManagerFactory;
import lumis.portal.serviceinterfaceinstance.IServiceInterfaceInstanceManager;
import lumis.util.XmlUtil;

/**
 * Process action handler for the banner service.
 *
 * @version $Revision: 13992 $ $Date: 2012-01-31 15:06:47 -0200 (Tue, 31 Jan 2012) $
 * @since 4.0.0
 */
public class BannerProcessActionHandler extends ProcessActionHandler<Source>
{
	
	public static final String BANNER_SET_PROPERTIES = "lum_bannerSetProperties";
	
	public void processAction() throws PortalException
	{
		String actionType = XmlUtil.readAttributeString("actionType", processActionNode);
		
		if(actionType.equals(BANNER_SET_PROPERTIES))
			processSetProperties();
	}
	
	protected void processSetProperties() throws PortalException
	{
		String serviceInterfaceInstanceId, categoryId, totalItems, randomize, logViews, logClicks;
		
		serviceInterfaceInstanceId = getParameter("callerInterfaceInstanceId", String.class);
		categoryId = getParameter("categoryId", String.class);
		
		Object numTotalItems = getParameter("totalItems");
		if (numTotalItems != null)
			totalItems = numTotalItems.toString();
		else
			totalItems = null;
		
		Boolean boolRandomize = (Boolean)getParameter("randomize");
		if (boolRandomize != null && boolRandomize.booleanValue())
			randomize = "1";
		else
			randomize = "0";
		
		String dynamic = getParameter("dynamic", Boolean.class).booleanValue() ? BannerPropertiesDataProvider.PARAM_DYNAMIC_TRUE_VALUE : "";
		Long intTimeout = getParameter("timeout", Long.class);
		String timeout = intTimeout != null ? intTimeout.toString() : "0";

		Boolean boolLogViews = (Boolean)getParameter("logViews");
		if (boolLogViews != null && boolLogViews.booleanValue())
			logViews = "1";
		else
			logViews = "0";
		
		Boolean boolLogClicks = (Boolean)getParameter("logClicks");
		if (boolLogClicks != null && boolLogClicks.booleanValue())
			logClicks = "1";
		else
			logClicks = "0";
		
		IServiceInterfaceInstanceManager instanceManager = ManagerFactory.getServiceInterfaceInstanceManager();
		
		instanceManager.setCustomProperty(sessionConfig, serviceInterfaceInstanceId, BannerPropertiesDataProvider.PARAM_CATEGORY_ID, categoryId, transaction);
		instanceManager.setCustomProperty(sessionConfig, serviceInterfaceInstanceId, BannerPropertiesDataProvider.PARAM_TOTAL_ITEMS, totalItems, transaction);
		instanceManager.setCustomProperty(sessionConfig, serviceInterfaceInstanceId, BannerPropertiesDataProvider.PARAM_RANDOMIZE, randomize, transaction);
		instanceManager.setCustomProperty(sessionConfig, serviceInterfaceInstanceId, BannerPropertiesDataProvider.PARAM_DYNAMIC, dynamic, transaction);
		instanceManager.setCustomProperty(sessionConfig, serviceInterfaceInstanceId, BannerPropertiesDataProvider.PARAM_TIMEOUT, timeout, transaction);
		instanceManager.setCustomProperty(sessionConfig, serviceInterfaceInstanceId, BannerPropertiesDataProvider.PARAM_LOG_VIEWS, logViews, transaction);
		instanceManager.setCustomProperty(sessionConfig, serviceInterfaceInstanceId, BannerPropertiesDataProvider.PARAM_LOG_CLICKS, logClicks, transaction);
		
		addDefaultResponse();
	}

}
