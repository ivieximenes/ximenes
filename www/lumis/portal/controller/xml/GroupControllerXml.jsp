<%@ page contentType="text/xml" import="lumis.portal.group.*" %><%
	response.setHeader("Pragma","no-cache"); 
	response.setHeader("Cache-Control","no-store"); 
	response.setDateHeader("Expires",-1);

	GroupControllerXml groupController = new GroupControllerXml(request, response, pageContext);
	groupController.handleRequest();
%>