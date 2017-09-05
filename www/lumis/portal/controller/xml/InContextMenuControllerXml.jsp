<%@ page contentType="text/xml" import="lumis.portal.incontextedit.*" %><%
	// $Revision: 13251 $ $Date: 2011-07-15 12:48:42 -0300 (Fri, 15 Jul 2011) $
	InContextEditControllerXml inContextEditController = new InContextEditControllerXml(request, response, pageContext);
	inContextEditController.handleRequest();
%>