package br.com.qualicorp.redenarede.service.administracaoestipulante.manager;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Collection;

import br.com.qualicorp.redenarede.commons.utils.JDBCUtils;
import br.com.qualicorp.redenarede.commons.utils.StringUtils;
import br.com.qualicorp.redenarede.service.administracaoestipulante.to.EstipulanteTO;
import br.com.qualicorp.redenarede.service.useraccount.to.BeneficionarioTO;
import lumis.portal.PortalException;
import lumis.portal.UnexpectedException;
import lumis.portal.authentication.SessionConfig;
import lumis.portal.dao.jdbc.ITransactionJdbc;
import lumis.portal.group.GroupConfig;
import lumis.portal.group.IGroupManager;
import lumis.portal.manager.ManagerException;
import lumis.portal.manager.ManagerFactory;
import lumis.portal.principal.PrincipalConfig;
import lumis.portal.transaction.PortalTransactionFactory;
import lumis.portal.user.UserConfig;
import lumis.util.ITransaction;
import lumis.util.log.ILogger;
import lumis.util.log.LoggerFactory;

public class EstipulanteManager
{
	private static ILogger logger = LoggerFactory.getLogger(EstipulanteManager.class);
	
	private static EstipulanteManager manager;
	
	private EstipulanteManager()
	{
		
	}
	
	public static EstipulanteManager getInstance()
	{
		if (manager == null)
			manager = new EstipulanteManager();
		
		return manager;
	}
	
	public void associate(String userId, String codigoEstipulante, String codigoSubestipulante, SessionConfig sessionConfigAdmin, ITransaction transaction) throws ManagerException, PortalException
	{
		String gourpAlias = EstipulanteManager.getInstance().makeAliasGroup(codigoEstipulante, codigoSubestipulante);
		
		UserConfig userConfig = ManagerFactory.getUserManager().get(sessionConfigAdmin, userId, transaction);
		
		PrincipalConfig grupoEstipulante = ManagerFactory.getPrincipalManager().getByShortId(sessionConfigAdmin, gourpAlias, transaction);
		
		ManagerFactory.getGroupManager().addMember(sessionConfigAdmin, grupoEstipulante.getId(), userConfig.getId(), transaction);
	}
	
	public void updateAssociation(String userId, String codigoEstipulante, String codigoSubestipulante, ITransaction transaction) throws ManagerException, PortalException
	{
		SessionConfig sessionConfigAdmin = ManagerFactory.getAuthenticationManager().impersonate(UserConfig.USER_SYSTEM_ID);
		
		try
		{
			updateAssociation(userId, codigoEstipulante, codigoSubestipulante, sessionConfigAdmin, transaction);
		}
		finally
		{
			try
			{
				ManagerFactory.getAuthenticationManager().endImpersonation(sessionConfigAdmin);
			}
			catch (PortalException e)
			{
				logger.error("Error!", e);
			}
		}
	}
	
	public void updateAssociation(String userId, String codigoEstipulante, String codigoSubestipulante, SessionConfig sessionConfigAdmin, ITransaction transaction) throws ManagerException, PortalException
	{
		String gourpAliasNew = EstipulanteManager.getInstance().makeAliasGroup(codigoEstipulante, codigoSubestipulante);
		
		boolean alreadyAssociated = false;
		
		Collection<String> groupsId = ManagerFactory.getGroupManager().getMemberGroups(sessionConfigAdmin, userId, true, transaction);
		
		for (String groupId : groupsId)
		{
			String groupAlias = ManagerFactory.getGroupManager().get(sessionConfigAdmin, groupId, transaction).getAlias();
			
			if (EstipulanteManager.getInstance().isAliasGroupEstipulante(groupAlias))
			{
				if (!groupAlias.equals(gourpAliasNew))
				{
					ManagerFactory.getGroupManager().deleteMember(sessionConfigAdmin, groupId, userId, transaction);
				}
				else
				{
					alreadyAssociated = true;
				}
			}
		}
		
		if (!alreadyAssociated)
		{
			associate(userId, codigoEstipulante, codigoSubestipulante, sessionConfigAdmin, transaction);
		}
	}
	
	public String getNomeEstipulantePeloUsuario(String user_id, ITransactionJdbc transaction, SessionConfig sessionConfig) throws PortalException
	{
		String nomeEstipulante = "";
		
		Connection connection = null;
		PreparedStatement statement = null;
		ResultSet resultSet = null;
		
		try
		{
			
			connection = transaction.getConnection();

			String tuplesEstipulantes = EstipulanteManager.getInstance().getTuplesCodEstipulanteAndSub(user_id, transaction, sessionConfig);
			
			if (StringUtils.isBlankOrNull(tuplesEstipulantes))
				return null;
			
			StringBuilder sbQuery = new StringBuilder()
			.append(" SELECT NOME FROM QC_ESTIPULANTE est ")
			.append("  WHERE (est.codigo, est.subestipulante) IN (" + tuplesEstipulantes + ") \n");
			
			statement = connection.prepareStatement(sbQuery.toString());
			
			resultSet = statement.executeQuery();
			
			if (resultSet.next())
			{
				nomeEstipulante = resultSet.getString("nome");
			}
		}
		catch (Exception e)
		{
			logger.error("Erro", e);
			throw new PortalException(e.getMessage(), e);
		}
		finally
		{
			try
			{
				JDBCUtils.close(resultSet, statement);
			}
			catch (SQLException e)
			{
				logger.error("Erro ao fechar resources JDBC", e);
				throw new UnexpectedException(e);
			}
		}
		
		return nomeEstipulante;
	}
	
