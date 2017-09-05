<%@ page contentType="text/xml" import="lumis.doui.contenttree.*" %><%
	response.setHeader("Pragma","no-cache"); 
	response.setHeader("Cache-Control","no-store"); 
	response.setDateHeader("Expires",-1);

	DouiContentTreeControllerXml douiContentTreeControllerXml = new DouiContentTreeControllerXml(request, response, pageContext);
	douiContentTreeControllerXml.handleRequest();
%>