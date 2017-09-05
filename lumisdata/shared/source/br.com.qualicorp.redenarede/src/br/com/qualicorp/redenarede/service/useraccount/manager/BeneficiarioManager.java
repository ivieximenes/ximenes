package br.com.qualicorp.redenarede.service.useraccount.manager;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.portlet.PortletSession;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.json.simple.JSONObject;

import br.com.qualicorp.redenarede.commons.utils.BeanUtils;
import br.com.qualicorp.redenarede.commons.utils.CPFUtils;
import br.com.qualicorp.redenarede.commons.utils.DateUtils;
import br.com.qualicorp.redenarede.commons.utils.JDBCUtils;
import br.com.qualicorp.redenarede.commons.utils.StringUtils;
import br.com.qualicorp.redenarede.service.administracaoestipulante.manager.EstipulanteManager;
import br.com.qualicorp.redenarede.service.useraccount.to.BeneficionarioTO;
import br.com.qualicorp.redenarede.webservice.stub.beneficiario.Beneficiario;
import lumis.doui.DouiContext;
import lumis.portal.PortalException;
import lumis.portal.UnexpectedException;
import lumis.portal.authentication.SessionConfig;
import lumis.portal.dao.DaoException;
import lumis.portal.dao.jdbc.ITransactionJdbc;
import lumis.portal.manager.ManagerException;
import lumis.portal.manager.ManagerFactory;
import lumis.portal.principal.PrincipalConfig;
import lumis.portal.transaction.PortalTransactionFactory;
import lumis.portal.user.UserConfig;
import lumis.util.ITransaction;
import lumis.util.PortalUtil;
import lumis.util.log.ILogger;
import lumis.util.log.LoggerFactory;

public class BeneficiarioManager
{
	private static final String SESSION_GSP_BENEFICIARIOS_BY_CATEIRINHA = "gsp.beneficiarios.by.cateirinha";
	private static final String SESSION_GSP_COD_BENEFICIARIOS_GAMA_BY_CATEIRINHA = "gsp.cod.beneficiarios.gama.by.cateirinha";
	private static final String SESSION_GSP_BENEFICIARIOS_CADASTRADOS = "gsp.beneficiariosCadastrados";

	private static ILogger logger = LoggerFactory.getServiceLogger("gsp.WebService");
	
	final String GSP_BENEFICIARIO = "gsp.beneficiario";
	
	private static BeneficiarioManager manager;
	
	private BeneficiarioManager()
	{
		
	}
	
	public boolean isBeneficiario(String userId, ITransaction transaction) throws DaoException, PortalException
	{
		PrincipalConfig grupo = ManagerFactory.getPrincipalManager().getByShortId(SessionConfig.getCurrentSessionConfig(), GSP_BENEFICIARIO, transaction);
		
		return ManagerFactory.getGroupManager().isMember(SessionConfig.getCurrentSessionConfig(), userId, grupo.getId(), transaction);
	}
	
	public static BeneficiarioManager getInstance()
	{
		if (manager == null)
			manager = new BeneficiarioManager();
		
		return manager;
	}
	
	public void putSessionAtributesLogin(Beneficiario beneficiario, PortletSession session)
	{
		session.setAttribute("isBeneficiario", true, PortletSession.APPLICATION_SCOPE);
		session.setAttribute("plano", String.valueOf(beneficiario.getPlano().getCodigo()), PortletSession.APPLICATION_SCOPE);
		session.setAttribute("estipulante", String.valueOf(beneficiario.getEmpresa().getCodigo()), PortletSession.APPLICATION_SCOPE);
		session.setAttribute("tokenGama", String.valueOf(beneficiario.getToken()), PortletSession.APPLICATION_SCOPE);
	}
	
	public void putSessionAtributesLogin(Beneficiario beneficiario, HttpSession session)
	{
		session.setAttribute("isBeneficiario", true);
		session.setAttribute("plano", String.valueOf(beneficiario.getPlano().getCodigo()));
		session.setAttribute("estipulante", String.valueOf(beneficiario.getEmpresa().getCodigo()));
		session.setAttribute("tokenGama", String.valueOf(beneficiario.getToken()));
	}

