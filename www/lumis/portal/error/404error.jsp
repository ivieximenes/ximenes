<%@page import="lumis.portal.page.cache.PageCacheControllerHtml" errorPage="/error.jsp"%><%
	// $Revision: 10474 $ $Date: 2009-06-09 20:58:59 -0300 (Tue, 09 Jun 2009) $
	response.setCharacterEncoding("UTF-8");
	response.setStatus(HttpServletResponse.SC_NOT_FOUND);
	PageCacheControllerHtml pageCacheController = new PageCacheControllerHtml(request, response);
	pageCacheController.handleError();
%>