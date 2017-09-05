package br.com.qualicorp.redenarede.webservice.manager;

import java.io.File;
import java.net.URL;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import org.w3c.dom.Document;
import org.w3c.dom.Node;

import com.sun.xml.wss.XWSSConstants;

import br.com.qualicorp.redenarede.webservice.stub.pretador.AlterarSenhaUsuarioPrestador;
import br.com.qualicorp.redenarede.webservice.stub.pretador.CadastrarUsuarioPrestador;
import br.com.qualicorp.redenarede.webservice.stub.pretador.RecuperarSenhaUsuarioPrestador;
import br.com.qualicorp.redenarede.webservice.stub.pretador.RecuperarSenhaUsuarioPrestadorResponse;
import br.com.qualicorp.redenarede.webservice.stub.pretador.RetornoUsuarioPrestador;
import br.com.qualicorp.redenarede.webservice.stub.pretador.ServicoPrestador;
import br.com.qualicorp.redenarede.webservice.stub.pretador.UsuarioPrestador;
import br.com.qualicorp.redenarede.webservice.stub.pretador.ValidarUsuarioPrestador;
import lumis.portal.PortalContext;
import lumis.portal.PortalException;
import lumis.portal.serviceinterface.IServiceInterfaceRequest;
import lumis.util.XmlUtil;
import lumis.util.log.ILogger;
import lumis.util.log.LoggerFactory;

public class PrestadorWebServiceManager {
	static {
	    javax.net.ssl.HttpsURLConnection.setDefaultHostnameVerifier(
	    new javax.net.ssl.HostnameVerifier(){
	        public boolean verify(String hostname, javax.net.ssl.SSLSession sslSession) {
	            return true;
	        }
	    });
	}
	ServicoPrestador service;
	String error = "Ocorreu um erro ao processar sua solicitação.";
	private static ILogger logger = LoggerFactory.getServiceLogger("gsp.WebService");
	public PrestadorWebServiceManager() throws Exception
	{
		try {
			ignoreSSL();
			Document dom = XmlUtil.getDocument(new File(PortalContext.getConfigPath("/webServiceConfig.xml")));
			Node config = XmlUtil.selectSingleNode("/webServiceConfig/prestador", dom);
			service = new ServicoPrestador(new URL(XmlUtil.readAttributeOrNodeString(config, "wsdlLocation")));
			error = XmlUtil.readAttributeOrNodeString(config, "errorMessage");
		} catch (PortalException e) {
			logger.error(e.getMessage());
			throw new PortalException(error, e);
		}
	}
	public RetornoUsuarioPrestador cadastrarPrestador(IServiceInterfaceRequest request) throws Exception
	{
		RetornoUsuarioPrestador response = new RetornoUsuarioPrestador();
		try {
			
			((javax.xml.ws.BindingProvider)service.getBasicHttpsBindingIServicoPrestador()).getRequestContext().put(XWSSConstants.USERNAME_PROPERTY, "portalr2"); 
			((javax.xml.ws.BindingProvider)service.getBasicHttpsBindingIServicoPrestador()).getRequestContext().put(XWSSConstants.PASSWORD_PROPERTY, "abc123"); 

			String cpf_cnpj = request.getParameter("provider-signup-cnpj")==null||
					"".equals(request.getParameter("provider-signup-cnpj")) ? 
							request.getParameter("provider-signup-cpf"):
								request.getParameter("provider-signup-cnpj");
			
			UsuarioPrestador usuario = new UsuarioPrestador();
			usuario.setEmail(request.getParameter("email"));
			usuario.setCPFCNPJ(cpf_cnpj);
			usuario.setRazaoSocial(request.getParameter("razao_social"));
			usuario.setTelefone(request.getParameter("telefone"));
			usuario.setSenhaAtual(request.getParameter("passwordprestador"));
			usuario.setSenhaNova("QWe@321");//esse campo apenas valida se é diferente da senha atual (foi passado pela equipe do WS de prestador)
			CadastrarUsuarioPrestador parameters = new CadastrarUsuarioPrestador();
			parameters.setUsuarioPrestador(usuario);

			response = service.getBasicHttpsBindingIServicoPrestador().cadastrarUsuarioPrestador(parameters ).getCadastrarUsuarioPrestadorResult();
		} catch (Exception e) {
			logger.error(e.getMessage());
			throw new PortalException(error, e);
		}
		return response;
	}
	
	public RetornoUsuarioPrestador login(String login, String password) throws PortalException {
		RetornoUsuarioPrestador response = new RetornoUsuarioPrestador();
		try
		{
			ValidarUsuarioPrestador parameters = new ValidarUsuarioPrestador();
			UsuarioPrestador usuario = new UsuarioPrestador();
			usuario.setEmail(login);
			usuario.setSenhaAtual(password);
			parameters.setUsuarioPrestador(usuario );
			response = service.getBasicHttpsBindingIServicoPrestador().validarUsuarioPrestador(parameters ).getValidarUsuarioPrestadorResult();
		}catch(Exception e)
		{
			logger.error(e.getMessage());
			throw new PortalException(error, e);
		}
		return response;
	}
	
	
	public RecuperarSenhaUsuarioPrestadorResponse recuperarSenha(String cpfCnpj, String email) throws PortalException {
		RecuperarSenhaUsuarioPrestadorResponse response = new RecuperarSenhaUsuarioPrestadorResponse();
		try
		{
			UsuarioPrestador usuario = new UsuarioPrestador();
			usuario.setEmail(email);
			usuario.setCPFCNPJ(cpfCnpj.replaceAll("[\\D]", ""));
			RecuperarSenhaUsuarioPrestador parameters = new RecuperarSenhaUsuarioPrestador();
			parameters.setUsuarioPrestador(usuario);
			response = service.getBasicHttpsBindingIServicoPrestador().recuperarSenhaUsuarioPrestador(parameters);
		}catch(Exception e)
		{
			logger.error(e.getMessage());
			throw new PortalException(error, e);
		}
		return response;
	}
	
	public RetornoUsuarioPrestador alterarSenha(String email, String cpfCnpj, String senhaAtual, String senhaNova, String confirmNewPassword) throws Exception
	{
		RetornoUsuarioPrestador response = new RetornoUsuarioPrestador();
		try {
			
			UsuarioPrestador usuario = new UsuarioPrestador();
			usuario.setEmail(email);
			usuario.setCPFCNPJ(cpfCnpj.replaceAll("[\\D]", ""));
			usuario.setSenhaAtual(senhaAtual);
			usuario.setSenhaNova(senhaNova);
			usuario.setConfirmacaoSenha(confirmNewPassword);
			AlterarSenhaUsuarioPrestador parameters = new AlterarSenhaUsuarioPrestador();
			parameters.setUsuarioPrestador(usuario);
			response  = service.getBasicHttpsBindingIServicoPrestador().alterarSenhaUsuarioPrestador(parameters).getAlterarSenhaUsuarioPrestadorResult();
		} catch (Exception e) {
			logger.error(e.getMessage());
			throw new PortalException(error, e);
		}
		return response;
	}
	
	
	/**
	 * Ignora certificados SSL invalidos
	 */
	private void ignoreSSL() {
		
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
			logger.error(e.getMessage());
		}
	}
	
	
}
