<%@ page contentType="text/xml" import="lumis.service.portalmanagement.importexport.*" %><%
	//$Revision: 14047 $ $Date: 2012-02-16 13:10:14 -0200 (Thu, 16 Feb 2012) $
	response.setHeader("Pragma","no-cache"); 
	response.setHeader("Cache-Control","no-store"); 
	response.setDateHeader("Expires",-1);

	StructureSyncControllerJson structureSyncControllerJson = new StructureSyncControllerJson(request, response);
	structureSyncControllerJson.handleRequest();
%>