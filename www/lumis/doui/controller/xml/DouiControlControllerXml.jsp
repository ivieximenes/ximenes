<%@ page contentType="text/xml" import="lumis.doui.controller.xml.*" %><%
	response.setHeader("Pragma","no-cache"); 
	response.setHeader("Cache-Control","no-store"); 
	response.setDateHeader("Expires",-1);

	DouiControlControllerXml douiControlControllerXml = new DouiControlControllerXml(request, response, pageContext);
	douiControlControllerXml.handleRequest();
%>