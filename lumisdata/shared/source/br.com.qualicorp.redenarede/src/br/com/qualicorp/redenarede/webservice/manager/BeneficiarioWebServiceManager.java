package br.com.qualicorp.redenarede.webservice.manager;

import java.io.File;
import java.io.StringWriter;
import java.net.URL;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.datatype.DatatypeConstants;
import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.XMLGregorianCalendar;
import javax.xml.namespace.QName;

import org.apache.commons.lang.time.DateFormatUtils;
import org.w3c.dom.Document;
import org.w3c.dom.Node;

import br.com.qualicorp.redenarede.commons.utils.DateUtils;
import br.com.qualicorp.redenarede.commons.utils.StringUtils;
import br.com.qualicorp.redenarede.service.useraccount.to.BeneficionarioTO;
import br.com.qualicorp.redenarede.webservice.stub.beneficiario.AtualizarBeneficiario;
import br.com.qualicorp.redenarede.webservice.stub.beneficiario.AtualizarBeneficiario2;
import br.com.qualicorp.redenarede.webservice.stub.beneficiario.AtualizarBeneficiarioResponse;
import br.com.qualicorp.redenarede.webservice.stub.beneficiario.AutenticacaoBeneficiario;
import br.com.qualicorp.redenarede.webservice.stub.beneficiario.AutenticacaoBeneficiarioService;
import br.com.qualicorp.redenarede.webservice.stub.beneficiario.AutenticacaoBeneficiarioServiceToken;
import br.com.qualicorp.redenarede.webservice.stub.beneficiario.Autenticar;
import br.com.qualicorp.redenarede.webservice.stub.beneficiario.AutenticarResponse;
import br.com.qualicorp.redenarede.webservice.stub.beneficiario.Beneficiario;
import br.com.qualicorp.redenarede.webservice.stub.beneficiario.ConsultarToken;
import br.com.qualicorp.redenarede.webservice.stub.beneficiario.ConsultarTokenResponse;
import br.com.qualicorp.redenarede.webservice.stub.beneficiario.CriarSenhaGsp;
import br.com.qualicorp.redenarede.webservice.stub.beneficiario.CriarSenhaGsp2;
import br.com.qualicorp.redenarede.webservice.stub.beneficiario.CriarSenhaGspResponse;
import br.com.qualicorp.redenarede.webservice.stub.beneficiario.Operadora;
import br.com.qualicorp.redenarede.webservice.stub.beneficiario.RecuperarSenha;
import br.com.qualicorp.redenarede.webservice.stub.beneficiario.RecuperarSenhaResponse;
import br.com.qualicorp.redenarede.webservice.stub.beneficiario.Telefone;
import br.com.qualicorp.redenarede.webservice.stub.beneficiario.TrocarSenha;
import br.com.qualicorp.redenarede.webservice.stub.beneficiario.TrocarSenhaResponse;
import lumis.portal.PortalContext;
import lumis.portal.PortalException;
import lumis.portal.UnexpectedException;
import lumis.portal.serviceinterface.IServiceInterfaceRequest;
import lumis.util.XmlUtil;
import lumis.util.log.ILogger;
import lumis.util.log.LoggerFactory;

public class BeneficiarioWebServiceManager
{
	private final Operadora operadora;
	private final AutenticacaoBeneficiarioServiceToken service;
	String error = "Ocorreu um erro ao processar sua solicitação.";
	
	private static ILogger logger = LoggerFactory.getServiceLogger("gsp.WebService");
	
	static
	{
		javax.net.ssl.HttpsURLConnection.setDefaultHostnameVerifier(new javax.net.ssl.HostnameVerifier()
		{
			public boolean verify(String hostname, javax.net.ssl.SSLSession sslSession)
			{
				return true;
			}
		});
	}

	public BeneficiarioWebServiceManager() throws Exception
	{
		try
		{
			ignoreSSL();
			Document dom = XmlUtil.getDocument(new File(PortalContext.getConfigPath("/webServiceConfig.xml")));
			Node config = XmlUtil.selectSingleNode("/webServiceConfig/beneficiario", dom);
			URL urlWSDL = new URL(XmlUtil.readAttributeOrNodeString(config, "wsdlLocation"));

			String strQName = urlWSDL.toString();

			strQName = strQName.substring(strQName.lastIndexOf("/") + 1, strQName.lastIndexOf("?"));

			service = new AutenticacaoBeneficiarioServiceToken(new URL(XmlUtil.readAttributeOrNodeString(config, "wsdlLocation")), new QName("http://service.autenticacao.ws.tempoassist.com.br", strQName));
			operadora = new Operadora();
			operadora.setCodigo(XmlUtil.readAttributeOrNodeString(config, "codigoOperadora"));
			operadora.setCodigoSistema(XmlUtil.readAttributeOrNodeString(config, "codigoSistema"));

			error = XmlUtil.readAttributeOrNodeString(config, "errorMessage");
		}
		catch (PortalException e)
		{
			System.out.println("Erro ao instanciar BeneficiarioWebServiceManager: " + e.getMessage());
			logger.error("Erro", e);
			throw new PortalException(error, e);
		}
	}

