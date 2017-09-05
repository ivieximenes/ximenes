<%@ page import="lumis.doui.control.htmleditor.*,lumis.portal.PortalException" errorPage="/error.jsp"%><%
	response.setCharacterEncoding("UTF-8");
%>
<%--
<html>
<body>
<a href="#" onClick="f();return false;">SELECIONA</a>
<script>function f() {opener.LumisContentLinkCommand.callbackFunction('title', 'url'); top.close();}</script>
</body>
</html>
--%>
<%
	FCKSelectContentControllerHtml selectContentControllerHtml = new FCKSelectContentControllerHtml(request, response, pageContext);
	try
	{
		selectContentControllerHtml.handleRequest();
	}
	catch (PortalException e)
	{
%>
<html>
<body>
	<script type="text/javascript" src="../../../../portal/client/script/LumisPortal.js"></script>
	<script>
		alert("<%=e.getLocalizedMessage()%>");
		LumisPortal.closeInterfaceInstance();
	</script>
</body>
</html>
<%		
	}
%>
