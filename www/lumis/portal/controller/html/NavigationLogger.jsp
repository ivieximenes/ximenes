<%@ page import="lumis.util.log.*" errorPage="../../../../error.jsp"%><%
	response.setCharacterEncoding("UTF-8");
	NavigationLoggerControllerHtml navigationLoggerController = new NavigationLoggerControllerHtml(request, response, pageContext);
	navigationLoggerController.handleRequest();
%>