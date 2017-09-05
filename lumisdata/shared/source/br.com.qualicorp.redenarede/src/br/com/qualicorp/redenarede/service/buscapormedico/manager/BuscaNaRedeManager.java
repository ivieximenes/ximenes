package br.com.qualicorp.redenarede.service.buscapormedico.manager;

import java.io.File;

import javax.portlet.PortletSession;

import org.w3c.dom.Document;
import org.w3c.dom.Node;

import lumis.portal.PortalContext;
import lumis.portal.PortalException;
import lumis.portal.serviceinterface.IServiceInterfaceRenderRequest;
import lumis.util.XmlUtil;

public class BuscaNaRedeManager
{
	final int CODIGO_OPERADORA = 9999;
	final int CODIGO_OPERADORA_BENEFICIARIO = 4;
	
	private static BuscaNaRedeManager manager;
	
	private BuscaNaRedeManager()
	{
		
	}
	
	public static BuscaNaRedeManager getInstance()
	{
		if (manager == null)
			manager = new BuscaNaRedeManager();
		
		return manager;
	}
	
	private Document getXMLConfig() throws PortalException
	{
		return XmlUtil.getDocument(new File(PortalContext.getConfigPath("/BuscanaredeConfig.xml")));
	}
	
	public String getUrlBuscanaRede(IServiceInterfaceRenderRequest request) throws PortalException
	{
		Node config = XmlUtil.selectSingleNode("/url", getXMLConfig());
		
		String src = XmlUtil.readAttributeOrNodeString(config, "URL_BuscanaRede");

		if(src == null)
			src = "https://wwwt.connectmed.com.br/saudewebHomologacao/redeatendimento";
		
		StringBuilder url = new StringBuilder(src);
		
		appendParameterUrls(url, request);
		
		return url.toString();
	}
	
	public String getUrlBuscaDescredenciados(IServiceInterfaceRenderRequest request) throws PortalException
	{
		Node config = XmlUtil.selectSingleNode("/url", getXMLConfig());
		
		String src = XmlUtil.readAttributeOrNodeString(config, "URL_BuscaDescredenciados");

		if(src == null)
			src = "https://wwwt.connectmed.com.br/saudewebHomologacao/redeatendimento/atualizacao";
		
		StringBuilder url = new StringBuilder(src);
		
		appendParameterUrls(url, request);
		
		return url.toString();
	}
	
	private void appendParameterUrls(StringBuilder url, IServiceInterfaceRenderRequest request)
	{
		Boolean isBeneficiario = (Boolean) request.getPortletSession().getAttribute("isBeneficiario", PortletSession.APPLICATION_SCOPE);
		String plano = (String) request.getPortletSession().getAttribute("plano", PortletSession.APPLICATION_SCOPE);
		String estipulante = (String) request.getPortletSession().getAttribute("estipulante", PortletSession.APPLICATION_SCOPE);
		
		url.append(	"\\?codOpa="+ (isBeneficiario != null && isBeneficiario == true ? CODIGO_OPERADORA_BENEFICIARIO : CODIGO_OPERADORA));
		
		if(estipulante != null)
			url.append(	"&codEpl="+estipulante);
		
		if(plano != null)
			url.append(	"&codPln="+plano);
		
		url.append(	"&language=pt");
	}
}