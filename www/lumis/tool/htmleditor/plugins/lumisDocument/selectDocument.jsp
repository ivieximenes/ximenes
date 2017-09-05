<%@ page import="lumis.service.document.*,lumis.portal.PortalException" errorPage="/error.jsp"%><%
//$Revision: 10707 $ $Date: 2009-07-20 18:47:03 -0300 (Mon, 20 Jul 2009) $
	response.setCharacterEncoding("UTF-8");
	FCKSelectDocumentControllerHtml selectDocumentControllerHtml = new FCKSelectDocumentControllerHtml(request, response, pageContext);
	selectDocumentControllerHtml.handleRequest();
%>