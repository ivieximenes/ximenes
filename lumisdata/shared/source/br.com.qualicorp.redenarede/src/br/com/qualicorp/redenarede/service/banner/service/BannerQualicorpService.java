package br.com.qualicorp.redenarede.service.banner.service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.jsp.PageContext;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;

import br.com.qualicorp.redenarede.service.banner.BannerController;
import lumis.content.service.ContentService;

public class BannerQualicorpService extends ContentService
{
	@Path("/teste123")
	@GET
	@Produces("text/html")
	public void loadBanner(@Context HttpServletRequest request, @Context HttpServletResponse response, @Context PageContext pageContext) throws Exception
	{
		response.setHeader("Pragma","no-cache"); 
		response.setHeader("Cache-Control","no-store"); 
		response.setDateHeader("Expires",-1);

		BannerController bannerController = new BannerController(request, response, pageContext);
		bannerController.handleRequest();
		
		response.getWriter().flush();
	}
	
	/*private void setServiceInstanceId(HttpServletRequest request) throws PortalException {
		
		return request.getServiceInterfaceInstanceId();
		
		if(null == serviceInstanceId){
			ITransaction transaction = PortalTransactionFactory.createTransaction();
			try {
				transaction.begin();
				String serviceInterfaceInstanceId = request.getParameter(PortalRequestParameters.PAGE_PARAMETER_INTERFACE_INST);
				ServiceInterfaceInstanceConfig serviceInterfaceInstanceConfig = ManagerFactory.getServiceInterfaceInstanceManager().get(sessionConfig, serviceInterfaceInstanceId, transaction);
				serviceInstanceId = serviceInterfaceInstanceConfig.getServiceInstanceId();
			} catch (PortalException e) {
				LOGGER.error(e);
				throw e;
			} catch (Exception e) {
				LOGGER.error(e);
				throw new UnexpectedException(e);
			}finally{
				transaction.close();
			}
		}
	}*/
}
