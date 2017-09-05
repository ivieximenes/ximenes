<%@ page import="lumis.service.content.wizard.*" errorPage="/error.jsp"%><%
	response.setCharacterEncoding("UTF-8");
	ContentWizardControllerHtml controllerHtml = new ContentWizardControllerHtml(request, response, pageContext);
	controllerHtml.handleRequest();
%>