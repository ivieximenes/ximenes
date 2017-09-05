/*
 * Copyright 2005 Lumis EIP Tecnologia da Informa��o
 */
package br.com.qualicorp.redenarede.service.banner;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Collection;

import lumis.portal.PortalException;
import lumis.portal.UnexpectedException;
import lumis.portal.dao.jdbc.ITransactionJdbc;
import lumis.util.ITransaction;
import lumis.util.JdbcUtil;

/**
 * 
 * banner storing object
 *
 * @version $Revision: 6440 $ $Date: 2007-04-13 17:39:18 -0300 (Fri, 13 Apr 2007) $
 * @since 4.0.0
 */
public class BannerDaoJdbc
{
	public BannerCategoryConfig getCategory(String bannerCategoryId, ITransaction transaction) throws PortalException
	{
		try
		{
			ITransactionJdbc daoTransactionJdbc = (ITransactionJdbc) transaction;
			Connection connection = daoTransactionJdbc.getConnection();

			PreparedStatement statement = connection.prepareStatement("select name, description from lum_BannerCategory where bannerCategoryId = ?");
			try
			{
				statement.setString(1, bannerCategoryId);
				ResultSet resultSet = statement.executeQuery();
				try
				{
					if (resultSet.next())
					{
						BannerCategoryConfig bannerCategoryConfig = new BannerCategoryConfig();
						bannerCategoryConfig.setId(bannerCategoryId);
						bannerCategoryConfig.setName(resultSet.getString("name"));
						bannerCategoryConfig.setDescription(resultSet.getString("description") );
						
						return bannerCategoryConfig;
					}
					else
						return null;
					
				}
				finally
				{
					resultSet.close();				
				}				
			}
			finally
			{
				statement.close();				
			}
		}
		catch (SQLException e)
		{
			throw new UnexpectedException(e);
		}
	}
	
	public BannerConfig get(String bannerId, ITransaction transaction) throws PortalException
	{
		try
		{
			ITransactionJdbc daoTransactionJdbc = (ITransactionJdbc) transaction;
			Connection connection = daoTransactionJdbc.getConnection();

			PreparedStatement statement = connection.prepareStatement("select name, description, categoryId, type, pointWeight, image, " +
					"htmlContent, onClickLinkType, onClickPageId," +
					"onClickUrl, onClickPopup, width, height from lum_Banner where bannerId = ?");
			try
			{
				statement.setString(1, bannerId);
				ResultSet resultSet = statement.executeQuery();
				try
				{
					if (resultSet.next())
					{
						BannerConfig bannerConfig = new BannerConfig();
						bannerConfig.setId(bannerId);
						bannerConfig.setName(resultSet.getString("name"));
						bannerConfig.setDescription(resultSet.getString("description") );
						bannerConfig.setCategoryId(resultSet.getString("categoryId") );
						bannerConfig.setType(resultSet.getInt("type"));
						bannerConfig.setPointWeight(resultSet.getInt ("pointWeight"));
						bannerConfig.setImage(resultSet.getString ("image"));
						bannerConfig.setHtmlContent(resultSet.getString("htmlContent"));
						bannerConfig.setOnClickLinkType(resultSet.getInt("onClickLinkType"));
						bannerConfig.setOnClickPageId(resultSet.getString("onClickPageId"));
						bannerConfig.setOnClickUrl(resultSet.getString("onClickUrl"));
						bannerConfig.setOnClickPopup(resultSet.getBoolean("onClickPopUp"));
						bannerConfig.setWidth(resultSet.getInt("width"));
						bannerConfig.setHeight(resultSet.getInt("height"));
						return bannerConfig;
					}
					else
						return null;
					
				}
				finally
				{
					resultSet.close();				
				}				
			}
			finally
			{
				statement.close();				
			}
		}
		catch (SQLException e)
		{
			throw new UnexpectedException(e);
		}
	}
	
	public Collection<String> getCategoryBanners(String bannerCategoryId, ITransaction transaction)  throws PortalException
	{
		try
		{
			ITransactionJdbc daoTransactionJdbc = (ITransactionJdbc) transaction;
			Connection connection = daoTransactionJdbc.getConnection();
			
			PreparedStatement statement;
			
			if(bannerCategoryId == null)
			{
				statement = connection.prepareStatement("select bannerId from lum_Banner where categoryId IS NULL");
			}
			else
			{
				statement = connection.prepareStatement("select bannerId from lum_Banner where categoryId = ?");
				statement.setString(1, bannerCategoryId);
			}
			
			Collection<String> returnValues = JdbcUtil.fillListString(statement, "bannerId");
			statement.close();

			return returnValues;
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

}
