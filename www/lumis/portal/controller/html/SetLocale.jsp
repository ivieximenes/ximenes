<%@ page import="lumis.portal.localization.*" errorPage="../../../../error.jsp"%><%
	// $Revision: 7314 $ $Date: 2007-06-08 18:51:13 -0300 (Fri, 08 Jun 2007) $	
	response.setCharacterEncoding("UTF-8");
	LocalizationControllerHtml localizationController = new LocalizationControllerHtml(request, response);
	localizationController.handleSetLocaleRequest();
%>