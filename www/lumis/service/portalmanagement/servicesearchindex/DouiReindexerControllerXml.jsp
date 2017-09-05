<%@ page contentType="text/xml" import="lumis.service.portalmanagement.servicesearchindex.*" %><%// $Revision: 4588 $ $Date: 2006-09-28 11:32:50 -0300 (Thu, 28 Sep 2006) $
	response.setHeader("Pragma","no-cache"); 
	response.setHeader("Cache-Control","no-store"); 
	response.setDateHeader("Expires",-1);

	DouiReindexerControllerXml douiReindexerControllerXml = new DouiReindexerControllerXml(request, response, pageContext);
	douiReindexerControllerXml.handleRequest();%>