	public CriarSenhaGspResponse cadastrarBeneficiario(IServiceInterfaceRequest request) throws Exception
	{
		try
		{
			AutenticacaoBeneficiario beneficiario = new AutenticacaoBeneficiario();
			beneficiario.setNome(request.getParameter("nome"));
			beneficiario.setNomeMae(request.getParameter("nome_mae"));

			if (request.getParameter("cpfbeneficiario") != null)
				beneficiario.setCpf(request.getParameter("cpfbeneficiario").replaceAll("[\\D]", ""));

			beneficiario.setUsuario(request.getParameter("numero_carteira").replaceAll("[^0-9]", ""));
			beneficiario.setEmail(request.getParameter("email"));
			beneficiario.setConfirmacaoEmail(request.getParameter("email"));
			beneficiario.setRg(request.getParameter("rg"));
			beneficiario.setOrgaoEmissor(request.getParameter("orgao_emissor"));
			beneficiario.setSenha(request.getParameter("passwordbeneficiario"));
			beneficiario.setConfirmacaoSenha(request.getParameter("confirmpasswordbeneficiario"));
			String dtNascimento = request.getParameter("data_nascimento_str");
			beneficiario.setDataNascimento(stringToXMLGregorianCalendarOnlyDate(dtNascimento));

			/*
			 * CriarSenha criarSenha = new CriarSenha();
			 * criarSenha.setOperadora(this.operadora);
			 * criarSenha.setAutenticacaoBeneficiario(beneficiario );
			 */

			CriarSenhaGsp2 criarSenhaGsp2 = new CriarSenhaGsp2();
			criarSenhaGsp2.setCodigoOperadora(this.operadora.getCodigo());
			criarSenhaGsp2.setCodigoCarteirinha(beneficiario.getUsuario());
			criarSenhaGsp2.setCodigoSistema(this.operadora.getCodigoSistema());
			criarSenhaGsp2.setCpf(beneficiario.getCpf());
			criarSenhaGsp2.setDataNascimento(beneficiario.getDataNascimento());
			criarSenhaGsp2.setNomeMae(beneficiario.getNomeMae());
			criarSenhaGsp2.setSenha(beneficiario.getSenha());
			criarSenhaGsp2.setConfirmacaoSenha(beneficiario.getConfirmacaoSenha());

			CriarSenhaGsp criarSenhaGsp = new CriarSenhaGsp();
			criarSenhaGsp.setParams(criarSenhaGsp2);

			logXML("cadastrarBeneficiario() criarSenhaGsp", criarSenhaGsp);

			CriarSenhaGspResponse response = service.getAutenticacaoBeneficiarioServiceHttpSoapEndpoint().criarSenhaGsp(criarSenhaGsp);

			logXML("cadastrarBeneficiario() response", response);

			return response;
		}
		catch (AutenticacaoBeneficiarioService e)
		{
			System.out.println(e.getMessage());
			logger.error("Erro", e);
			throw new PortalException(error, e);
		}
	}

	public AtualizarBeneficiarioResponse atualizar(BeneficionarioTO to, String codigoInternoGamaBeneficiario) throws PortalException
	{
		try
		{
			AtualizarBeneficiario params = new AtualizarBeneficiario();
			
			AtualizarBeneficiario2 atualizar = new AtualizarBeneficiario2();
			
			atualizar.setCodigoBeneficiario(codigoInternoGamaBeneficiario);
			atualizar.setCodigoEstipulante(to.getCodigoEstipulante());
			atualizar.setEmail(to.getEmail());
			atualizar.setDdd(to.getTelefone().substring(1, 3));
			atualizar.setNumTel(to.getTelefone().substring(5).replace("-", ""));
			
			params.setParams(atualizar);
			
			return service.getAutenticacaoBeneficiarioServiceHttpSoapEndpoint().atualizarBeneficiario(params);
		}
		catch (AutenticacaoBeneficiarioService e)
		{
			System.out.println(e.getMessage());
			logger.error("Erro", e);
			throw new PortalException(error, e);
		}
	}
	
