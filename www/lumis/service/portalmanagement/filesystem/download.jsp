<%@ page import="lumis.service.portalmanagement.filesystem.FileDownloadControllerHtml" %><%
	// $Revision: 5515 $ $Date: 2007-01-03 15:15:05 -0200 (Wed, 03 Jan 2007) $
	FileDownloadControllerHtml downloadController = new FileDownloadControllerHtml(request, response);
	downloadController.handleRequest();
%>