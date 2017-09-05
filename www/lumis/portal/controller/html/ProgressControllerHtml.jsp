<%@ page import="lumis.portal.progress.*,lumis.portal.*" %><%
	// $Revision: 9208 $ $Date: 2008-05-06 17:32:25 -0300 (Tue, 06 May 2008) $	
	try
	{
		ProgressControllerHtml progressControllerHtml = new ProgressControllerHtml(request, response);
		progressControllerHtml.handleRequest();
	}
	catch(PortalException e)
	{
		response.getWriter().write("<pre>" + e.getLocalizedMessage() + "\n\n");
		e.printStackTrace(response.getWriter());
		response.getWriter().write("</pre>");
	}
%>