	public void cadastrar(BeneficionarioTO to, ITransaction transaction) throws PortalException
	{
		to.setUserId(addUser(to, transaction));
		
		insert(to, transaction);
	}

	private void insert(BeneficionarioTO to, ITransaction transaction) throws UnexpectedException
	{
		ITransactionJdbc daoTransactionJdbc = (ITransactionJdbc) transaction;
		Connection connection = null;
		PreparedStatement statement = null;
		
		try
		{	
			StringBuilder sb = new StringBuilder()
			.append("insert into QC_BENEFICIARIO \n")
			.append("(id, user_id, cpf, rg, orgao_emissor, nome_mae, numero_carteira, data_nascimento, telefone, plano) \n")
			.append("values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
			
			connection = daoTransactionJdbc.getConnection();
			statement = connection.prepareStatement(sb.toString());
			
			int count = 0;
			
			statement.setString(++count, PortalUtil.generateNewGuid());
			statement.setString(++count, to.getUserId());
			statement.setString(++count, StringUtils.cutStringTrim( CPFUtils.formatCPF(to.getCpf()), 255));
			statement.setString(++count, StringUtils.cutStringTrim(to.getRg(), 255));
			statement.setString(++count, StringUtils.cutStringTrim(to.getOrgaoEmissor(), 255));
			statement.setString(++count, StringUtils.cutStringTrim(to.getNomeMae(), 255));
			statement.setString(++count, to.getNumeroCarteira());
			statement.setDate(++count, to.getDataNascimentoDate() != null ? new java.sql.Date( to.getDataNascimentoDate().getTime()) : null);
			statement.setString(++count, StringUtils.cutStringTrim(to.getTelefoneFormated(), 255));
			statement.setString(++count, StringUtils.cutStringTrim(to.getPlano(), 250));
			
			statement.execute();
		}
		catch (DaoException e)
		{
			throw new UnexpectedException(e);
		}
		catch (SQLException e)
		{
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
				logger.error("Erro ao fechar recursos JDBC", e);
			}
		}
	}

