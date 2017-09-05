package br.com.qualicorp.redenarede.service.auditoria.service;

import br.com.qualicorp.redenarede.commons.utils.StringUtils;
import lumis.content.ContentManagerFactory;
import lumis.content.core.Content;
import lumis.doui.service.DouiAdministrationListServiceInterface;
import lumis.portal.PortalException;
import lumis.portal.authentication.SessionConfig;
import lumis.portal.manager.ManagerFactory;
import lumis.portal.service.ServiceConfig;
import lumis.portal.serviceinstance.ServiceInstanceConfig;
import lumis.portal.serviceinterface.IServiceInterfaceRenderRequest;
import lumis.portal.serviceinterface.IServiceInterfaceRenderResponse;
import lumis.portal.serviceinterface.ServiceInterfaceException;
import lumis.portal.transaction.PortalTransactionFactory;
import lumis.util.ITransaction;

public class AuditoriaAdminListInterface extends DouiAdministrationListServiceInterface
{
	private static final String PARAM_ITEM_ID = "adminList.filters.itemId.value";
	private static final String PARAM_INSTANCE_ID = "instanceId";
	private static final String PARAM_INSTANCE_NAME = "adminList.filters.instanceName.value";
	private static final String PARAM_SERVICE_NAME = "adminList.filters.serviceName.value";
	
	@Override
	public void render(IServiceInterfaceRenderRequest request, IServiceInterfaceRenderResponse response) throws ServiceInterfaceException, PortalException
	{
		ITransaction transaction = null;

		try
		{
			transaction = PortalTransactionFactory.createTransaction();
			
			transaction.begin();
			
			fillExternItemIdParam(request);
			fillExternServiceInfosParam(request, transaction);
			
			transaction.commit();
		}
		finally
		{
			if (transaction != null)
				transaction.close();
		}
		
		super.render(request, response);
	}
	
	private void fillExternItemIdParam(IServiceInterfaceRenderRequest request)
	{
		String[] filterItemIdParam = request.getParameterMap().get(PARAM_ITEM_ID);
		
		if (filterItemIdParam != null && filterItemIdParam.length != 0 && !StringUtils.isBlankOrNull(filterItemIdParam[0]))
		{
			String itemId = filterItemIdParam[0];
			
			if (!StringUtils.isBlankOrNull(itemId))
			{
				Content content = null;
				
				try
				{
					content = ContentManagerFactory.getContentManager().getContentByItemId(itemId);
				}
				catch(Exception e)
				{
					//Se não achou, não é um content! E não é obrigado a ser!
				}
				
				if (content != null)
				{
					itemId = content.getId();
				}
			}
			
			filterItemIdParam[0] = itemId;
		}
	}
	
	private void fillExternServiceInfosParam(IServiceInterfaceRenderRequest request, ITransaction transaction)
	{
		String[] filterItemIdParam = request.getParameterMap().get(PARAM_INSTANCE_ID);
		
		if (filterItemIdParam != null && filterItemIdParam.length != 0 && !StringUtils.isBlankOrNull(filterItemIdParam[0]))
		{
			String serviceId = filterItemIdParam[0];
			
			if (!StringUtils.isBlankOrNull(serviceId))
			{
				try
				{
					ServiceInstanceConfig siConfig = ManagerFactory.getServiceInstanceManager().get(serviceId, transaction);
					putParameterValue(request, PARAM_INSTANCE_NAME, siConfig.getName());
					
					
					ServiceConfig sConfig = ManagerFactory.getServiceManager().get(SessionConfig.getCurrentSessionConfig(), siConfig.getServiceId(), transaction);
					putParameterValue(request, PARAM_SERVICE_NAME, sConfig.getName());
				}
				catch(PortalException e)
				{
					//Se não achou, não é um content! E não é obrigado a ser!
				}
			}
		}
	}
	
	private void putParameterValue(IServiceInterfaceRenderRequest request, String paramName, String value)
	{
		String[] values = request.getParameterMap().get(paramName);
		
		if (values != null && values.length != 0 && !StringUtils.isBlankOrNull(values[0]))
		{
			values[0] = value;
		}
	}
}