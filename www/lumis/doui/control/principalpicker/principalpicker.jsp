<%@ page import="lumis.doui.control.principalpicker.PrincipalControllerHtml" errorPage="error.jsp"%><%
	// $Revision: 14728 $ $Date: 2012-09-21 09:39:26 -0300 (Fri, 21 Sep 2012) $
	// FOR INTERNAL USE ONLY
	response.setCharacterEncoding("UTF-8");
	PrincipalControllerHtml principalControllerHtml = new PrincipalControllerHtml(request, response);
	principalControllerHtml.handleRequest();
%>