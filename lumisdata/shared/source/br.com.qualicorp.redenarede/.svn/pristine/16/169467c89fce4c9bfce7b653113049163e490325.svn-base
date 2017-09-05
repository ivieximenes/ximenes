/*
 * Copyright 2005 Lumis EIP Tecnologia da Informa��o
 */
package br.com.qualicorp.redenarede.service.banner;

import lumis.content.table.ContentTableDataProvider;
import lumis.doui.DouiContext;
import lumis.doui.control.IDataControl;
import lumis.doui.source.ISourceData;
import lumis.doui.source.Source;
import lumis.doui.source.TabularData;
import lumis.doui.table.TableSource;
import lumis.doui.table.field.ITableSourceField;
import lumis.portal.PortalException;
import lumis.portal.authentication.SessionConfig;
import lumis.portal.manager.ManagerFactory;
import lumis.portal.serviceinterface.IServiceInterfaceRequest;
import lumis.portal.serviceinterfaceinstance.IServiceInterfaceInstanceManager;
import lumis.util.ITransaction;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * Banner data provider.
 * @version $Revision: 15840 $ $Date: 2013-09-04 12:36:30 -0300 (Wed, 04 Sep 2013) $
 * @since 6.2.0
 */
public class BannerDataProvider extends ContentTableDataProvider 
{
	public BannerDataProvider() throws PortalException
	{
		super();
	}

	public void loadData(SessionConfig sessionConfig, TableSource source, ITransaction transaction) throws PortalException
	{
		String serviceInterfaceInstanceId = source.getSourceContainer().getDouiContext().getRequest().getServiceInterfaceInstanceConfig().getId();
		IServiceInterfaceInstanceManager interfaceInstanceManager = ManagerFactory.getServiceInterfaceInstanceManager();
		
		String paramCategoryId, paramRandomize, paramTotalItems;
		
		paramCategoryId = interfaceInstanceManager.getCustomProperty(sessionConfig, serviceInterfaceInstanceId, BannerPropertiesDataProvider.PARAM_CATEGORY_ID, transaction );
		paramRandomize = interfaceInstanceManager.getCustomProperty(sessionConfig, serviceInterfaceInstanceId, BannerPropertiesDataProvider.PARAM_RANDOMIZE, transaction );
		paramTotalItems = interfaceInstanceManager.getCustomProperty(sessionConfig, serviceInterfaceInstanceId, BannerPropertiesDataProvider.PARAM_TOTAL_ITEMS, transaction );
		
		source.setParameterValue("categoryId", paramCategoryId, paramCategoryId);
		
		boolean randomize;
		int totalItems;

		if(paramRandomize == null)
			paramRandomize = "0";
		
		if(paramTotalItems == null)
			paramTotalItems = "1";
		
		randomize = paramRandomize.equals("1") ? true : false;
		totalItems = Integer.parseInt(paramTotalItems);
		
		super.loadData(sessionConfig, source, transaction);
		TabularData banners = source.getData();
		
		if(randomize)
		{
			randomizedBanners(banners, totalItems);
		}
		else if(totalItems < banners.getRows().size())
		{
			DouiContext douiContext = source.getDouiContext();
			if (douiContext != null)
			{
				sequenceBanners(totalItems, banners, douiContext.getRequest(), source);
			}
			else
			{
				sequenceBanners(banners, totalItems);
			}
		}
	}

	/**
	 * Sequence banners limiting to the total items.
	 * @param banners the banners.
	 * @param totalItems the total items.
	 * @since 6.2.0
	 */
	private void sequenceBanners(TabularData banners, int totalItems)
	{
		for (int i = banners.getRows().size() - 1; i >= totalItems; i--)
		{
			banners.getRows().remove(i);
		}
	}

	/**
	 * Sequence banners accordingly to the request.
	 * 
	 * @param totalItems
	 *            the total items.
	 * @param banners
	 *            the banners.
	 * @param request
	 *            the request.
	 * @param source
	 *            the source.
	 * @since 6.2.0
	 */
	private void sequenceBanners(int totalItems, TabularData banners, IServiceInterfaceRequest request, Source<ITableSourceField> source) throws PortalException
	{
		Integer currentBannerNumber = getCurrentBannerNumber(request);
		if (currentBannerNumber == null)
			currentBannerNumber = 0;

		List<ISourceData> rows = banners.getRows();
		final int numberOfRows = rows.size();

		if (currentBannerNumber >= numberOfRows)
			currentBannerNumber = currentBannerNumber % numberOfRows;

		List<ISourceData> rowsToKeep = new ArrayList<ISourceData>();
		for (int i = 0; i < totalItems; i++)
		{
			rowsToKeep.add(rows.get(currentBannerNumber));
			currentBannerNumber = (currentBannerNumber + 1) % numberOfRows;
		}

		rows.clear();
		rows.addAll(rowsToKeep);

		Integer nextBannerNumber = currentBannerNumber;
		setNextBannerNumber(nextBannerNumber, source);
	}

	protected void randomizedBanners(TabularData banners, int amount) throws PortalException
	{
		List<ISourceData> bannerList = new ArrayList<ISourceData>();
		
		int totalWeight = 0;
		for(ISourceData row : banners.getRows())
		{
			totalWeight += ((Integer)row.get("pointWeight")).intValue();
			bannerList.add(row);
		}
		
		Random r = new Random();
		int number, acc, i;
		
		while(amount > 0 && bannerList.size() > 0)
		{
			number = r.nextInt(totalWeight);
			acc = 0;
			i = 0;
			for(ISourceData row : bannerList)
			{
				if(number < ((Integer)row.get("pointWeight")).intValue() + acc)
					break;
				else
					acc += ((Integer)row.get("pointWeight")).intValue();
				i++;
			}
			
			totalWeight -= ((Integer)bannerList.get(i).get("pointWeight")).intValue();
			amount--;
			bannerList.remove(i);
		}
		
		banners.getRows().removeAll(bannerList);
	}
	
	/**
	 * Returns the current banner number.
	 * @param request the request.
	 * @return the current banner number.
	 * @since 6.2.0
	 */
	private static final Integer getCurrentBannerNumber(IServiceInterfaceRequest request)
	{
		String number = request.getParameter(BannerControl.BANNER_NUMBER_PARAMETER_NAME);
		return number != null ? Integer.parseInt(number, Character.MAX_RADIX) : null;
	}

	/**
	 * Sets the next banner number in control.
	 * 
	 * @param nextBannerNumber
	 *            the next banner number.
	 * @param source
	 *            the source.
	 * @since 6.2.0
	 */
	private void setNextBannerNumber(Integer nextBannerNumber, Source<ITableSourceField> source) throws PortalException
	{
		IDataControl control = (IDataControl) source.getSourceContext().getDouiContext().getControlContainer().getControlById(BannerControl.BANNER_NUMBER_PARAMETER_NAME);
		if (control != null)
			control.setValue(Integer.toString(nextBannerNumber, Character.MAX_RADIX));
	}
}
