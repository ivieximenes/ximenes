<%@ page contentType="text/xml" import="lumis.portal.service.*" %><%
	response.setHeader("Pragma","no-cache"); 
	response.setHeader("Cache-Control","no-store"); 
	response.setDateHeader("Expires",-1);

	ServiceControllerXml serviceController = new ServiceControllerXml(request, response, pageContext);
	serviceController.handleRequest();
%>