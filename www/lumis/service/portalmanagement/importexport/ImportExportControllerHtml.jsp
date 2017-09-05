<%@page import="lumis.service.portalmanagement.importexport.ImportExportControllerHtml" contentType="text/html; charset=UTF-8"%><%
	// $Revision: 14164 $ $Date: 2012-03-30 12:49:06 -0300 (Fri, 30 Mar 2012) $
	response.setHeader("Pragma","no-cache"); 
	response.setHeader("Cache-Control","no-store"); 
	response.setDateHeader("Expires",-1);
	new ImportExportControllerHtml(request, response).handle();
%>