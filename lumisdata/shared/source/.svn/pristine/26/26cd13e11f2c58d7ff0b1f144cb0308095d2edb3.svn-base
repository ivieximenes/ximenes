package br.com.qualicorp.redenarede.service.administracaodelayout.processaction;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import lumis.doui.table.TableDeleteDataProcessActionHandler;
import lumis.portal.PortalException;
import lumis.portal.UnexpectedException;
import lumis.portal.dao.jdbc.ITransactionJdbc;

public class LayoutEstipulanteDeleteProcessActionHandler extends TableDeleteDataProcessActionHandler{

	@Override
	public void processAction() throws PortalException {
		
		String[] idlayout = (String[]) getParameter("idlayout");
		
		ITransactionJdbc daoTransactionJdbc = (ITransactionJdbc) transaction;
		try
		{
			StringBuilder sbQuery = new StringBuilder();
			sbQuery.append("DELETE FROM QC_LAYOUTESTIPULANTE ");
			sbQuery.append("WHERE idlayout = ?");

			Connection connection = daoTransactionJdbc.getConnection();
			PreparedStatement statement = connection.prepareStatement(sbQuery.toString());
			
			if(idlayout!=null && idlayout.length>0){
				statement = connection.prepareStatement(sbQuery.toString());
				try
				{
					for(int i=0;i<idlayout.length;i++){
						statement.setString(1, idlayout[i]);
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
		
		super.processAction();
	}
}
