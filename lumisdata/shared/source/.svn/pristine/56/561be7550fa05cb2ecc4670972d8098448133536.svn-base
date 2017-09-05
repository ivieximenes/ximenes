/*
 * Copyright 2005 Lumis EIP Tecnologia da Informa��o
 */

package br.com.qualicorp.redenarede.service.banner;

import java.util.Collection;

import lumis.doui.processaction.ProcessActionHandler;
import lumis.portal.PortalException;

/**
 * Checks if there is a banner of the category being deleted and throws an exception
 * if this is the case.
 *  
 * @version $Revision: 6440 $ $Date: 2007-04-13 17:39:18 -0300 (Fri, 13 Apr 2007) $
 * @since 4.0.0
 */public class CheckCategoryDeleteProcessActionHandler extends ProcessActionHandler
{
	public void processAction() throws PortalException
	{
		BannerDaoJdbc bannerDao = new BannerDaoJdbc();
		String[] categoryIds = (String[])getParameter("bannerCategoryId");
		
		for (String categoryId: categoryIds)
		{
			Collection<String> bannerIds = bannerDao.getCategoryBanners(categoryId, transaction);
			if (bannerIds != null && !bannerIds.isEmpty())
			{
				BannerCategoryConfig categoryConfig = bannerDao.getCategory(categoryId, transaction);
				throw new PortalException("STR_CATEGORY_IS_BEING_USED;" + categoryConfig.getName(), getResource());
			}
		}
	}
}
