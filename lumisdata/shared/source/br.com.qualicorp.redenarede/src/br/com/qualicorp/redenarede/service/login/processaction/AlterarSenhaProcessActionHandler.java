package br.com.qualicorp.redenarede.service.login.processaction;

import br.com.qualicorp.redenarede.webservice.manager.BeneficiarioWebServiceManager;
import br.com.qualicorp.redenarede.webservice.manager.PrestadorWebServiceManager;
import br.com.qualicorp.redenarede.webservice.stub.beneficiario.TrocarSenhaResponse;
import br.com.qualicorp.redenarede.webservice.stub.pretador.RetornoUsuarioPrestador;
import lumis.doui.processaction.ProcessActionHandler;
import lumis.doui.table.TableSource;
import lumis.portal.PortalException;
import lumis.portal.manager.ManagerFactory;
import lumis.util.XmlUtil;
import lumis.util.log.ILogger;
import lumis.util.log.LoggerFactory;

public class AlterarSenhaProcessActionHandler extends ProcessActionHandler<TableSource>
{
	private static ILogger logger = LoggerFactory.getLogger(AlterarSenhaProcessActionHandler.class);
	
	public static final String ACTION_BENEFICIARIO = "alterarSenhaBeneficiario";
	public static final String ACTION_PRESTADOR = "alterarSenhaPrestador";

	@Override
	public void processAction() throws PortalException
	{
		String actionType = XmlUtil.readAttributeString("actionType", processActionNode);

		if (actionType.equals(ACTION_BENEFICIARIO))
			processBeneficiarioAction();
		else if (actionType.equals(ACTION_PRESTADOR))
			processPrestadorAction();

		addDefaultResponse();
	}

	private void processBeneficiarioAction() throws PortalException
		{
				String login = douiContext.getRequest().getParameter("login"); 
				String password = douiContext.getRequest().getParameter("password");
				
				String newPassword = douiContext.getRequest().getParameter("newPassword");
				String confirmNewPassword = douiContext.getRequest().getParameter("confirmNewPassword");
				try
				{
					if(newPassword.equals(confirmNewPassword))
					{
						if(login==null)
							throw new PortalException("Número da Carteira inválido!", getResource());
							
						login = login.replaceAll("[^0-9]", "");
						BeneficiarioWebServiceManager beneficiario = new BeneficiarioWebServiceManager();
						TrocarSenhaResponse alterarSenha = beneficiario.trocarSenha(login, password, newPassword);
						
						if(!alterarSenha.isResultado())
						{
							logger.info("Alteração de senha inválida para usuário " + login + " mensagem service: " + alterarSenha.getMensagem());
							
							throw new PortalException(alterarSenha.getMensagem());
						}
						//TODO - ATUALIZAR A SENHA NO BANCO
						ManagerFactory.getUserManager().setPassword(sessionConfig, sessionConfig.getUserId(), newPassword, transaction);
					}else
					{
						throw new PortalException("PASSWORD_DOES_NOT_EQUALS", getResource());
					}
					
				}
				catch(Exception e)
				{
					throw new PortalException(e.getMessage(), e);
				}
				
		}

	private void processPrestadorAction() throws PortalException
	{
		
		String cpfCnpj = douiContext.getRequest().getParameter("provider-signup-cnpj")==null||
				"".equals(douiContext.getRequest().getParameter("provider-signup-cnpj")) ? 
						douiContext.getRequest().getParameter("provider-signup-cpf"):
							douiContext.getRequest().getParameter("provider-signup-cnpj");
		
		String login = douiContext.getRequest().getParameter("email");
		String password = douiContext.getRequest().getParameter("password");

		String newPassword = douiContext.getRequest().getParameter("newPassword");
		String confirmNewPassword = douiContext.getRequest().getParameter("confirmNewPassword");

		try
		{
			if (newPassword.equals(confirmNewPassword))
			{
				password = douiContext.getRequest().getParameter("password");

				PrestadorWebServiceManager prestador = new PrestadorWebServiceManager();

				RetornoUsuarioPrestador alterarSenha = prestador.alterarSenha(login, cpfCnpj, password, newPassword, confirmNewPassword);
				if (!alterarSenha.isSucesso())
				{
					throw new PortalException(alterarSenha.getMensagem());
				}

				ManagerFactory.getUserManager().setPassword(sessionConfig, sessionConfig.getUserId(), confirmNewPassword, transaction);
			}
			else
			{
				throw new PortalException("PASSWORD_DOES_NOT_EQUALS", getResource());
			}

		}
		catch (Exception e)
		{
			throw new PortalException(e.getMessage(), e);
		}
	}
}