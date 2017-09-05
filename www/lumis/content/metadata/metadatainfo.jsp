<%@ page import="lumis.content.metadata.*" errorPage="error.jsp"%><%
	// $Revision: 14437 $ $Date: 2012-06-27 12:57:23 -0300 (Wed, 27 Jun 2012) $
	// FOR INTERNAL USE ONLY
	response.setCharacterEncoding("UTF-8");
	MetaDataInfoController metaDataInfoController = new MetaDataInfoController(request, response);
	metaDataInfoController.handleRequest();
%>