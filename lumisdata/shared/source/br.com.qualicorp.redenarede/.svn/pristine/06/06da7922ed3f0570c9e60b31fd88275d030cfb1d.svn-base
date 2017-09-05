package br.com.qualicorp.redenarede.commons.utils;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import lumis.util.ITransaction;

public final class JDBCUtils
{
	public static void close(ResultSet rs, PreparedStatement statement) throws SQLException
	{
		try
		{
			if (rs != null)
				rs.close();
		}
		finally
		{
			if (statement != null)
				statement.close();
		}
	}
	
	public static void closeAndDispose(ResultSet rs, PreparedStatement statement, ITransaction transaction) throws SQLException
	{
		try
		{
			if (rs != null)
				rs.close();
		}
		finally
		{
			try
			{
				if (statement != null)
					statement.close();
			}
			finally
			{
				if (transaction != null)
					transaction.close();
			}
		}
	}
}