	/*
	 * Cuidado! Não estou mudando o número da carteira nem o userId! O número da carteira é imutável na gama! E o userid é imutável no lumis!
	 */
	private void update(BeneficionarioTO to, ITransaction transaction) throws ManagerException, PortalException
	{
		ITransactionJdbc daoTransactionJdbc = (ITransactionJdbc) transaction;
		Connection connection = null;
		PreparedStatement statement = null;
		
		try
		{	
			StringBuilder sb = new StringBuilder()
			.append("UPDATE QC_BENEFICIARIO \n")
			.append("   SET cpf = ?, \n")
			.append(" 		rg = ?, \n")
			.append(" 		orgao_emissor = ?, \n")
			.append(" 		nome_mae = ?, \n")
			.append(" 		data_nascimento = ?, \n")
			.append(" 		telefone = ?, \n")
			.append(" 		plano = ?, \n")
			.append(" 		data_alteracao = ? \n")
			.append(" WHERE id = ?");
			
			connection = daoTransactionJdbc.getConnection();
			statement = connection.prepareStatement(sb.toString());
			
			int count = 0;
			
			statement.setString(++count, StringUtils.cutStringTrim( CPFUtils.formatCPF(to.getCpf()), 255));
			statement.setString(++count, StringUtils.cutStringTrim(to.getRg(), 255));
			statement.setString(++count, StringUtils.cutStringTrim(to.getOrgaoEmissor(), 255));
			statement.setString(++count, StringUtils.cutStringTrim(to.getNomeMae(), 255));
			statement.setDate(++count, to.getDataNascimentoDate() != null ? new java.sql.Date( to.getDataNascimentoDate().getTime()) : null);
			statement.setString(++count, StringUtils.cutStringTrim(to.getTelefoneFormated(), 255));
			statement.setString(++count, StringUtils.cutStringTrim(to.getPlano(), 250));
			statement.setDate(++count, to.getDataAlteracao() != null ? new java.sql.Date( to.getDataAlteracao().getTime()) : null);
			statement.setString(++count, to.getId());
			
			statement.execute();
			
			updateUser(to, transaction);
		}
		catch (DaoException e)
		{
			throw new UnexpectedException(e);
		}
		catch (SQLException e)
		{
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
				logger.error("Erro ao fechar recursos JDBC", e);
			}
		}
	}
	
	public void update(String numeroCarteira, BeneficionarioTO toNew, ITransaction transaction) throws ManagerException, PortalException
	{
		BeneficionarioTO toOld = BeneficiarioManager.getInstance().getByNumeroCarteira(numeroCarteira, transaction);

		boolean hasChange = false;
		
		if (!StringUtils.isBlankOrNull(toNew.getNome()) && !toNew.getNome().equals(toOld.getNome()))
		{
			toOld.setNome(toNew.getNome());
			hasChange = true;
		}
		
		if (!StringUtils.isBlankOrNull(toNew.getNomeMae()) && !toNew.getNomeMae().equals(toOld.getNomeMae()))
		{
			toOld.setNomeMae(toNew.getNomeMae());
			hasChange = true;
		}
		
		if (!BeanUtils.equals(toNew.getCpfNoFormat(), toOld.getCpfNoFormat()))
		{
			toOld.setCpf(toNew.getCpf());
			hasChange = true;
		}
		
		if (!StringUtils.isBlankOrNull(toNew.getEmail()) && !toNew.getEmail().equals(toOld.getEmail()))
		{
			toOld.setEmail(toNew.getEmail());
			hasChange = true;
		}
		
		if (!BeanUtils.equals(toNew.getRg(), toOld.getRg()))
		{
			toOld.setRg(toNew.getRg());
			hasChange = true;
		}
		
		if (!BeanUtils.equals(toNew.getOrgaoEmissor(), toOld.getOrgaoEmissor()))
		{
			toOld.setOrgaoEmissor(toNew.getOrgaoEmissor());
			hasChange = true;
		}
		
		if (toNew.isShouldUpdateTelefone() && !BeanUtils.equals(toNew.getTelefoneOnlyNumbers(), toOld.getTelefoneOnlyNumbers()))
		{
			toOld.setTelefone(toNew.getTelefoneFormated());
			hasChange = true;
		}
		
		if (!StringUtils.isBlankOrNull(toNew.getPlano()) && !toNew.getPlano().equals(toOld.getPlano()))
		{
			toOld.setPlano(toNew.getPlano());
			hasChange = true;
		}
		
		if (toNew.getDataNascimentoDate() != null && !DateUtils.getDateNoTime(toNew.getDataNascimentoDate()).equals(DateUtils.getDateNoTime(toOld.getDataNascimentoDate())))
		{
			toOld.setDataNascimento(toNew.getDataNascimento());
			toOld.setDataNascimentoDate(toNew.getDataNascimentoDate());
			hasChange = true;
		}
		
		if (hasChange)
		{
			toOld.setDataAlteracao(new Date());
			BeneficiarioManager.getInstance().update(toOld, transaction);
		}
	}

	public BeneficionarioTO getByNumeroCarteira(String numeroCarteira, ITransaction transaction) throws ManagerException, PortalException
	{
		ITransactionJdbc daoTransactionJdbc = (ITransactionJdbc) transaction;
		PreparedStatement statement = null;
		ResultSet resultSet = null;
		
		try
		{
			StringBuilder sb = new StringBuilder()
			.append("SELECT * FROM QC_BENEFICIARIO WHERE numero_carteira = ?  \n");
			
			Connection connection = daoTransactionJdbc.getConnection();
			statement = connection.prepareStatement(sb.toString());
			
			statement.setString(1, numeroCarteira);
			
			resultSet = statement.executeQuery();
			
			if (resultSet.next())
			{
				BeneficionarioTO to = new BeneficionarioTO();

				to.setId(resultSet.getString("id"));
				to.setCpf(resultSet.getString("cpf"));
				to.setDataNascimentoDate(resultSet.getDate("data_nascimento"));
				to.setNomeMae(resultSet.getString("nome_mae"));
				to.setNumeroCarteira(resultSet.getString("numero_carteira"));
				to.setOrgaoEmissor(resultSet.getString("orgao_emissor"));
				to.setPlano(resultSet.getString("plano"));
				to.setRg(resultSet.getString("rg"));
				to.setTelefone(resultSet.getString("telefone"));
				to.setUserId(resultSet.getString("user_id"));
				
				UserConfig user = ManagerFactory.getUserManager().get(SessionConfig.getCurrentSessionConfig(), resultSet.getString("user_id"), daoTransactionJdbc);
				
				to.setNome(user.getFirstName());
				to.setEmail(user.getEmail());
				
				EstipulanteManager.getInstance().fillCodEstipulanteAndSub(to, daoTransactionJdbc, SessionConfig.getCurrentSessionConfig());
				
				return to;
			}
		}
		catch (DaoException e)
		{
			throw new UnexpectedException(e);
		}
		catch (SQLException e)
		{
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
				logger.error("Erro ao fechar recursos JDBC", e);
			}
		}
		
		return null;
	}

	public List<BeneficionarioTO> getBeneficiariosByCPF(String cpf, ITransaction transaction) throws ManagerException, PortalException
	{
		ITransactionJdbc daoTransactionJdbc = (ITransactionJdbc) transaction;
		PreparedStatement statement = null;
		ResultSet resultSet = null;
		
		List<BeneficionarioTO> tos = new ArrayList<BeneficionarioTO>();
		
		try
		{
			StringBuilder sb = new StringBuilder()
			.append("SELECT * FROM QC_BENEFICIARIO WHERE cpf = ?  \n");
			
			Connection connection = daoTransactionJdbc.getConnection();
			statement = connection.prepareStatement(sb.toString());
			
			statement.setString(1, cpf);
			
			resultSet = statement.executeQuery();
			
			if (resultSet.next())
			{
				BeneficionarioTO to = new BeneficionarioTO();

				to.setId(resultSet.getString("id"));
				to.setCpf(resultSet.getString("cpf"));
				to.setDataNascimentoDate(resultSet.getDate("data_nascimento"));
				to.setNomeMae(resultSet.getString("nome_mae"));
				to.setNumeroCarteira(resultSet.getString("numero_carteira"));
				to.setOrgaoEmissor(resultSet.getString("orgao_emissor"));
				to.setPlano(resultSet.getString("plano"));
				to.setRg(resultSet.getString("rg"));
				to.setTelefone(resultSet.getString("telefone"));
				to.setUserId(resultSet.getString("user_id"));
				
				UserConfig user = ManagerFactory.getUserManager().get(SessionConfig.getCurrentSessionConfig(), resultSet.getString("user_id"), daoTransactionJdbc);
				
				to.setNome(user.getFirstName());
				to.setEmail(user.getEmail());
				
				EstipulanteManager.getInstance().fillCodEstipulanteAndSub(to, daoTransactionJdbc, SessionConfig.getCurrentSessionConfig());
				
				tos.add(to);
			}
		}
		catch (DaoException e)
		{
			throw new UnexpectedException(e);
		}
		catch (SQLException e)
		{
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
				logger.error("Erro ao fechar recursos JDBC", e);
			}
		}
		
		return tos;
	}
	
	public List<BeneficionarioTO> getListBeneficiariosByCPF(String cpf, ITransaction transaction) throws ManagerException, PortalException
	{
		ITransactionJdbc daoTransactionJdbc = (ITransactionJdbc) transaction;
		PreparedStatement statement = null;
		ResultSet resultSet = null;
		
		List<BeneficionarioTO> tos = new ArrayList<BeneficionarioTO>();
		
		try
		{
			StringBuilder sb = new StringBuilder()
			.append("SELECT * FROM QC_BENEFICIARIO WHERE cpf = ?  \n");
			
			Connection connection = daoTransactionJdbc.getConnection();
			statement = connection.prepareStatement(sb.toString());
			
			statement.setString(1, cpf);
			
			resultSet = statement.executeQuery();
			
			while (resultSet.next())
			{
				BeneficionarioTO to = new BeneficionarioTO();

				to.setId(resultSet.getString("id"));
				to.setCpf(resultSet.getString("cpf"));
				to.setDataNascimentoDate(resultSet.getDate("data_nascimento"));
				to.setNomeMae(resultSet.getString("nome_mae"));
				to.setNumeroCarteira(resultSet.getString("numero_carteira"));
				to.setOrgaoEmissor(resultSet.getString("orgao_emissor"));
				to.setPlano(resultSet.getString("plano"));
				to.setRg(resultSet.getString("rg"));
				to.setTelefone(resultSet.getString("telefone"));
				to.setUserId(resultSet.getString("user_id"));
				
				UserConfig user = ManagerFactory.getUserManager().get(SessionConfig.getCurrentSessionConfig(), resultSet.getString("user_id"), daoTransactionJdbc);
				
				to.setNome(user.getFirstName());
				to.setEmail(user.getEmail());
				
				EstipulanteManager.getInstance().fillCodEstipulanteAndSub(to, daoTransactionJdbc, SessionConfig.getCurrentSessionConfig());
				
				tos.add(to);
			}
		}
		catch (DaoException e)
		{
			throw new UnexpectedException(e);
		}
		catch (SQLException e)
		{
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
				logger.error("Erro ao fechar recursos JDBC", e);
			}
		}
		
		return tos;
	}
	
	private String addUser(BeneficionarioTO to, ITransaction transaction) throws PortalException
	{
		System.out.println("criando usuario Lumis");
		
		String password = to.getPassword();
		
		UserConfig userConfig = new UserConfig();
		
		userConfig.setLogin(to.getNumeroCarteira());

		if (to.getNome() == null)
			userConfig.setFirstName(to.getNumeroCarteira());
		else
			userConfig.setFirstName(StringUtils.cutStringTrim(to.getNome(), 100));
		
		userConfig.setEmail(to.getEmail());
		
		// O controle de senha é feito pelo WS, a senha do portal é meramente
		// ilustrativa
		// Solicitado pela Luciana que seja gravado a senha no banco do lumis para que seja usada no servico "getToken" do WS da gama. 
		// Demanda - Inclusão de um novo link "Meu Prontuario".
		userConfig.setPassword(password);

		SessionConfig systemUser = ManagerFactory.getAuthenticationManager().impersonate(UserConfig.USER_SYSTEM_ID);
		String userId = null;
		
		try
		{
			userId = ManagerFactory.getUserManager().add(systemUser, userConfig, transaction);
			
			System.out.println("usuario criado no Lumis");
			PrincipalConfig grupo = ManagerFactory.getPrincipalManager().getByShortId(systemUser, GSP_BENEFICIARIO, transaction);
			PrincipalConfig grupoEstipulante = ManagerFactory.getPrincipalManager().getByShortId(systemUser, to.getGroupEstipulanteAlias(), transaction);

			if (grupoEstipulante == null)
				throw new PortalException("No momento não podemos realizar o seu cadastro. Entre em contato com a central de atendimento 0800 779 9005 ou 11 3004-4633");

			System.out.println("grupo de beneficiario recuperado");
			ManagerFactory.getGroupManager().addMember(systemUser, grupo.getId(), userConfig.getId(), transaction);
			System.out.println("usuario adicionado no grupo de beneficiarios");

			System.out.println("grupo de estipulante recuperado");
			ManagerFactory.getGroupManager().addMember(systemUser, grupoEstipulante.getId(), userConfig.getId(), transaction);
			System.out.println("usuario adicionado no grupo de estipulante");
		}
		catch (Exception e)
		{
			System.out.println("Ocorreu um erro ao criar usuario Lumis " + e.getMessage());
			throw new PortalException(e.getMessage(), e);
		}
		finally
		{
			ManagerFactory.getAuthenticationManager().endImpersonation(systemUser);
		}
		
		return userId;
	}
	
	private void updateUser(BeneficionarioTO to, ITransaction transaction) throws PortalException
	{
		SessionConfig sessionConfigAdmin = ManagerFactory.getAuthenticationManager().impersonate(UserConfig.USER_SYSTEM_ID);
		
		try
		{
			UserConfig userConfig = ManagerFactory.getUserManager().get(sessionConfigAdmin, to.getUserId(), transaction);
			
			userConfig.setEmail(to.getEmail());
			userConfig.setFirstName(to.getNome());
			
			ManagerFactory.getUserManager().update(sessionConfigAdmin, userConfig, transaction);
			
			ManagerFactory.getEntityManager().flush();
		}
		finally
		{
			ManagerFactory.getAuthenticationManager().endImpersonation(sessionConfigAdmin);
		}
	}
	
	public String getUserId(String login, ITransaction transaction) throws PortalException
	{
		try
		{
			return ManagerFactory.getUserManager().getUserIdByLogin(SessionConfig.getCurrentSessionConfig(), login, transaction);
		}
		catch (PortalException e)
		{
			if (e.getMessage() != null && e.getMessage().split(";")[0].equals("STR_USER_LOGIN_NOT_FOUND"))
			{
				logger.info("O usuário " + login + " não se encontra no sistema, mas, será cadastrado!" );
			}
			else
			{
				throw e;
			}
		}
		
		return null;
	}

	@SuppressWarnings({ "unchecked" })
	public JSONObject getDadosbeneficiarioJSON(String userId) throws PortalException
	{
		JSONObject beneficiario = new JSONObject();

		ITransactionJdbc transaction = null;
		Connection connection = null;
		PreparedStatement statement = null;
		ResultSet resultSet = null;
		
		try
		{
			transaction = (ITransactionJdbc) PortalTransactionFactory.createTransaction();
			
			transaction.begin();
			
			connection = transaction.getConnection();

			statement = connection
					.prepareStatement(" select * from QC_BENEFICIARIO where user_id = ? ");
			
			statement.setString(1, userId);
			resultSet = statement.executeQuery();
			
			if (resultSet.next())
			{
				beneficiario.put("nome_mae", resultSet.getString("nome_mae"));
				beneficiario.put("telefone", resultSet.getString("telefone"));
				beneficiario.put("data_nascimento", DateUtils.formatGamaNoTime(resultSet.getDate("data_nascimento")));
				beneficiario.put("rg", resultSet.getString("rg"));
				beneficiario.put("orgao_emissor", resultSet.getString("orgao_emissor"));
				beneficiario.put("numero_carteira", resultSet.getString("numero_carteira"));
				beneficiario.put("cpf", resultSet.getString("cpf"));
				beneficiario.put("data_alteracao", DateUtils.formatGama(resultSet.getDate("data_alteracao")));
			}
		}
		catch (Exception e)
		{
			logger.error("Error", e);
			throw new PortalException(e.getMessage(), e);
		}
		finally
		{
			try
			{
				JDBCUtils.closeAndDispose(resultSet, statement, transaction);
			}
			catch (SQLException e)
			{
				logger.error("Error ao fechar os recursos JDBC!", e);
				throw new UnexpectedException(e);
			}
		}
		
		return beneficiario;
	}
	
	public String getLoginBeneficiarioByCpf(String cpf, ITransaction transaction) throws UnexpectedException 
	{
		try
		{
			ITransactionJdbc daoTransactionJdbc = (ITransactionJdbc) transaction;
			Connection connection = daoTransactionJdbc.getConnection();
			PreparedStatement statement = connection.prepareStatement(" select numero_carteira from QC_BENEFICIARIO where cpf = ? ");
			try
			{
				statement.setString(1, cpf);
				ResultSet resultSet = statement.executeQuery();
				try
				{
					if (resultSet.next())
					{
						return resultSet.getString("numero_carteira");
						
					}
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
			
			return null;
		}
		catch (Exception e)
		{
			throw new UnexpectedException(e);
		}
	}
	
	public boolean existsCodigoCarteiraInSystem(String numeroCarteira)
	{
		return ( (BigDecimal) ManagerFactory.getEntityManager().createNativeQuery("SELECT COUNT(*) FROM QC_BENEFICIARIO WHERE numero_carteira = :numeroCarteira")
		.setParameter("numeroCarteira", numeroCarteira)
		.getSingleResult()).intValue() > 0;
	}
	
	public String validaCpfPeloNumeroDaCarteira(String codigo_carteirinha, String cpf, ITransaction transaction) throws UnexpectedException 
	{
		try
		{
			ITransactionJdbc daoTransactionJdbc = (ITransactionJdbc) transaction;
			Connection connection = daoTransactionJdbc.getConnection();
			PreparedStatement statement = connection.prepareStatement(" select numero_carteira from QC_BENEFICIARIO where cpf = ? AND numero_carteira = ?");
			try
			{
				statement.setString(1, cpf);
				statement.setString(2, codigo_carteirinha);
				ResultSet resultSet = statement.executeQuery();
				try
				{
					if (resultSet.next())
					{
						return resultSet.getString("numero_carteira");
						
					}
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
			
			return null;
		}
		catch (Exception e)
		{
			throw new UnexpectedException(e);
		}
	}
	
	public String validaNumeroDaCarteiraExistente(String numero_carteira, ITransaction transaction) throws UnexpectedException 
	{
		try
		{
			ITransactionJdbc daoTransactionJdbc = (ITransactionJdbc) transaction;
			Connection connection = daoTransactionJdbc.getConnection();
			PreparedStatement statement = connection.prepareStatement(" select numero_carteira from QC_BENEFICIARIO where numero_carteira = ? ");
			try
			{
				statement.setString(1, numero_carteira);
				ResultSet resultSet = statement.executeQuery();
				try
				{
					if (resultSet.next())
					{
						return resultSet.getString("numero_carteira");
						
					}
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
			
			return null;
		}
		catch (Exception e)
		{
			throw new UnexpectedException(e);
		}
	}
	
	public boolean beneficiarioExistente(String cpf_cnpj, ITransaction transaction) throws UnexpectedException 
	{
		try
		{
			boolean existeUsuario = false;
			
			ITransactionJdbc daoTransactionJdbc = (ITransactionJdbc) transaction;
			Connection connection = daoTransactionJdbc.getConnection();

			PreparedStatement statement = connection.prepareStatement(" select * from QC_BENEFICIARIO where cpf = ? ");
			try
			{
				statement.setString(1, cpf_cnpj);
				ResultSet resultSet = statement.executeQuery();
				try
				{
					if (resultSet.next())
					{
						existeUsuario = true;
						
					}
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
			
			return existeUsuario;
		}
		catch (Exception e)
		{
			throw new UnexpectedException(e);
		}
	}
	
	public void informSessionBeneficiariosCadastrados(BeneficionarioTO to, DouiContext douiContext)
	{
		@SuppressWarnings("unchecked")
		Set<String> beneficiariosCadastrados = (Set<String>) douiContext.getRequest().getPortletSession().getAttribute(SESSION_GSP_BENEFICIARIOS_CADASTRADOS, PortletSession.APPLICATION_SCOPE);
		
		if (beneficiariosCadastrados == null)
		{
			beneficiariosCadastrados = new HashSet<String>();
			
			douiContext.getRequest().getPortletSession().setAttribute(SESSION_GSP_BENEFICIARIOS_CADASTRADOS, beneficiariosCadastrados, PortletSession.APPLICATION_SCOPE);
		}
		
		beneficiariosCadastrados.add(to.getNumeroCarteira());
	}
	
	public boolean isBeneficiarioAddedInSession(BeneficionarioTO to, DouiContext douiContext)
	{
		@SuppressWarnings("unchecked")
		Set<String> beneficiariosCadastrados = (Set<String>) douiContext.getRequest().getPortletSession().getAttribute(SESSION_GSP_BENEFICIARIOS_CADASTRADOS);
		
		if (beneficiariosCadastrados == null)
			return false;
		
		return beneficiariosCadastrados.contains(to.getNumeroCarteira());
	}
	
	public boolean isBeneficiarioAddedInSession(BeneficionarioTO to, HttpServletRequest request)
	{
		@SuppressWarnings("unchecked")
		Set<String> beneficiariosCadastrados = (Set<String>) request.getSession().getAttribute(SESSION_GSP_BENEFICIARIOS_CADASTRADOS);
		
		if (beneficiariosCadastrados == null)
			return false;
		
		return beneficiariosCadastrados.contains(to.getNumeroCarteira());
	}
	
	public void saveInSessionCodBeneficiariosGama(String codigoCarteirinha, String codigoBeneficiarioGama, DouiContext douiContext)
	{
		@SuppressWarnings("unchecked")
		Map<String, String> beneficiariosCadastrados = (Map<String, String>) douiContext.getRequest().getPortletSession().getAttribute(SESSION_GSP_COD_BENEFICIARIOS_GAMA_BY_CATEIRINHA, PortletSession.APPLICATION_SCOPE);
		
		if (beneficiariosCadastrados == null)
		{
			beneficiariosCadastrados = new HashMap<String, String>();
			
			douiContext.getRequest().getPortletSession().setAttribute(SESSION_GSP_COD_BENEFICIARIOS_GAMA_BY_CATEIRINHA, beneficiariosCadastrados, PortletSession.APPLICATION_SCOPE);
		}
		
		beneficiariosCadastrados.put(codigoCarteirinha, codigoBeneficiarioGama);
	}
	
	public String getInSessionCodBeneficiariosGama(String codigoCarteirinha, HttpServletRequest request)
	{
		@SuppressWarnings("unchecked")
		Map<String, String> beneficiariosCadastrados = (Map<String, String>) request.getSession().getAttribute(SESSION_GSP_COD_BENEFICIARIOS_GAMA_BY_CATEIRINHA);
		
		if (beneficiariosCadastrados == null)
		{
			return null;
		}
		
		return beneficiariosCadastrados.get(codigoCarteirinha);
	}
	
	public void saveInSessionBeneficiarios(BeneficionarioTO to, DouiContext douiContext)
	{
		@SuppressWarnings("unchecked")
		Map<String, BeneficionarioTO> beneficiariosCadastrados = (Map<String, BeneficionarioTO>) douiContext.getRequest().getPortletSession().getAttribute(SESSION_GSP_COD_BENEFICIARIOS_GAMA_BY_CATEIRINHA, PortletSession.APPLICATION_SCOPE);
		
		if (beneficiariosCadastrados == null)
		{
			beneficiariosCadastrados = new HashMap<String, BeneficionarioTO>();
			
			douiContext.getRequest().getPortletSession().setAttribute(SESSION_GSP_BENEFICIARIOS_BY_CATEIRINHA, beneficiariosCadastrados, PortletSession.APPLICATION_SCOPE);
		}
		
		beneficiariosCadastrados.put(to.getNumeroCarteira(), to);
	}
	
	public BeneficionarioTO getInSessionBeneficiarios(String codigoCarteirinha, HttpServletRequest request)
	{
		@SuppressWarnings("unchecked")
		Map<String, BeneficionarioTO> beneficiariosCadastrados = (Map<String, BeneficionarioTO>) request.getSession().getAttribute(SESSION_GSP_BENEFICIARIOS_BY_CATEIRINHA);
		
		if (beneficiariosCadastrados == null)
		{
			return null;
		}
		
		return beneficiariosCadastrados.get(codigoCarteirinha);
	}
}