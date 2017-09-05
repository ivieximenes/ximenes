<%@ page contentType="text/xml" import="lumis.content.workflow.*" %><%
	response.setHeader("Pragma","no-cache"); 
	response.setHeader("Cache-Control","no-store"); 
	response.setDateHeader("Expires",-1);

	WorkflowControllerXml workflowControllerXml = new WorkflowControllerXml(request, response, pageContext);
	workflowControllerXml.handleRequest();
%>