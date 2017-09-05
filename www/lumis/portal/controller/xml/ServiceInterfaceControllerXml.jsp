<%@ page contentType="text/xml" import="lumis.portal.serviceinterface.*" %><%
	response.setHeader("Pragma","no-cache"); 
	response.setHeader("Cache-Control","no-store"); 
	response.setDateHeader("Expires",-1);

	ServiceInterfaceControllerXml serviceInterfaceController = new ServiceInterfaceControllerXml(request, response, pageContext);
	serviceInterfaceController.handleRequest();
%>