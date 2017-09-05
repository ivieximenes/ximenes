<%@ page import="lumis.upgrade.*" errorPage="../../error.jsp"%><%
	response.setCharacterEncoding("UTF-8");
	UpgradeControllerHtml upgradeController = new UpgradeControllerHtml(request, response, pageContext);
	upgradeController.rebuildLumisAdministration();
%>