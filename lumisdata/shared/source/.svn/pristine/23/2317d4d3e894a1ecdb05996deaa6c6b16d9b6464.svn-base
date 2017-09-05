package br.com.qualicorp.redenarede.service.questionariosaude.rs;

import java.io.File;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.json.simple.JSONObject;
import org.w3c.dom.Document;
import org.w3c.dom.Node;

import br.com.qualicorp.redenarede.service.useraccount.manager.BeneficiarioManager;
import lumis.portal.PortalContext;
import lumis.portal.PortalException;
import lumis.portal.authentication.SessionConfig;
import lumis.portal.cache.PortalCache;
import lumis.portal.manager.ManagerFactory;
import lumis.portal.principal.PrincipalConfig;
import lumis.portal.transaction.ITransaction;
import lumis.portal.transaction.PortalTransactionFactory;
import lumis.portal.user.UserConfig;
import lumis.util.XmlUtil;
import lumis.util.log.ILogger;
import lumis.util.log.LoggerFactory;

@Path("/questionariosaude")
public class QuestionarioSaudeAuthentication {

	final String REDIRECT;
	final static String POTALCACHE = "br.com.qualicorp.redenarede.src.br.com.qualicorp";
	private static ILogger logger = LoggerFactory.getServiceLogger("gsp.WebService");
	private static PortalCache<String> estipulanteConfigCache = new PortalCache<String>(POTALCACHE);
	
	public QuestionarioSaudeAuthentication() throws PortalException{
		
		try {
			Document dom = XmlUtil.getDocument(new File(PortalContext.getConfigPath("/oauth_qs.xml")));
			Node config = XmlUtil.selectSingleNode("/autenticacao", dom);
			this.REDIRECT = XmlUtil.readAttributeOrNodeString(config, "REDIRECT");
		} catch (Exception e) {
			throw new PortalException(e.getMessage(), e);
		}
		
	}

	@POST
	@Path("/beneficiario")
	@Produces(MediaType.APPLICATION_JSON + ";charset=UTF-8")
	@SuppressWarnings({ "unchecked", "deprecation" })
    public Response getDadosBeneficiario(@FormParam("lumUserSessionId") String lumUserSessionId, @Context HttpServletResponse response) throws PortalException, Exception
    {
		JSONObject json = new JSONObject();
		
        if (lumUserSessionId == null)
        {
        	json.put("error", "userSessionId não informado");
        	return Response.ok( json.toJSONString() ).build();
        }
        	
        ITransaction transaction =  PortalTransactionFactory.createTransaction();
        
        try
        {
            transaction.begin();
            
            SessionConfig sessionConfig = SessionConfig.getCurrentSessionConfig();
            sessionConfig.setUserSessionId(lumUserSessionId);
            boolean isValidSession = ManagerFactory.getAuthenticationManager().validateSessionId(sessionConfig, transaction);
            
            if(isValidSession)
            {
            	UserConfig userConfig = ManagerFactory.getUserManager().get(sessionConfig, sessionConfig.getUserId(), transaction);
            	PrincipalConfig grupo = ManagerFactory.getPrincipalManager().getByShortId(sessionConfig, "gsp.beneficiario", transaction);
            	boolean isBeneficiario = ManagerFactory.getGroupManager().isMember(sessionConfig, grupo.getId(), userConfig.getId(), transaction);
            	
            	if(!isBeneficiario)
            	{
            		json.put("error", "Usuário sem premissão.");
            		return Response.ok( json.toJSONString() ).build();
            	}
            	
            	JSONObject beneficiario = BeneficiarioManager.getInstance().getDadosbeneficiarioJSON(userConfig.getId());
            	
            	beneficiario.put("codestipulante", estipulanteConfigCache.get(lumUserSessionId));
                beneficiario.put("codoperadora", "407011");
                
            	beneficiario.put("nome", userConfig.getFirstName());
            	beneficiario.put("email", userConfig.getEmail());
            	
            	return Response.ok(beneficiario.toJSONString() ).build();
            }
            else
            {
                json.put("error", "lumUserSessionId inválido.");
            }
            
            transaction.commit();
            
            return Response.ok( json.toJSONString() ).build();
        } 
        catch (Exception e)
		{
			transaction.rollback();
			json.put("error", "Ocorreu um erro ao processar os dados do Beneficiário.");
			
			return Response.ok( json.toJSONString() ).build();
		}
		finally
		{
			transaction.close();
		}
    }
	
	@GET
	@Path("/beneficiario")
	public void redirectBeneficiarioBoaConsulta(@Context HttpServletResponse response, @Context HttpServletRequest request) throws PortalException, Exception
	{
		String lumUserSessionId = SessionConfig.getCurrentSessionConfig().getUserSessionId();
		estipulanteConfigCache.put(lumUserSessionId, (String) request.getSession().getAttribute("estipulante"));
		response.sendRedirect(REDIRECT + "/token/" + lumUserSessionId);
	}
}