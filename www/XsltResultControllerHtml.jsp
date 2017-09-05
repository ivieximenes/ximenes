<%@ page import="lumis.service.portalmanagement.xsleditor.*" %><%
	// $Revision: 11339 $ $Date: 2010-03-26 19:26:04 -0300 (Fri, 26 Mar 2010) $
	try
	{
		XsltResultControllerHtml xsltResultController = new XsltResultControllerHtml(request, response, pageContext);
		xsltResultController.renderPage();
	}
	catch(Exception e)
	{
		out.print(e.getLocalizedMessage());
	}
%>