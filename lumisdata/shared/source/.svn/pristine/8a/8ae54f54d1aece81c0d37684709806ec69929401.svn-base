package br.com.qualicorp.redenarede.service.oauth.oauth;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;

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
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.w3c.dom.Document;
import org.w3c.dom.Node;

import br.com.qualicorp.redenarede.service.oauth.manager.OauthAuthenticationManager;
import br.com.qualicorp.redenarede.service.useraccount.manager.BeneficiarioManager;
import lumis.portal.PortalContext;
import lumis.portal.PortalException;
import lumis.portal.authentication.SessionConfig;
import lumis.portal.manager.ManagerFactory;
import lumis.portal.principal.PrincipalConfig;
import lumis.portal.transaction.ITransaction;
import lumis.portal.transaction.PortalTransactionFactory;
import lumis.portal.user.UserConfig;
import lumis.util.XmlUtil;
import lumis.util.log.ILogger;
import lumis.util.log.LoggerFactory;

@Path("/boaconsulta")
public class BoaConsultaOauthAuthentication
{
	private static ILogger logger = LoggerFactory.getLogger(BoaConsultaOauthAuthentication.class);
	
	final String CLIENT_ID;
	final String CLIENT_SECRET;
	final String REDIRECT_URI;
	final String PRESTADOR_URL;
	final String BENEFICIARIO_URL;
	
	private String getPropriedadesLog()
	{
		return "\nPropriedades:\nCLIENT_ID='" + CLIENT_ID + "', \nCLIENT_SECRET='" + CLIENT_SECRET + "', \nPRESTADOR_URL='" + PRESTADOR_URL + "'" +
			   ", \nREDIRECT_URI=" + REDIRECT_URI + "', \nBENEFICIARIO_URL='" + BENEFICIARIO_URL + "'";
	}
	
	public BoaConsultaOauthAuthentication() throws PortalException
	{
		try
		{
			Document dom = XmlUtil.getDocument(new File(PortalContext.getConfigPath("/oauth_boaconsulta.xml")));
			
			Node config = XmlUtil.selectSingleNode("/oauth", dom);
			this.CLIENT_ID = XmlUtil.readAttributeOrNodeString(config, "CLIENT_ID");
			this.CLIENT_SECRET = XmlUtil.readAttributeOrNodeString(config, "CLIENT_SECRET");
			this.PRESTADOR_URL = XmlUtil.readAttributeOrNodeString(config, "PRESTADOR_URL");
			this.BENEFICIARIO_URL = XmlUtil.readAttributeOrNodeString(config, "BENEFICIARIO_URL");
			this.REDIRECT_URI = XmlUtil.readAttributeOrNodeString(config, "REDIRECT_URI");
		}
		catch (Exception e)
		{
			logger.error("Erro no construtor BoaConsultaOauthAuthentication()" + getPropriedadesLog(), e);
			
			throw new PortalException(e.getMessage(), e);
		}
	}
	
