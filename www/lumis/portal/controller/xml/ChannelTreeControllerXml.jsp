<%@ page contentType="text/xml" import="lumis.portal.channel.tree.*" %><%
	response.setHeader("Pragma","no-cache"); 
	response.setHeader("Cache-Control","no-store"); 
	response.setDateHeader("Expires",-1);

	ChannelTreeControllerXml channelTreeController = new ChannelTreeControllerXml(request, response, pageContext);
	channelTreeController.handleRequest();
%>