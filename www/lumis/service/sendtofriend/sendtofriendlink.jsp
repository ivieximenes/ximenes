<%@ page contentType="text/html" import="lumis.service.sendtofriend.*" %><%
	// $Revision: 9404 $ $Date: 2008-06-12 11:23:24 -0300 (Thu, 12 Jun 2008) $

	response.setHeader("Pragma","no-cache"); 
	response.setHeader("Cache-Control","no-store"); 
	response.setDateHeader("Expires",-1);
	response.setCharacterEncoding("UTF-8");
	
	SendToFriendControllerHtml controllerHtml = new SendToFriendControllerHtml(request, response);
	controllerHtml.handleLinkRequest();
%>