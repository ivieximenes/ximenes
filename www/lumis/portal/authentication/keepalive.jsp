<%@ page contentType="text/xml" import="lumis.portal.authentication.SessionKeepAliveControllerXml" %><%
	// $Revision: 4115 $ $Date: 2006-08-29 14:05:47 -0300 (Tue, 29 Aug 2006) $
	response.setHeader("Pragma","no-cache"); 
	response.setHeader("Cache-Control","no-store"); 
	response.setDateHeader("Expires",-1);

	SessionKeepAliveControllerXml controller = new SessionKeepAliveControllerXml(request, response, pageContext);
	controller.keepAlive();
%>