	public EstipulanteTO getEstipulantePeloId(String idestipulante, ITransactionJdbc transaction) throws PortalException
	{
		Connection connection = null;
		PreparedStatement statement = null;
		ResultSet resultSet = null;

		EstipulanteTO to = null;
		
		try
		{
			connection = transaction.getConnection();

			statement = connection.prepareStatement(" select * from QC_ESTIPULANTE where idestipulante = ? ");
			
			statement.setString(1, idestipulante);
			
			resultSet = statement.executeQuery();
			
			if (resultSet.next())
			{
				to = new EstipulanteTO();
				
				to.setCodigo(resultSet.getString("codigo"));
				to.setIdestipulante(resultSet.getString("idestipulante"));
				to.setNome(resultSet.getString("nome"));
				to.setSubestipulante(resultSet.getString("subestipulante"));
			}
		}
		catch (Exception e)
		{
			logger.error("Erro", e);
			throw new PortalException(e.getMessage(), e);
		}
		finally
		{
			try
			{
				JDBCUtils.close(resultSet, statement);
			}
			catch (SQLException e)
			{
				logger.error("Erro ao fechar resources JDBC", e);
				throw new UnexpectedException(e);
			}
		}
		
		return to;
	}
	
	public void excluiLayoutPorEstipulante(String idEstipulante) throws PortalException
	{
		ITransactionJdbc transaction = null;
		Connection connection = null;
		PreparedStatement statement = null;
		
		try
		{
			transaction = (ITransactionJdbc) PortalTransactionFactory.getCurrentTransaction();
			
			StringBuilder sbQuery = new StringBuilder();
			sbQuery.append("DELETE FROM QC_LAYOUTESTIPULANTE ");
			sbQuery.append("WHERE idestipulante = ?");

			connection = transaction.getConnection();
			statement = connection.prepareStatement(sbQuery.toString());
			
			statement.setString(1, idEstipulante);
			
			statement.executeUpdate();
		}
		catch (SQLException e)
		{
			logger.error("Erro", e);
			throw new UnexpectedException(e);
		}
		finally
		{
			try
			{
				JDBCUtils.close(null, statement);
			}
			catch (SQLException e)
			{
				logger.error("Erro ao fechar resources JDBC", e);
				throw new UnexpectedException(e);
			}
		}
	}
	
	public String makeAliasGroup(String estipulanteCode, String subEstipulanteCode)
	{
		return "estipulante_" + estipulanteCode + "_subestipulante_" + subEstipulanteCode;
	}
	
	public void createGroup(String nomeGrupo, String estipulanteCode, String subEstipulanteCode, SessionConfig sessionConfig, ITransaction transaction) throws PortalException
	{
		GroupConfig groupConfig = new GroupConfig();
		groupConfig.setName(nomeGrupo);
		groupConfig.setAlias(makeAliasGroup(estipulanteCode, subEstipulanteCode));
		
		try
		{
			ManagerFactory.getGroupManager().add(sessionConfig, groupConfig, transaction);
		}
		catch (Exception e)
		{
			if (e.getMessage().contains("STR_PRINCIPAL_ID_ALREADY_EXISTS_GROUP"))
				throw new PortalException("A combinação do Código do estipulante com subestipulante já foi cadastrada.");
		}
	}
	
	public boolean isAliasGroupEstipulante(String alias)
	{
		return alias.startsWith("estipulante_");
	}
	
	public String getTuplesCodEstipulanteAndSub(String userId, ITransaction transaction, SessionConfig sessionConfig) throws ManagerException, PortalException
	{
		IGroupManager groupManager = ManagerFactory.getGroupManager();
		
		Collection<String> groups = groupManager.getMemberGroups(sessionConfig, userId, true, transaction);
		
		StringBuilder tuplesEstipulantes = new StringBuilder();
		
		for(String groupAlias : groups)
		{
			String alias = groupManager.get(SessionConfig.getCurrentSessionConfig(), groupAlias, transaction).getAlias();
			
			if (!isAliasGroupEstipulante(alias))
				continue;
			
			String[] parts = alias.substring("estipulante_".length()).split("_");
			
			tuplesEstipulantes.append("(").append(parts[0]).append(",").append(parts[parts.length - 1]).append("),");
		}
		
		if (tuplesEstipulantes.length() > 0)
			tuplesEstipulantes.setLength(tuplesEstipulantes.length() - 1);
		
		return tuplesEstipulantes.toString();
	}
	
	public void fillCodEstipulanteAndSub(BeneficionarioTO to, ITransaction transaction, SessionConfig sessionConfig) throws ManagerException, PortalException
	{
		IGroupManager groupManager = ManagerFactory.getGroupManager();
		
		Collection<String> groups = groupManager.getMemberGroups(sessionConfig, to.getUserId(), true, transaction);
		
		for(String groupAlias : groups)
		{
			String alias = groupManager.get(SessionConfig.getCurrentSessionConfig(), groupAlias, transaction).getAlias();
			
			if (!isAliasGroupEstipulante(alias))
				continue;
			
			String[] parts = alias.substring("estipulante_".length()).split("_");
			
			to.setCodigoEstipulante(parts[0]);
			to.setCodigoSubEstipulante(parts[parts.length - 1]);
		}
	}
	
	public boolean existsSubEstipulante(String codeEstipulante, String codeSubestipulante)
	{
		return ( (BigDecimal) ManagerFactory.getEntityManager()
		.createNativeQuery("SELECT COUNT(*) FROM QC_ESTIPULANTE WHERE codigo = :codeEstipulante AND subestipulante = :codeSubestipulante")
		.setParameter("codeEstipulante", codeEstipulante)
		.setParameter("codeSubestipulante", codeSubestipulante)
		.getSingleResult()).intValue() > 0;
	}
}