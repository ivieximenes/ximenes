<%@ page contentType="text/xml" import="lumis.portal.channel.template.*" %><%
	response.setHeader("Pragma","no-cache"); 
	response.setHeader("Cache-Control","no-store"); 
	response.setDateHeader("Expires",-1);

	ChannelTemplateControllerXml channelTemplateController = new ChannelTemplateControllerXml(request, response, pageContext);
	channelTemplateController.handleRequest();
%>