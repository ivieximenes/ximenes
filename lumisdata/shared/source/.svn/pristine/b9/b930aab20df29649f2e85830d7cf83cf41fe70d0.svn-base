package br.com.qualicorp.redenarede.service.oauth.manager;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import br.com.qualicorp.redenarede.commons.utils.JDBCUtils;
import lumis.portal.UnexpectedException;
import lumis.portal.dao.jdbc.ITransactionJdbc;
import lumis.portal.transaction.PortalTransactionFactory;
import lumis.util.log.ILogger;
import lumis.util.log.LoggerFactory;

public class OauthAuthenticationManager
{
	private static ILogger logger = LoggerFactory.getLogger(OauthAuthenticationManager.class);
	
	private static OauthAuthenticationManager manager;
	
	private OauthAuthenticationManager()
	{
		
	}
	
	public static OauthAuthenticationManager getInstance()
	{
		if (manager == null)
			manager = new OauthAuthenticationManager();
		
		return manager;
	}
	
	
	public String getRefreshToken(String userId, String system) throws UnexpectedException 
	{
		ITransactionJdbc transaction = null;
		Connection connection = null;
		PreparedStatement statement = null;
		ResultSet resultSet = null;
		
		try
		{
			transaction = (ITransactionJdbc) PortalTransactionFactory.createTransaction();
			
			transaction.begin();
			
			connection = transaction.getConnection();

			statement = connection.prepareStatement(" select refresh_token from QC_OAUTH where user_id = ? and system=? ");
			
			statement.setString(1, userId);
			statement.setString(2, system);
			
			resultSet = statement.executeQuery();
			
			if (resultSet.next())
				return resultSet.getString("refresh_token");
			
		}
		catch (Exception e)
		{
			logger.error("Erro", e);
			throw new UnexpectedException(e);
		}
		finally
		{
			try
			{
				JDBCUtils.closeAndDispose(resultSet, statement, transaction);
			}
			catch (SQLException e)
			{
				logger.error("Erro ao fechar resources JDBC", e);
				throw new UnexpectedException(e);
			}
		}
		
		return null;
	}
	
	
	public boolean addRefreshToken(String id, String userId, String system) throws UnexpectedException 
	{
		boolean sucesso = false;
		
		ITransactionJdbc transaction = null;
		Connection connection = null;
		PreparedStatement statement = null;
		
		try
		{
			transaction = (ITransactionJdbc) PortalTransactionFactory.createTransaction();
			
			transaction.begin();
			
			connection = transaction.getConnection();
			
			statement = connection.prepareStatement("insert into QC_OAUTH values(?, ?, ?)");
			
			statement.setString(1, id);
			statement.setString(2, userId);
			statement.setString(3, system);
			
			sucesso = statement.execute();
			
			transaction.commit();
		}
		catch (Exception e)
		{
			logger.error("Erro", e);
			throw new UnexpectedException(e);
		}
		finally
		{
			try
			{
				JDBCUtils.closeAndDispose(null, statement, transaction);
			}
			catch (SQLException e)
			{
				logger.error("Erro ao fechar resources JDBC", e);
				throw new UnexpectedException(e);
			}
		}
		
		return sucesso;
	}

	
	public boolean updateRefreshToken(String newToken, String oldToken) throws UnexpectedException 
	{
		boolean sucesso = false;
		
		ITransactionJdbc transaction = null;
		Connection connection = null;
		PreparedStatement statement = null;
		
		try
		{
		
			transaction = (ITransactionJdbc) PortalTransactionFactory.createTransaction();
			
			transaction.begin();
			
			connection = transaction.getConnection();
			
			statement = connection.prepareStatement(" update QC_OAUTH set refresh_token = ? where refresh_token=?");
			
			statement.setString(1, newToken);
			statement.setString(2, oldToken);
			
			sucesso = statement.execute();
			
			transaction.commit();
		}
		catch (Exception e)
		{
			logger.error("Erro", e);
			throw new UnexpectedException(e);
		}
		finally
		{
			try
			{
				JDBCUtils.closeAndDispose(null, statement, transaction);
			}
			catch (SQLException e)
			{
				logger.error("Erro ao fechar resources JDBC", e);
				throw new UnexpectedException(e);
			}
		}
		
		return sucesso;
	}


	public boolean deleteRefreshToken(String token) throws UnexpectedException
	{
		boolean sucesso = false;
		
		ITransactionJdbc transaction = null;
		Connection connection = null;
		PreparedStatement statement = null;
		
		try
		{

			transaction = (ITransactionJdbc) PortalTransactionFactory.createTransaction();
			
			transaction.begin();
			
			connection = transaction.getConnection();
			
			statement = connection.prepareStatement(" delete from  QC_OAUTH where refresh_token=?");
			
			statement.setString(1, token);
			sucesso = statement.execute();
			
			transaction.commit();
		}
		catch (Exception e)
		{
			logger.error("Erro", e);
			throw new UnexpectedException(e);
		}
		finally
		{
			try
			{
				JDBCUtils.closeAndDispose(null, statement, transaction);
			}
			catch (SQLException e)
			{
				logger.error("Erro ao fechar resources JDBC", e);
				throw new UnexpectedException(e);
			}
		}
		
		return sucesso;
	}
}
