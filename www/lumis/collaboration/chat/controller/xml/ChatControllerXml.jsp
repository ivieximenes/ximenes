<%@ page contentType="text/xml" import="lumis.collaboration.chat.*" %><%
	// $Revision: 3760 $ $Date: 2006-07-27 18:37:42 -0300 (Thu, 27 Jul 2006) $
	response.setHeader("Pragma","no-cache"); 
	response.setHeader("Cache-Control","no-store"); 
	response.setDateHeader("Expires",-1);

	ChatControllerXml ChatController = new ChatControllerXml(request, response, pageContext);
	ChatController.handleRequest();
%>