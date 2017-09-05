<%@ page contentType="text/xml" import="lumis.portal.page.*" %><%
	response.setHeader("Pragma","no-cache"); 
	response.setHeader("Cache-Control","no-store"); 
	response.setDateHeader("Expires",-1);

	PageControllerXml pageController = new PageControllerXml(request, response, pageContext);
	pageController.handleRequest();
%>