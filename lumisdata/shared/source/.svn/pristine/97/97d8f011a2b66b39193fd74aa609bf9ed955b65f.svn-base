/*
 * Copyright 2005 Lumis EIP Tecnologia da Informa��o
 */
package br.com.qualicorp.redenarede.service.banner;

import lumis.doui.source.IDataProvider;
import lumis.doui.source.ISourceData;
import lumis.doui.source.Source;
import lumis.portal.PortalException;
import lumis.portal.authentication.SessionConfig;
import lumis.portal.manager.ManagerFactory;
import lumis.portal.serviceinterfaceinstance.IServiceInterfaceInstanceManager;
import lumis.util.ITransaction;

/**
 * Banner Properties data provider.
 * @version $Revision: 14186 $ $Date: 2012-04-02 11:40:15 -0300 (Mon, 02 Apr 2012) $
 * @since 6.2.0
 */
public class BannerPropertiesDataProvider implements IDataProvider<Source<?>>
{
	public static final String PARAM_CATEGORY_ID = "paramBannerCategoryId";
	public static final String PARAM_TOTAL_ITEMS = "paramBannerTotalItems";
	public static final String PARAM_RANDOMIZE = "paramBannerRandomize";
	public static final String PARAM_LOG_VIEWS = "paramBannerLogView";
	public static final String PARAM_LOG_CLICKS = "paramBannerLogClick";
	public static final String PARAM_DYNAMIC = "paramDynamic";
	public static final String PARAM_DYNAMIC_TRUE_VALUE = "1";
	public static final String PARAM_TIMEOUT = "paramTimeout";
	static final long DEFAULT_TIMEOUT = 10000L;

	public void loadData(SessionConfig sessionConfig, Source<?> source, ITransaction transaction) throws PortalException
	{
		String 	serviceInterfaceInstanceId, 
				categoryId, 
				totalItems, 
				randomize, 
				logViews, 
				logClicks,
				dynamic,
				timeout;
		
		IServiceInterfaceInstanceManager instanceManager = ManagerFactory.getServiceInterfaceInstanceManager();
		
		serviceInterfaceInstanceId = source.getDouiContext().getRequest().getCallerServiceInterfaceInstanceId();
		categoryId = instanceManager.getCustomProperty(sessionConfig, serviceInterfaceInstanceId, BannerPropertiesDataProvider.PARAM_CATEGORY_ID, transaction);
		totalItems = instanceManager.getCustomProperty(sessionConfig, serviceInterfaceInstanceId, BannerPropertiesDataProvider.PARAM_TOTAL_ITEMS, transaction);
		randomize = instanceManager.getCustomProperty(sessionConfig, serviceInterfaceInstanceId, BannerPropertiesDataProvider.PARAM_RANDOMIZE, transaction);
		dynamic = instanceManager.getCustomProperty(sessionConfig, serviceInterfaceInstanceId, BannerPropertiesDataProvider.PARAM_DYNAMIC, transaction);
		timeout = instanceManager.getCustomProperty(sessionConfig, serviceInterfaceInstanceId, BannerPropertiesDataProvider.PARAM_TIMEOUT, transaction);
		
		logViews = instanceManager.getCustomProperty(sessionConfig, serviceInterfaceInstanceId, BannerPropertiesDataProvider.PARAM_LOG_VIEWS, transaction);
		logClicks = instanceManager.getCustomProperty(sessionConfig, serviceInterfaceInstanceId, BannerPropertiesDataProvider.PARAM_LOG_CLICKS, transaction);

		if(randomize == null)
			randomize = "false";
		else
			randomize = Boolean.toString("1".equals(randomize));

		if (dynamic == null)
			dynamic = "false";
		else
			dynamic = Boolean.toString(PARAM_DYNAMIC_TRUE_VALUE.equals(dynamic));
		
		if(logViews == null)
			logViews = "true";
		else
			logViews = Boolean.toString("1".equals(logViews));
		
		if(logClicks == null)
			logClicks = "true";
		else
			logClicks = Boolean.toString("1".equals(logClicks));
		
		if(totalItems == null)
			totalItems = "1";
		
		ISourceData sourceData = source.getData();
		
		sourceData.put("categoryId", categoryId);
		sourceData.put("totalItems", totalItems);
		sourceData.put("randomize", randomize);
		sourceData.put("dynamic", dynamic);
		sourceData.put("timeout", timeout != null ? Long.parseLong(timeout) : Long.valueOf(0L));
		sourceData.put("logViews", logViews);
		sourceData.put("logClicks", logClicks);
	}

}
