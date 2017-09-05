package br.com.qualicorp.redenarede.service.oauth.oauth;

import java.io.File;
import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.core.Context;

import org.w3c.dom.Document;
import org.w3c.dom.Node;

import br.com.qualicorp.redenarede.commons.utils.StringUtils;
import br.com.qualicorp.redenarede.service.administracaoestipulante.manager.EstipulanteManager;
import br.com.qualicorp.redenarede.service.useraccount.manager.BeneficiarioManager;
import br.com.qualicorp.redenarede.service.useraccount.to.BeneficionarioTO;
import br.com.qualicorp.redenarede.webservice.manager.BeneficiarioWebServiceManager;
import br.com.qualicorp.redenarede.webservice.stub.beneficiario.Beneficiario;
import br.com.qualicorp.redenarede.webservice.stub.beneficiario.ConsultarTokenResponse;
import lumis.portal.PortalContext;
import lumis.portal.PortalException;
import lumis.portal.authentication.SessionConfig;
import lumis.portal.manager.ManagerFactory;
import lumis.portal.transaction.ITransaction;
import lumis.portal.transaction.PortalTransactionFactory;
import lumis.util.CookieUtil;
import lumis.util.XmlUtil;
import lumis.util.log.ILogger;
import lumis.util.log.LoggerFactory;

@Path("/gamaoauth")
public class GamaGspOauthAuthentication
{
	final  String REDIRECT_URL;
	private static ILogger logger = LoggerFactory.getServiceLogger("gsp.WebService");
	final String  GSP_BENEFICIARIO = "gsp.beneficiario";
	
	public GamaGspOauthAuthentication() throws PortalException
	{
		try
		{
			Document dom = XmlUtil.getDocument(new File(PortalContext.getConfigPath("/oauth_gama.xml")));
			Node config = XmlUtil.selectSingleNode("/autenticacao", dom);
			this.REDIRECT_URL = XmlUtil.readAttributeOrNodeString(config, "REDIRECT");
		}
		catch (Exception e)
		{
			throw new PortalException(e.getMessage(), e);
		}
	}
	
	@GET
	@Path("/login")
	public void loginGspGama(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception
	{
		String token = request.getParameter("token");

		BeneficiarioWebServiceManager beneficiarioWS = new BeneficiarioWebServiceManager();

		ConsultarTokenResponse consultarTokenResponse = beneficiarioWS.consultarToken(token);

		if (!consultarTokenResponse.isResultado())
		{
			logger.error("Erro no login automático GAMA! Token inválido: " + token);
			
			response.sendRedirect("/login/?oautherror=1");
			return;
		}

		String userId = "";
		Beneficiario beneficiario = consultarTokenResponse.getBeneficiario();
		
		String plano = String.valueOf(beneficiario.getPlano().getCodigo());
		String codigo = String.valueOf(beneficiario.getEmpresa().getCodigo());

		if (plano == null || "".equals(plano) || codigo == null || "".equals(codigo))
		{
			logger.error("Erro no login automático GAMA! Para beneficiário " + beneficiario.getCodigoCarteirinha() + ",  plano = " + plano + ", codigo = " + codigo);
			
			response.sendRedirect("/login/?oautherror=2");
			return;
		}
		
		String login = String.valueOf(beneficiario.getCodigoCarteirinha());

		ITransaction transaction = PortalTransactionFactory.createTransaction();

		try
		{
			transaction.begin();
			
			BeneficionarioTO to = new BeneficiarioWebServiceManager().createBeneficionarioTO(beneficiario);
			
			if (!EstipulanteManager.getInstance().existsSubEstipulante(to.getCodigoEstipulante(), to.getCodigoSubEstipulante()))
			{
				response.sendRedirect("/login/?oautherror=estipulanteInvalido");
				return;
			}
			
			userId = BeneficiarioManager.getInstance().getUserId(login, transaction);

			if (!StringUtils.isBlankOrNull(userId)) //Se usuário já existe
			{
				EstipulanteManager.getInstance().updateAssociation(userId, to.getCodigoEstipulante(), to.getCodigoSubEstipulante(), transaction);
				
				BeneficiarioManager.getInstance().update(to.getNumeroCarteira(), to, transaction);
				
				transaction.commit(); //devemos commitar antes de entrar no logaBeneficiário
				
				if (!SessionConfig.getCurrentSessionConfig().getUserId().equals(userId))
				{
					logaBeneficiario(userId, beneficiario, request, response);
				}
				
				response.sendRedirect("/beneficiario");
				return;
			}
			
			to.setPassword("quali_01");
			
			logger.info("Iniciando processo de cadastro automático pela integraçãoUsuário para o usuário " + login );
			
			BeneficiarioManager.getInstance().cadastrar(to, transaction);
			
			transaction.commit();  //devemos commitar antes de entrar no logaBeneficiário
			
			// O login precisa vir depois do commit da inserção! E precisa de uma transação própria! Não se pode dar commit duas vezes!
			logaBeneficiario(to.getUserId(), beneficiario, request, response);
			
			response.sendRedirect("/beneficiario");
		}
		catch (Exception e)
		{
			logger.error("Erro no login automático GAMA com o beneficiário " + beneficiario.getCodigoCarteirinha() + "!", e);
			
			response.sendRedirect("/login/?oautherror=1");
		}
		finally
		{
			transaction.close();
		}
	}
	
	@GET
	@Path("/gama")
    public String redirectGama(@Context HttpServletRequest request, @Context HttpServletResponse response)
        throws PortalException, Exception
    {
		logger.info("Token: "+request.getSession().getAttribute("tokenGama"));
		return createCodeScript((String) request.getSession().getAttribute("tokenGama"));
    }
	
	private String createCodeScript(String token) {
		StringBuilder script = new StringBuilder();
		script.append("<html>");
		script.append("	<head>");
		script.append("	</head>");
		script.append("	<body>");
		script.append("		<form id='formPost' action='"+REDIRECT_URL+"' method='POST' >");             
		script.append("			<input type='hidden' name='token' value='"+token+"'/>");
		script.append("		</form>");
		script.append("		<script>");
		script.append("			(function() { ");
		script.append("				document.getElementById('formPost').submit(); ");
		script.append("			})();");
		script.append("		</script>");
		script.append("	</body>");
		script.append("</html>");
		return script.toString();
	}
	
	private void logaBeneficiario(String userId, Beneficiario beneficiario, HttpServletRequest request, HttpServletResponse response) throws PortalException, IOException
	{
		ITransaction transaction = PortalTransactionFactory.createTransaction();

		try
		{
			transaction.begin();
			
			ManagerFactory.getAuthenticationManager().loginUser(userId, transaction);
	
			CookieUtil.addLumisUserCookies(request, response);
			
			BeneficiarioManager.getInstance().putSessionAtributesLogin(beneficiario, request.getSession());
			
			transaction.commit();
		}
		catch (Exception e)
		{
			logger.error("Erro no login automático GAMA com o beneficiário " + beneficiario.getCodigoCarteirinha() + "!", e);
			
			response.sendRedirect("/login/?oautherror=1");
		}
		finally
		{
			transaction.close();
		}
	}
}