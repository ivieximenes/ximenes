package br.com.qualicorp.redenarede.service.login.interfaces;

import java.io.IOException;

import javax.portlet.PortletSession;

import lumis.doui.service.DouiServiceInterface;
import lumis.portal.PortalException;
import lumis.portal.UnexpectedException;
import lumis.portal.authentication.SessionConfig;
import lumis.portal.serviceinterface.IServiceInterfaceRenderRequest;
import lumis.portal.serviceinterface.IServiceInterfaceRenderResponse;
import lumis.portal.serviceinterface.ServiceInterfaceException;
import lumis.portal.user.UserConfig;

public class UserValidationInterface extends DouiServiceInterface
{
	public void render(IServiceInterfaceRenderRequest request, IServiceInterfaceRenderResponse response) throws ServiceInterfaceException, PortalException
	{
		try
		{
			if(SessionConfig.getCurrentSessionConfig().getUserId().equals(UserConfig.USER_GUEST_ID))
			{
				request.getPortletSession().removeAttribute("isBeneficiario", PortletSession.APPLICATION_SCOPE);
				request.getPortletSession().removeAttribute("isPrestador", PortletSession.APPLICATION_SCOPE);
			}
				
			Boolean isBeneficiario = (Boolean) request.getPortletSession().getAttribute("isBeneficiario", PortletSession.APPLICATION_SCOPE);
			Boolean isPrestador = (Boolean) request.getPortletSession().getAttribute("isPrestador", PortletSession.APPLICATION_SCOPE);
			
			//Solicitado pelo cliente 31-05-2017 - Verifica se a página é a de Termos de uso do app e não redireciona
			String pageId = request.getPageConfig().getId();
			Boolean isTermosApp = pageId.equals("4028819B5C0A0C80015C0A1B68210132") ? true : false;
			
			if(isBeneficiario!=null && isBeneficiario && isTermosApp == false)
				response.getWriter().write("<script>window.location.replace('/beneficiario');</script>");
			else if(isPrestador!=null && isPrestador && isTermosApp == false)
				response.getWriter().write("<script>window.location.replace('/prestador');</script>");
		}
		catch(IOException e)
		{
			throw new UnexpectedException(e);
		}
	}
}