package br.com.qualicorp.redenarede.service.buscapormedico.interfaces;

import br.com.qualicorp.redenarede.service.buscapormedico.manager.BuscaNaRedeManager;
import lumis.doui.service.DouiServiceInterface;
import lumis.portal.PortalException;
import lumis.portal.UnexpectedException;
import lumis.portal.serviceinterface.IServiceInterfaceRenderRequest;
import lumis.portal.serviceinterface.IServiceInterfaceRenderResponse;
import lumis.portal.serviceinterface.ServiceInterfaceException;

public class BuscaPorMedicoInterface extends DouiServiceInterface
{
	//Caso reclamarem de alguma problema de layout, segue um exemplo de iframe em conteúdo HTML estático:
	//<iframe frameborder="0" height="780" onload="javascript:resizeIframe(this);" scrolling="no" src=".." width="100%"></iframe>
	
	public void render(IServiceInterfaceRenderRequest request, IServiceInterfaceRenderResponse response) throws ServiceInterfaceException, PortalException
	{
		try
		{
			String src = BuscaNaRedeManager.getInstance().getUrlBuscanaRede(request);
			
			StringBuilder iframe = new StringBuilder();
			
			iframe.append("<iframe frameborder=\"0\" scrolling=\"no\" ");
			iframe.append(	"	height=\"780\"");
			iframe.append(	"	width=\"100%\"" );
			iframe.append(	"	src=\"").append(src).append("\">");
			iframe.append("</iframe>");
			
			response.getWriter().append(iframe.toString());
		}
		catch(Exception e)
		{
			throw new UnexpectedException(e);
		}
	}
}