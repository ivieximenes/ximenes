/*
 * Copyright 2005 Lumis EIP Tecnologia da Informa��o
 */

package br.com.qualicorp.redenarede.service.banner;

import java.util.HashMap;
import java.util.Map;

import lumis.portal.PortalException;
import lumis.portal.authentication.SessionConfig;
import lumis.portal.manager.ManagerFactory;
import lumis.portal.monitor.IMonitor;
import lumis.portal.monitor.MonitorUtil;
import lumis.portal.page.PageConfig;
import lumis.portal.serviceinstance.ServiceInstanceConfig;
import lumis.portal.user.UserConfig;
import lumis.util.ITransaction;

/**
 * Contains banner monitoring constants and utility methods.
 *
 * @version $Revision: 8618 $ $Date: 2007-12-18 11:34:20 -0200 (Tue, 18 Dec 2007) $
 * @since 4.1.0
 */
public class BannerMonitorUtil
{
	/**
	 * The string resource path using for localizing banner monitoring strings.
	 * @since 4.1.0
	 */
	public static final String STRING_RESOURCE_PATH = "lumis/service/banner/strings/strings";
	
	/**
	 * Key for banner view event.
	 * @since 4.1.0
	 */
	public static final String EVENT_BANNER_VIEW = "lumis.service.banner.ev.bannerview";
	
	/**
	 * Key for banner click event.
	 * @since 4.1.0
	 */
	public static final String EVENT_BANNER_CLICK = "lumis.service.banner.ev.bannerclick";
	
	/**
	 * Key for banner's service instance path aggregation type.
	 * @since 4.1.0
	 */
	public static final String AGGREGATION_TYPE_BANNER_SI_PATH = "lumis.service.banner.at.banner.si.path";
	
	/**
	 * Key for banner's service instance friendly path aggregation type.
	 * @since 4.1.0
	 */
	public static final String AGGREGATION_TYPE_BANNER_SI_FRIENDLY_PATH = "lumis.service.banner.at.banner.si.friendlypath";
	
	/**
	 * Key for banner's name aggregation type.
	 * @since 4.1.0
	 */
	public static final String AGGREGATION_TYPE_BANNER_NAME = "lumis.service.banner.at.banner.name";
	
	/**
	 * Key for banner's category name aggregation type.
	 * @since 4.1.0
	 */
	public static final String AGGREGATION_TYPE_BANNER_CATEGORY_NAME = "lumis.service.banner.at.banner.category.name";
	
	private static Map<String, String> getAggregationValuesMap(ServiceInstanceConfig bannerServiceInstanceConfig, 
			String bannerName, String bannerCategoryId, 
			PageConfig displayPageConfig, ITransaction transaction) throws PortalException
	{
		Map<String, String> aggregationValues = new HashMap<String, String>();
		MonitorUtil.setPageAggregationValues(aggregationValues, displayPageConfig, transaction);
		
		SessionConfig sessionConfig = ManagerFactory.getAuthenticationManager().impersonate(UserConfig.USER_SYSTEM_ID);
		try
		{
			final String channelId = bannerServiceInstanceConfig.getChannelId();
			final String bannerServiceInstancePathSuffix = "/" + bannerServiceInstanceConfig.getName();
			
			final String serviceInstancePath = ManagerFactory.getChannelManager().getPath(sessionConfig, channelId, transaction) + bannerServiceInstancePathSuffix;
			aggregationValues.put(AGGREGATION_TYPE_BANNER_SI_PATH, serviceInstancePath);
			
			final String serviceInstanceFriendlyPath = ManagerFactory.getChannelManager().getFriendlyPath(sessionConfig, channelId, transaction) + bannerServiceInstancePathSuffix;
			aggregationValues.put(AGGREGATION_TYPE_BANNER_SI_FRIENDLY_PATH, serviceInstanceFriendlyPath);
			
			aggregationValues.put(AGGREGATION_TYPE_BANNER_NAME, bannerName);

			String categoryName = null;
			if (bannerCategoryId != null)
			{
				BannerDaoJdbc bannerDao = new BannerDaoJdbc();
				BannerCategoryConfig category = bannerDao.getCategory(bannerCategoryId, transaction);
				categoryName = category.getName();
			}
			aggregationValues.put(AGGREGATION_TYPE_BANNER_CATEGORY_NAME, categoryName);
		}
		finally
		{
			ManagerFactory.getAuthenticationManager().endImpersonation(sessionConfig);
		}
		
		return aggregationValues;
	}
	
	/**
	 * Returns a monitor for the {@value #EVENT_BANNER_VIEW} event.
	 * @param bannerServiceInstanceConfig the banner service instance.
	 * @param bannerName the banner's name.
	 * @param bannerCategoryId the banner's category id, or null if the banner
	 * has no category specified.
	 * @param displayPageConfig the page where the banner is shown.
	 * @param transaction the transaction for persistence access.
	 * @return the monitor.
	 * @since 4.1.0
	 */
	public static IMonitor getBannerViewMonitor(ServiceInstanceConfig bannerServiceInstanceConfig, 
			String bannerName, String bannerCategoryId, PageConfig displayPageConfig, 
			ITransaction transaction) throws PortalException
	{
		Map<String, String> aggregationValues = getAggregationValuesMap(bannerServiceInstanceConfig, 
				bannerName, bannerCategoryId, displayPageConfig, transaction);
		return ManagerFactory.getMonitorManager().getMonitor(EVENT_BANNER_VIEW, aggregationValues);
	}
	
	/**
	 * Returns a monitor for the {@value #EVENT_BANNER_CLICK} event.
	 * @param bannerServiceInstanceConfig the banner service instance.
	 * @param bannerName the banner's name.
	 * @param bannerCategoryId the banner's category id, or null if the banner
	 * has no category specified.
	 * @param displayPageConfig the page where the banner was shown.
	 * @param transaction the transaction for persistence access.
	 * @return the monitor.
	 * @since 4.1.0
	 */
	public static IMonitor getBannerClickMonitor(ServiceInstanceConfig bannerServiceInstanceConfig, 
			String bannerName, String bannerCategoryId, PageConfig displayPageConfig, 
			ITransaction transaction) throws PortalException
	{
		Map<String, String> aggregationValues = getAggregationValuesMap(bannerServiceInstanceConfig, 
				bannerName, bannerCategoryId, displayPageConfig, transaction);
		return ManagerFactory.getMonitorManager().getMonitor(EVENT_BANNER_CLICK, aggregationValues);
	}
}
