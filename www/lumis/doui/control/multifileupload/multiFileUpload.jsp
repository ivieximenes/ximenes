<%@page import="lumis.doui.control.multifileupload.MultiFileUploadControllerHtml"%><%@ page import="lumis.portal.file.*" errorPage="/error.jsp"%><%// $Revision: 13264 $ $Date: 2011-07-27 14:36:14 -0300 (Wed, 27 Jul 2011) $
	MultiFileUploadControllerHtml multiFileUploadControllerHtml = new MultiFileUploadControllerHtml(request, response);
	multiFileUploadControllerHtml.handleRequest();%>