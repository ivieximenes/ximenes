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
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.w3c.dom.Document;
import org.w3c.dom.Node;

import br.com.qualicorp.redenarede.service.oauth.manager.OauthAuthenticationManager;
import lumis.portal.PortalContext;
import lumis.portal.PortalException;
import lumis.portal.authentication.SessionConfig;
import lumis.util.XmlUtil;

@Path("/prontmed")
public class ProntMedOauthAuthentication {

	final  String CLIENT_ID;
	final  String CLIENT_SECRET;
	final  String OAUTH_URL;
	final  String REDIRECT_URI;
	public ProntMedOauthAuthentication() throws PortalException{
		try {
			Document dom = XmlUtil.getDocument(new File(PortalContext.getConfigPath("/oauth_prontmed.xml")));
			Node config = XmlUtil.selectSingleNode("/oauth", dom);
			this.CLIENT_ID = XmlUtil.readAttributeOrNodeString(config, "CLIENT_ID");
			this.CLIENT_SECRET = XmlUtil.readAttributeOrNodeString(config, "CLIENT_SECRET");
			this.OAUTH_URL = XmlUtil.readAttributeOrNodeString(config, "OAUTH_URL");
			this.REDIRECT_URI = XmlUtil.readAttributeOrNodeString(config, "REDIRECT_URI");
		} catch (Exception e) {
			throw new PortalException(e.getMessage(), e);
		}
		
	}
	
	@GET
	@Path("/login")
	@Produces(value = MediaType.TEXT_HTML)
	public String loginProntMed(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception {
		
		String token = null;
		String refresh_token_temp = null;
		OauthAuthenticationManager oauthManager = OauthAuthenticationManager.getInstance();
		
		try
		{
			token = oauthManager.getRefreshToken(SessionConfig.getCurrentSessionConfig().getUserId(), "PRONTMED");
			
			if (token == null)
			{
				refresh_token_temp = request.getParameter("refreshToken");
				if (refresh_token_temp != null)
				{
					oauthManager.addRefreshToken(refresh_token_temp, SessionConfig.getCurrentSessionConfig().getUserId(), "PRONTMED");
				}

				String access_Token = request.getParameter("access_token");
				if (access_Token == null)
				{
					return createCodeScript();
				}
				else
				{
					response.sendRedirect(createAuthorizationUrl(access_Token));
				}
			}
			else
			{
				String json = getRefreshTokenJson(token);
				String newToken = parseJson(json, "refresh_token");
				String accessToken = parseJson(json, "access_token");
				oauthManager.updateRefreshToken(newToken, token);

				response.sendRedirect(createAuthorizationUrl(accessToken));
			}
		}
		catch (Exception e)
		{
			if (token != null)
				oauthManager.deleteRefreshToken(token);
			return createCodeScript();

		}
		
		return null;
	}

	private String parseJson(String json, String node)
			throws MalformedURLException, IOException, ProtocolException, ParseException, PortalException {
		JSONParser parser = new JSONParser();
		JSONObject result = (JSONObject) parser.parse(json);
		String refresh_token=  (String) result.get(node);
		if(refresh_token==null)
			throw new PortalException("Não Autorizado.");
		return refresh_token;
	}

	private String getRefreshTokenJson(String token) throws PortalException {
		StringBuilder parameters = new StringBuilder();
		parameters.append("grant_type=refresh_token");
		parameters.append("&client_id=");
		parameters.append(CLIENT_ID);
		parameters.append("&client_secret=");
		parameters.append(CLIENT_SECRET);
		parameters.append("&refresh_token=");
		parameters.append(token);
		String newToken = null;
		try {
			//ignoreSSL();
			URL url = new URL(OAUTH_URL+"/people/token?"+parameters.toString());
			HttpURLConnection con = (HttpURLConnection)url.openConnection();
			con.setRequestMethod("POST");
			con.setRequestProperty("Content-Length", Integer.toString(parameters.toString().length()));
			con.setRequestProperty("Content-type", "application/x-www-form-urlencoded");
			con.setDoOutput(true);
			con.getOutputStream().write(parameters.toString().getBytes("UTF-8"));
			newToken = readURL(con);
			if(newToken==null)
				throw new PortalException("Não Autorizado");
		} catch (IOException e) {
			throw new PortalException(e.getMessage(), e);
		}
		return newToken;
	}

	
	private String createCodeScript() {
		StringBuilder script = new StringBuilder();
		script.append(		"<script>");
		script.append(			"window.onmessage = function(e) {");
		script.append(				"window.location.href=window.location.href+\"?code=\"+JSON.stringify(e.data);");
		script.append(			"};");
		script.append(			"window.location.replace(\""+OAUTH_URL+"/app/#/integration?clientId="+CLIENT_ID+"&secret="+CLIENT_SECRET+"&redirectUri="+REDIRECT_URI+"\", '_blank');");
		script.append(		"</script>");
		return script.toString();
	}

	private String createAuthorizationUrl(String accessCode) {
		StringBuilder url = new StringBuilder(OAUTH_URL);
		url.append("/app/tokenSignin.html");
		url.append("?redirectTo=/app/");
		url.append("&access_token=");
		url.append(accessCode);
		return url.toString();
	}	



	private String readURL(HttpURLConnection con) throws PortalException {
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		InputStream is;
		try {
			is = con.getInputStream();
		
		int r;
		while ((r = is.read()) != -1) {
			baos.write(r);
		}
		} catch (IOException e) {
			throw new PortalException(e.getMessage(), e);
		}
		return new String(baos.toByteArray());
	}

	/**
	 * Ignora certificados SSL invalidos
	 */
/*	private void ignoreSSL() {
		
		TrustManager[] trustAllCerts = new TrustManager[]{
		    new X509TrustManager() {
		        public void checkClientTrusted(
		            java.security.cert.X509Certificate[] certs, String authType) {
		        }
		        public void checkServerTrusted(
		            java.security.cert.X509Certificate[] certs, String authType) {
		        }
		        public java.security.cert.X509Certificate[] getAcceptedIssuers() {
		            return null;
		        }
		    }
		};

		try {
		    SSLContext sc = SSLContext.getInstance("SSL");
		    sc.init(null, trustAllCerts, new java.security.SecureRandom());
		    HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());
		} catch (Exception e) {
		}
	}*/
}
