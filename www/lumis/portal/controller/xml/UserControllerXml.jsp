<%@ page contentType="text/xml" import="lumis.portal.user.*" %><%
	response.setHeader("Pragma","no-cache"); 
	response.setHeader("Cache-Control","no-store"); 
	response.setDateHeader("Expires",-1);

	UserControllerXml userController = new UserControllerXml(request, response, pageContext);
	userController.handleRequest();
%>