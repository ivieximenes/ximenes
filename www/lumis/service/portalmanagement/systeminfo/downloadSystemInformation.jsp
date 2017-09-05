<%@page import="lumis.portal.transaction.ITransaction"%><%@page import="lumis.portal.transaction.PortalTransactionFactory"%><%@page import="java.text.SimpleDateFormat"%><%@page import="java.util.Date"%><%@page import="java.util.Collection"%><%@page import="lumis.portal.serviceinstance.acl.ServiceInstancePermissions"%><%@page import="lumis.portal.manager.ManagerFactory"%><%@page import="lumis.portal.authentication.SessionConfig"%><%@page import="lumis.service.portalmanagement.systeminfo.DataHelper" contentType="plain/text"%><%	
//$Revision: 16824 $ $Date: 2015-01-23 18:49:12 -0200 (Fri, 23 Jan 2015) $	
	Date date = new Date();		
	SimpleDateFormat timestampFormat = new SimpleDateFormat("yyyyMMddHHmm");
	String timestamp = timestampFormat.format(date);
	
	ITransaction transaction = PortalTransactionFactory.createTransaction();
	boolean hasPermission = true;
	String serviceId = "lumis.service.portalmanagement.systeminfo";
	
	try
	{
		transaction.begin();		
		
		// gets the instance id
		Collection<String> listServiceInstanceIds = ManagerFactory.getServiceInstanceManager().getIdsByServiceId(SessionConfig.getCurrentSessionConfig(), serviceId, transaction);
		String serviceInstanceId = listServiceInstanceIds.iterator().next();
		
		// gets the service permissions
		ServiceInstancePermissions permissions = ManagerFactory.getServiceInstanceAclManager().getPermissions(SessionConfig.getCurrentSessionConfig(), serviceId, transaction);
		
		// checks if the user has permission to see the service instance
		hasPermission = ManagerFactory.getServiceInstanceAclManager().checkPermission(SessionConfig.getCurrentSessionConfig(), serviceInstanceId, permissions.VIEW_SERVICE_INSTANCE, transaction);
		transaction.commit();
	}
	finally
	{
		transaction.close();
	}
		
	if (hasPermission) {
		response.addHeader("content-disposition", "attachment; filename=systeminformation_" + timestamp + ".txt");
%><%=DataHelper.obtainAllInformationAsString()%><%		
	} else {
		response.sendError(HttpServletResponse.SC_FORBIDDEN);	
	}
%>