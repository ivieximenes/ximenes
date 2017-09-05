<%@ page contentType="text/html" import="lumis.service.banner.*" %><%
	response.setHeader("Pragma","no-cache"); 
	response.setHeader("Cache-Control","no-store"); 
	response.setDateHeader("Expires",-1);

	BannerController bannerController = new BannerController(request, response, pageContext);
	bannerController.handleRequest();
%>