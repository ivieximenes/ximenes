<%@ page import="lumis.content.lock.*" errorPage="error.jsp"%><%// $Revision: 12041 $ $Date: 2010-10-20 16:41:44 -0200 (Wed, 20 Oct 2010) $
	response.setCharacterEncoding("UTF-8");
	LockController loginController = new LockController(request, response, pageContext);
	loginController.changeLock();
%>