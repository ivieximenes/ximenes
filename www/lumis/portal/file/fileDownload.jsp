<%@ page import="lumis.portal.file.*" errorPage="/error.jsp"%><%
	// $Revision: 4292 $ $Date: 2006-09-06 18:56:19 -0300 (Wed, 06 Sep 2006) $
	FileDownloadControllerHtml downloadController = new FileDownloadControllerHtml(request, response);
	downloadController.handleRequest();
%>