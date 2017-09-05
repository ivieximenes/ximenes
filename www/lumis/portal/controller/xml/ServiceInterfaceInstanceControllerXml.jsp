<%@ page contentType="text/xml" import="lumis.portal.serviceinterfaceinstance.*" %><%
	response.setHeader("Pragma","no-cache"); 
	response.setHeader("Cache-Control","no-store"); 
	response.setDateHeader("Expires",-1);

	ServiceInterfaceInstanceControllerXml serviceInterfaceInstanceController = new ServiceInterfaceInstanceControllerXml(request, response, pageContext);
	serviceInterfaceInstanceController.handleRequest();
%>