<%@ page contentType="text/xml" import="lumis.portal.channel.*" %><%
	response.setHeader("Pragma","no-cache"); 
	response.setHeader("Cache-Control","no-store"); 
	response.setDateHeader("Expires",-1);

	ChannelControllerXml channelController = new ChannelControllerXml(request, response, pageContext);
	channelController.handleRequest();
%>