	public AutenticarResponse login(String login, String password) throws Exception
	{
		try
		{
			Autenticar autenticar = new Autenticar();
			autenticar.setOperadora(operadora);
			AutenticacaoBeneficiario beneficiario = new AutenticacaoBeneficiario();
			beneficiario.setUsuario(login);
			beneficiario.setSenha(password);
			autenticar.setAutenticacaoBeneficiario(beneficiario);
			AutenticarResponse response = service.getAutenticacaoBeneficiarioServiceHttpSoapEndpoint().autenticar(autenticar);
			return response;
		}
		catch (Exception e)
		{
			System.out.println(e.getMessage());
			logger.error("Erro", e);
			throw new PortalException(error, e);
		}
	}

	/**
	 * Ignora certificados SSL invalidos
	 */
	private void ignoreSSL()
	{
		TrustManager[] trustAllCerts = new TrustManager[] { new X509TrustManager()
		{
			public void checkClientTrusted(java.security.cert.X509Certificate[] certs, String authType)
			{
			}

			public void checkServerTrusted(java.security.cert.X509Certificate[] certs, String authType)
			{
			}

			public java.security.cert.X509Certificate[] getAcceptedIssuers()
			{
				return null;
			}
		} };

		// Install the all-trusting trust manager
		try
		{
			SSLContext sc = SSLContext.getInstance("SSL");
			sc.init(null, trustAllCerts, new java.security.SecureRandom());
			HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());
		}
		catch (Exception e)
		{
			System.out.println(e.getMessage());
			logger.error(e.getMessage());
		}
	}

	public TrocarSenhaResponse trocarSenha(String login, String password, String newPassword) throws Exception
	{
		TrocarSenhaResponse response = new TrocarSenhaResponse();
		
		try
		{
			final TrocarSenha trocarSenha = new TrocarSenha();
			trocarSenha.setOperadora(operadora);
			final AutenticacaoBeneficiario beneficiario = new AutenticacaoBeneficiario();
			beneficiario.setCodigo(login);
			beneficiario.setSenhaAnterior(password);
			beneficiario.setSenha(newPassword);
			trocarSenha.setAutenticacaoBeneficiario(beneficiario);
			
			response = service.getAutenticacaoBeneficiarioServiceHttpSoapEndpoint().trocarSenha(trocarSenha);
		}
		catch (AutenticacaoBeneficiarioService e)
		{
			System.out.println(e.getMessage());
			logger.error("Erro", e);
			throw new PortalException(error, e);
		}
		
		return response;

	}

	public RecuperarSenhaResponse recuperarSenha(String login, String cpf, String email) throws PortalException
	{
		
		RecuperarSenhaResponse response = new RecuperarSenhaResponse();
		try
		{
			RecuperarSenha recuperarSenha = new RecuperarSenha();
			recuperarSenha.setOperadora(operadora);
			AutenticacaoBeneficiario autenticacaoBeneficiario = new AutenticacaoBeneficiario();
			autenticacaoBeneficiario.setUsuario(login);
			autenticacaoBeneficiario.setCpf(cpf != null ? cpf.replaceAll("[\\D]", "") : null);
			autenticacaoBeneficiario.setEmail(email);
			autenticacaoBeneficiario.setConfirmacaoEmail(email);

			recuperarSenha.setAutenticacaoBeneficiario(autenticacaoBeneficiario);
			response = service.getAutenticacaoBeneficiarioServiceHttpSoapEndpoint().recuperarSenha(recuperarSenha);
		}
		catch (AutenticacaoBeneficiarioService e)
		{
			System.out.println(e.getMessage());
			logger.error("Erro", e);
			throw new PortalException(error, e);
		}
		return response;
	}

	public ConsultarTokenResponse consultarToken(String token) throws Exception
	{
		ConsultarTokenResponse response = null;

		try
		{
			ConsultarToken consultarToken = new ConsultarToken();

			consultarToken.setToken(token);
			response = service.getAutenticacaoBeneficiarioServiceHttpSoapEndpoint().consultarToken(consultarToken);

		}
		catch (Exception e)
		{
			System.out.println(e.getMessage());
			logger.error("Erro", e);
			throw new PortalException(error, e);
		}
		return response;
	}

	private XMLGregorianCalendar stringToXMLGregorianCalendarOnlyDate(String strDate)
	{
		try
		{
			String[] strDateA = strDate.split("/");

			int year = Integer.parseInt(strDateA[2]);
			int month = Integer.parseInt(strDateA[1]);
			int day = Integer.parseInt(strDateA[0]);

			return DatatypeFactory.newInstance().newXMLGregorianCalendarDate(year, month, day, DatatypeConstants.FIELD_UNDEFINED);
		}
		catch (Exception e)
		{
			e.printStackTrace();
			logger.error("Erro", e);
		}

		return null;
	}

	public BeneficionarioTO createBeneficionarioTO(Beneficiario beneficiario) throws UnexpectedException
	{
		BeneficionarioTO to = new BeneficionarioTO();

		to.setNumeroCarteira(beneficiario.getCodigoCarteirinha().replaceAll("[^0-9]", ""));
		to.setCpf(beneficiario.getCpf());
		to.setEmail(beneficiario.getEmail());
		to.setNome(beneficiario.getNome());
		to.setNomeMae(beneficiario.getNomeMae());
		to.setOrgaoEmissor(beneficiario.getOrgaoEmissor());
		to.setRg(beneficiario.getRg());
		to.setCodigoInternoGama(beneficiario.getCodigoInterno());
		to.setEmpresa(beneficiario.getEmpresa());
		to.setPassword("");
		
		if(beneficiario.getEmpresa() != null)
			to.setEmpresa(beneficiario.getEmpresa());
		
		if(beneficiario.getGrupoFamiliar() != null && beneficiario.getGrupoFamiliar().size() > 0)
			to.setGrupoFamiliar(beneficiario.getGrupoFamiliar());
			
		if (beneficiario.getEmpresa() != null)
			to.setCodigoEstipulante(beneficiario.getEmpresa().getCodigo().toString());
		
		if (beneficiario.getSubestipulante() != null)
			to.setCodigoSubEstipulante(beneficiario.getSubestipulante().getCodigo().toString());
		
		if (beneficiario.getTelefonePrincipal() != null)
		{
			to.setTelefone(formatTelefone(beneficiario.getTelefonePrincipal()));
			to.setShouldUpdateTelefone(shouldUpdateTelefone(beneficiario.getTelefonePrincipal()));
		}
		else if(beneficiario.getTelefoneContato() != null)
		{
			to.setTelefone(formatTelefone(beneficiario.getTelefoneContato()));
			to.setShouldUpdateTelefone(shouldUpdateTelefone(beneficiario.getTelefoneContato()));
		}

		if (beneficiario.getDataNascimento() != null)
		{
			to.setDataNascimento(DateFormatUtils.format(beneficiario.getDataNascimento().toGregorianCalendar(), "dd/MM/yyyy"));
			to.setDataNascimentoDate(DateUtils.parse(to.getDataNascimento()));
		}
		
		if (beneficiario.getPlano() != null && !StringUtils.isBlankOrNull(beneficiario.getPlano().getNome()))
		{
			to.setPlano(beneficiario.getPlano().getNome());
		}

		return to;
	}
	
	private boolean shouldUpdateTelefone(Telefone telefone)
	{
		if (telefone == null)
			return false;
		
		if (telefone.getDdd() == null)
			return false;
		
		if (telefone.getNumero() == null)
			return false;
		
		return true;
	}
	
	private static String formatTelefone(Telefone telefone)
	{
		StringBuilder telefoneStr = new StringBuilder();

		if (telefone.getDdd() != null)
		{
			if (telefone.getDdd() < 10 || telefone.getDdd() > 99)
				return null;
			
			telefoneStr.append(telefone.getDdd());
		}
		else
		{
			return null;
		}

		if (telefone.getNumero() != null)
		{
			String pabx = telefone.getNumero().replaceAll("\\D", "");
			
			if (pabx.length() != 8 && pabx.length() != 9)
				return null;
			
			telefoneStr.append(pabx);
		}
		else
		{
			return null;
		}

		return StringUtils.formatPhone(telefoneStr.toString());
	}

	private void logXML(String label, Object obj)
	{
		try
		{
			JAXBContext jaxbContext = JAXBContext.newInstance(obj.getClass());
			Marshaller jaxbMarshaller = jaxbContext.createMarshaller();

			StringWriter sw = new StringWriter();

			jaxbMarshaller.marshal(obj, sw);

			logger.debug(sw.toString());
		}
		catch (JAXBException e)
		{
			e.printStackTrace();
			logger.error("Erro", e);
		}
	}
}