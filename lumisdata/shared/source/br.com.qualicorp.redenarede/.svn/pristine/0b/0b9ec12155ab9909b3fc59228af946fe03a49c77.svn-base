package br.com.qualicorp.redenarede.service.administracaodelayout.manager;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import br.com.qualicorp.redenarede.commons.utils.JDBCUtils;
import br.com.qualicorp.redenarede.commons.utils.StringUtils;
import br.com.qualicorp.redenarede.service.administracaodelayout.to.LayoutTO;
import br.com.qualicorp.redenarede.service.administracaoestipulante.manager.EstipulanteManager;
import lumis.portal.UnexpectedException;
import lumis.portal.authentication.SessionConfig;
import lumis.portal.dao.jdbc.ITransactionJdbc;
import lumis.util.log.ILogger;
import lumis.util.log.LoggerFactory;

public class LayoutManager
{
	private static ILogger logger = LoggerFactory.getServiceLogger("gsp.WebService");
	
	final String GSP_BENEFICIARIO = "gsp.beneficiario";
	
	private static LayoutManager manager;
	
	private LayoutManager()
	{
		
	}
	
	public static LayoutManager getInstance()
	{
		if (manager == null)
			manager = new LayoutManager();
		
		return manager;
	}
	
	public LayoutTO getLayoutForLoggedUser(ITransactionJdbc transaction, SessionConfig sessionConfig) throws UnexpectedException
	{
		LayoutTO to = null;
		
		Connection connection = null;
		PreparedStatement statement = null;
		ResultSet resultSet = null;
		
		try
		{
			String tuplesEstipulantes = EstipulanteManager.getInstance().getTuplesCodEstipulanteAndSub(sessionConfig.getUserId(), transaction, sessionConfig);

			if (StringUtils.isBlankOrNull(tuplesEstipulantes))
				return to;
		
			connection = transaction.getConnection();

			StringBuilder query = new StringBuilder()
			.append("SELECT NOME_DO_LAYOUT, COR_DO_FUNDO, COR_DAS_LETRAS, FONTE_DAS_LETRAS \n")
			.append("  FROM QC_LAYOUT lay \n")
			.append("  INNER JOIN QC_LAYOUTESTIPULANTE le ON lay.IDLAYOUT = le.IDLAYOUT \n")
			.append("  INNER JOIN QC_ESTIPULANTE est ON est.IDESTIPULANTE = le.IDESTIPULANTE  \n")
			.append("  WHERE (est.codigo, est.subestipulante) IN (" + tuplesEstipulantes + ") \n");
					
			
			statement = connection.prepareStatement(query.toString());
			
			resultSet = statement.executeQuery();
			
			if (resultSet.next())
			{
				to = new LayoutTO();
				
				to.setNomeLayout(resultSet.getString("NOME_DO_LAYOUT"));
				to.setCorDeFundo(resultSet.getString("COR_DO_FUNDO"));
				to.setCorDaLetra(resultSet.getString("COR_DAS_LETRAS"));
				to.setFonteDaLetra(resultSet.getString("FONTE_DAS_LETRAS"));
			}
			
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
				JDBCUtils.close(resultSet, statement);
			}
			catch (SQLException e)
			{
				logger.error("Erro ao fechar recursos JDBC!", e);
				throw new UnexpectedException(e);
			}
		}
		
		return to;
	}
}