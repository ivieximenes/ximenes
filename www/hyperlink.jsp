<%@ page import="lumis.portal.hyperlink.*" errorPage="error.jsp"%><%
	HyperLinkControllerHtml hyperLinkController = new HyperLinkControllerHtml(request, response, pageContext);
	hyperLinkController.hyperLink();
%>