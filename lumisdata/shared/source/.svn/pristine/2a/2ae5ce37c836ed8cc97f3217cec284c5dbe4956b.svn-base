package br.com.qualicorp.redenarede.service.administracaodelayout.processaction;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import lumis.doui.table.TableAddDataProcessActionHandler;
import lumis.portal.PortalException;
import lumis.portal.UnexpectedException;
import lumis.portal.dao.jdbc.ITransactionJdbc;
import lumis.util.PortalUtil;

public class LayoutEstipulanteAddEditProcessActionHandler extends TableAddDataProcessActionHandler
{
	@Override
	public void processAction() throws PortalException
	{
		String[] estipulantes = (String[]) getParameter("idestipulante");
		String idlayout = (String) getParameter("idlayout");

		addOrUpdateRelation(estipulantes, idlayout);

		addDefaultResponse();
	}
	
	public void addOrUpdateRelation(String[] estipulantes, String idlayout) throws PortalException
	{
		ITransactionJdbc daoTransactionJdbc = (ITransactionJdbc) transaction;
		String sql = "";
		try
		{
			StringBuilder sbQuery = new StringBuilder();
			sbQuery.append("DELETE FROM QC_LAYOUTESTIPULANTE ");
			sbQuery.append("WHERE idlayout = ?");

			Connection connection = daoTransactionJdbc.getConnection();
			PreparedStatement statement = connection.prepareStatement(sbQuery.toString());
			statement.setString(1, idlayout);
			try
			{
				statement.executeUpdate();
			}
			finally
			{
				statement.close();
			}

			if (estipulantes != null && estipulantes.length > 0)
			{
				sql = "INSERT INTO QC_LAYOUTESTIPULANTE (idlayoutestipulante,idlayout,idestipulante) values (?,?,?)";
				
				statement = connection.prepareStatement(sql);
				
				try
				{
					for (int i = 0; i < estipulantes.length; i++)
					{
						statement.setString(1, PortalUtil.generateNewGuid());
						statement.setString(2, idlayout);
						statement.setString(3, estipulantes[i]);
						
						statement.addBatch();
					}
					
					statement.executeBatch();
				}
				finally
				{
					statement.close();
				}
			}
		}
		catch (SQLException e)
		{
			throw new UnexpectedException(e);
		}
	}
}
