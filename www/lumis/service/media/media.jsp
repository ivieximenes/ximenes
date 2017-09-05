<%@ page contentType="application/json" import="lumis.service.media.*" %><%
	// $Revision: 14828 $ $Date: 2012-10-17 17:54:11 -0300 (Wed, 17 Oct 2012) $
	MediaControllerJson mediaControllerJson = new MediaControllerJson(request, response);
	mediaControllerJson.handleRequest();
%>