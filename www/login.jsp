<%@ page import="lumis.portal.authentication.*" errorPage="error.jsp"%><%
	// $Revision: 9404 $ $Date: 2008-06-12 11:23:24 -0300 (Thu, 12 Jun 2008) $
	
	response.setCharacterEncoding("UTF-8");
	LoginControllerHtml loginController = new LoginControllerHtml(request, response, pageContext);
	loginController.handleRequest();
%>