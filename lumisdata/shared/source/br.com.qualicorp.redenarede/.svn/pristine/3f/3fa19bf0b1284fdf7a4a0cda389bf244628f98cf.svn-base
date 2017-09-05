package br.com.qualicorp.redenarede.service.login.interfaces;

import java.io.IOException;

import lumis.doui.service.DouiServiceInterface;
import lumis.portal.PortalException;
import lumis.portal.UnexpectedException;
import lumis.portal.authentication.SessionConfig;
import lumis.portal.serviceinterface.IServiceInterfaceRenderRequest;
import lumis.portal.serviceinterface.IServiceInterfaceRenderResponse;
import lumis.portal.serviceinterface.ServiceInterfaceException;
import lumis.portal.serviceinterfaceinstance.ServiceInterfaceInstanceConfig;
import lumis.portal.transaction.PortalTransactionFactory;
import lumis.portal.user.UserConfig;
import lumis.util.ITransaction;

public class LogoutInterface extends DouiServiceInterface
{
	public void render(IServiceInterfaceRenderRequest request, IServiceInterfaceRenderResponse response) throws ServiceInterfaceException, PortalException
	{
		String userId;
		try
		{
			ITransaction transaction = PortalTransactionFactory.createTransaction();
			try
			{
				transaction.begin();
				userId = request.getSessionConfig().getUserId();
				transaction.commit();
			}
			catch (Exception e)
			{
				transaction.rollback();
				throw e;
			}
			finally
			{
				transaction.close();
			}
		}
		catch (PortalException e)
		{
			throw e;
		}
		catch (Exception e)
		{
			throw new UnexpectedException(e);
		}
		
		
		try
		{
			if(!UserConfig.USER_GUEST_ID.equals(userId))
				super.render(request, response);
			else
				response.getWriter().write("");
		}
		catch(ServiceInterfaceException e)
		{
			throw e;
		}
		catch(IOException e)
		{
			throw new UnexpectedException(e);
		}
	}

	protected String getCustomMenu(SessionConfig sessionConfig, ServiceInterfaceInstanceConfig config, ITransaction transaction) throws PortalException
	{
		return "<item type=\"lum_style\" name=\"STR_STYLE\"/>";
	}
}
