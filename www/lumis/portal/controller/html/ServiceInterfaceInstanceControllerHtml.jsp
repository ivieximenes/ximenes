<%@page import="lumis.portal.serviceinterfaceinstance.*"%><%
	// $Revision: 9404 $ $Date: 2008-06-12 11:23:24 -0300 (Thu, 12 Jun 2008) $

	ServiceInterfaceInstanceControllerHtml serviceInterfaceInstanceController = new ServiceInterfaceInstanceControllerHtml(request, response, pageContext);
	serviceInterfaceInstanceController.handleRequest();
%>