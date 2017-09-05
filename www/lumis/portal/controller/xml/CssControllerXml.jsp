<%@ page contentType="text/xml" import="lumis.portal.css.*" %><%
	response.setHeader("Pragma","no-cache"); 
	response.setHeader("Cache-Control","no-store"); 
	response.setDateHeader("Expires",-1);

	CssControllerXml cssController = new CssControllerXml(request, response, pageContext);
	cssController.handleRequest();
%> 