	@GET
	@Path("/prestador")
	@Produces("application/json")
	public void loginBoaConsulta(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception
	{
		String token = null;
		OauthAuthenticationManager oauthManager = OauthAuthenticationManager.getInstance();

		try
		{
			token = oauthManager.getRefreshToken(SessionConfig.getCurrentSessionConfig().getUserId(), "BOA_CONSULTA");

			if (token == null)
			{
				String code = request.getParameter("code");

				if (code == null)
				{
					response.sendRedirect(createCodeUrl());
				}
				else
				{
					String authUrl = createAuthorizationUrl(code);
					JSONObject result = getToken(authUrl);
					oauthManager.addRefreshToken((String) result.get("refresh_token"), SessionConfig.getCurrentSessionConfig().getUserId(), "BOA_CONSULTA");
					String access_token = (String) result.get("access_token");
					response.sendRedirect(PRESTADOR_URL + "/oauth/token/login?access_token=" + access_token);
				}
			}
			else
			{
				String tokenUrl = createRefreshTokenUrl(token);
				JSONObject result = getToken(tokenUrl);
				String access_token = (String) result.get("access_token");
				String newToken = (String) result.get("refresh_token");
				oauthManager.updateRefreshToken(newToken, token);
				response.sendRedirect(PRESTADOR_URL + "/oauth/token/login?access_token=" + access_token);
			}
		}
		catch (Exception e)
		{
			logger.error("Erro no serviço /boaconsulta/prestador" + getPropriedadesLog(), e);
			
			if (token != null)
				oauthManager.deleteRefreshToken(token);
			
			response.sendRedirect(createCodeUrl());
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

			return Response.ok(json.toJSONString()).build();
		}

		ITransaction transaction = PortalTransactionFactory.createTransaction();
		
		try
		{
			transaction.begin();
			
			SessionConfig sessionConfig = SessionConfig.getCurrentSessionConfig();
			sessionConfig.setUserSessionId(lumUserSessionId);
			boolean isValidSession = ManagerFactory.getAuthenticationManager().validateSessionId(sessionConfig, transaction);

			if (isValidSession)
			{
				UserConfig userConfig = ManagerFactory.getUserManager().get(sessionConfig, sessionConfig.getUserId(), transaction);
				PrincipalConfig grupo = ManagerFactory.getPrincipalManager().getByShortId(sessionConfig, "gsp.beneficiario", transaction);
				boolean isBeneficiario = ManagerFactory.getGroupManager().isMember(sessionConfig, grupo.getId(), userConfig.getId(), transaction);
				
				if (!isBeneficiario)
				{
					json.put("error", "Usuário sem premissão.");
					return Response.ok(json.toJSONString()).build();
				}

				JSONObject beneficiario = BeneficiarioManager.getInstance().getDadosbeneficiarioJSON(userConfig.getId());
				
				beneficiario.put("nome", userConfig.getFirstName());
				beneficiario.put("email", userConfig.getEmail());
				
				return Response.ok(beneficiario.toJSONString()).build();
			}
			else
			{
				json.put("error", "lumUserSessionId inválido.");
			}
			
			transaction.commit();

			return Response.ok(json.toJSONString()).build();
		}
		catch (Exception e)
		{
			logger.error("Erro no serviço /boaconsulta/beneficiario" + getPropriedadesLog(), e);
			
			transaction.rollback();
			json.put("error", "Ocorreu um erro ao processar os dados do Beneficiário.");
			
			return Response.ok(json.toJSONString()).build();
		}
		finally
		{
			transaction.close();
		}
	}
	
	@GET
	@Path("/beneficiario")
	public void redirectBeneficiarioBoaConsulta(@Context HttpServletResponse response) throws PortalException, Exception
	{
		String lumUserSessionId = SessionConfig.getCurrentSessionConfig().getUserSessionId();
		
		response.sendRedirect(BENEFICIARIO_URL + "/users/auth/gamasaudegsp/callback?lumUserSessionId=" + lumUserSessionId);
	}
	
	
	private JSONObject getToken(String authUrl) throws MalformedURLException, IOException, ProtocolException, ParseException, PortalException
	{
		URL url = new URL(authUrl.toString());
		
		HttpURLConnection con = (HttpURLConnection) url.openConnection();
		con.setRequestMethod("POST");
		con.setRequestProperty("charset", "utf-8");
		con.setDoOutput(true);
		
		JSONParser parser = new JSONParser();
		JSONObject result = (JSONObject) parser.parse(readURL(con));
		
		if (result == null)
			throw new PortalException("Não Autorizado.");
		
		return result;
	}

	private String createRefreshTokenUrl(String token)
	{
		StringBuilder url = new StringBuilder(PRESTADOR_URL);
		
		url.append("/oauth/token?grant_type=refresh_token");
		url.append("&client_id=");
		url.append(CLIENT_ID);
		url.append("&client_secret=");
		url.append(CLIENT_SECRET);
		url.append("&refresh_token=");
		url.append(token);
		
		return url.toString();
	}

	
	private String createCodeUrl()
	{
		StringBuilder url = new StringBuilder(PRESTADOR_URL);
		
		url.append("/oauth/authorize?response_type=code");
		url.append("&client_id=");
		url.append(CLIENT_ID);
		url.append("&redirect_uri=");
		url.append(REDIRECT_URI);
		
		return url.toString();
	}

	private String createAuthorizationUrl(String code)
	{
		StringBuilder url = new StringBuilder(PRESTADOR_URL);

		url.append("/oauth/token?grant_type=authorization_code");
		url.append("&client_id=");
		url.append(CLIENT_ID);
		url.append("&client_secret=");
		url.append(CLIENT_SECRET);
		url.append("&redirect_uri=");
		url.append(REDIRECT_URI);
		url.append("&code=");
		url.append(code);

		return url.toString();
	}

	private String readURL(HttpURLConnection con) throws PortalException
	{
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		InputStream is;
		
		try
		{
			is = con.getInputStream();

			int r;
			while ((r = is.read()) != -1)
			{
				baos.write(r);
			}
		}
		catch (IOException e)
		{
			throw new PortalException(e.getMessage(), e);
		}
		
		return new String(baos.toByteArray());
	}
}