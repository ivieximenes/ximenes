<%@ page import="lumis.portal.presentation.*" errorPage="error.jsp"%><%
	response.setCharacterEncoding("UTF-8");
	PresentationControllerHtml presentationController = new PresentationControllerHtml(request, response, pageContext);
	presentationController.renderPage();
%>