<%@ page contentType="text/xml" import="lumis.portal.event.*" %><%
	response.setHeader("Pragma","no-cache"); 
	response.setHeader("Cache-Control","no-store"); 
	response.setDateHeader("Expires",-1);

	PortalEventControllerXml portalEventControllerXml = new PortalEventControllerXml(request, response, pageContext);
	portalEventControllerXml.handleRequest();
%>