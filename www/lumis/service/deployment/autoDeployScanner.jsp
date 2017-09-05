<%@page import="lumis.portal.deployment.AutoDeployScannerControllerHtml"%><%@ page import="lumis.portal.file.*" errorPage="/error.jsp"%><%
	// $Revision: 15728 $ $Date: 2013-08-08 09:49:43 -0300 (Thu, 08 Aug 2013) $
	AutoDeployScannerControllerHtml autoDeployScannerControllerHtml = new AutoDeployScannerControllerHtml(request, response);
	autoDeployScannerControllerHtml.handlerRequest();
%>