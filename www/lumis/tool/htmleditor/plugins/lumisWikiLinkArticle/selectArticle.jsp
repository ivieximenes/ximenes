<%@ page import="lumis.service.wiki.*,lumis.portal.PortalException"%><%
// $Revision: 9865 $ $Date: 2008-10-29 17:00:03 -0200 (Wed, 29 Oct 2008) $
	response.setCharacterEncoding("UTF-8");
	FCKSelectArticleControllerHtml selectArticleControllerHtml = new FCKSelectArticleControllerHtml(request, response, pageContext);
	selectArticleControllerHtml.handleRequest();
%>