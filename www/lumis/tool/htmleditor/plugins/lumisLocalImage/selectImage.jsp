<%@ page import="lumis.service.media.*,lumis.portal.PortalException" errorPage="/error.jsp"%><%
// $Revision: 14366 $ $Date: 2012-06-06 17:54:33 -0300 (Wed, 06 Jun 2012) $
	response.setCharacterEncoding("UTF-8");
	FCKSelectMediaControllerHtml selectMediaControllerHtml = new FCKSelectMediaControllerHtml(request, response, pageContext);
	selectMediaControllerHtml.handleRequest();
%>