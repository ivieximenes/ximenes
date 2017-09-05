<%@ page contentType="text/xml" import="lumis.portal.serviceinterface.list.*" %><%
	response.setHeader("Pragma","no-cache"); 
	response.setHeader("Cache-Control","no-store"); 
	response.setDateHeader("Expires",-1);

	ServiceInterfaceListControllerXml serviceInterfaceListController = new ServiceInterfaceListControllerXml(request, response, pageContext);
	serviceInterfaceListController.handleRequest();
%>