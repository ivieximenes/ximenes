<%@ page contentType="text/xml" import="lumis.portal.page.template.*" %><%
	response.setHeader("Pragma","no-cache"); 
	response.setHeader("Cache-Control","no-store"); 
	response.setDateHeader("Expires",-1);

	PageTemplateControllerXml pageTemplateController = new PageTemplateControllerXml(request, response, pageContext);
	pageTemplateController.handleRequest();
%>