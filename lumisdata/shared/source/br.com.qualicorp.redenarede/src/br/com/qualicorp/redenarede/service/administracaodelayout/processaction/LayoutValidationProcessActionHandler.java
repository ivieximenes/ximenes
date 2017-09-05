package br.com.qualicorp.redenarede.service.administracaodelayout.processaction;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import br.com.qualicorp.redenarede.commons.utils.JDBCUtils;
import br.com.qualicorp.redenarede.commons.utils.StringUtils;
import lumis.doui.table.TableAddDataProcessActionHandler;
import lumis.portal.PortalException;
import lumis.portal.UnexpectedException;
import lumis.portal.dao.jdbc.ITransactionJdbc;

public class LayoutValidationProcessActionHandler extends TableAddDataProcessActionHandler
{
	@Override
	public void processAction() throws PortalException
	{
		String[] estipulantes = (String[]) getParameter("idestipulante");
		String idlayout = (String) getParameter("idlayout");

		System.out.println("teste3");
		
		String error = isEstipulanteAlreadyAssociated(estipulantes, idlayout);

		if (error != null)
			throw new PortalException(error);
		
		addDefaultResponse();
	}
	
	public String isEstipulanteAlreadyAssociated(String[] estipulantes, String idlayout) throws PortalException
	{
		if (estipulantes == null || estipulantes.length == 0)
			return null;
		
		StringBuilder validatations = new StringBuilder();
		
		ITransactionJdbc daoTransactionJdbc = (ITransactionJdbc) transaction;
		PreparedStatement statement = null;
		ResultSet rs = null;
		
		try
		{
			StringBuilder sb = new StringBuilder()
			.append("SELECT e.codigo, e.nome, l.nome_do_layout \n")
			.append("  FROM QC_LAYOUTESTIPULANTE le \n")
			.append(" INNER JOIN qc_estipulante e ON e.idestipulante = le.idestipulante \n")
			.append(" INNER JOIN QC_LAYOUT l ON l.idlayout = le.idlayout \n")
			.append("WHERE le.idestipulante IN ( \n");
			
			for (int i = 0; i < estipulantes.length; i++)
				sb.append("?, ");
			
			sb.replace(sb.length() - 2, sb.length(), "");
			
			sb.append(" ) \n");
			
			if (!StringUtils.isBlankOrNull(idlayout))
				sb.append("  AND le.idlayout <> ? \n");

			Connection connection = daoTransactionJdbc.getConnection();
			
			statement = connection.prepareStatement(sb.toString());
			
			int index = 0;
			
			for (int i = 0; i < estipulantes.length; i++)
				statement.setString(++index, estipulantes[i]);
			
			if (!StringUtils.isBlankOrNull(idlayout))
				statement.setString(++index, idlayout);
			
			rs = statement.executeQuery();
			
			while (rs.next())
			{
				validatations
				.append("O estipulante '").append(rs.getLong("codigo")).append(" - ").append(rs.getString("nome")).append("' já está associado ao layout '")
				.append(rs.getString("nome_do_layout")).append("'!\n");
			}
		}
		catch (SQLException e)
		{
			throw new UnexpectedException(e);
		}
		finally
		{
			try
			{
				JDBCUtils.close(rs, statement);
			}
			catch (SQLException e)
			{
				throw new UnexpectedException(e);
			}
		}
		
		if (validatations.length() == 0)
			return null;
		
		return validatations.toString();
	}
}
