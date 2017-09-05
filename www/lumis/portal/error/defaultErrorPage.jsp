<%-- $Revision: 15950 $ $Date: 2013-10-28 16:08:43 -0200 (Mon, 28 Oct 2013) $ --%>
<%--
Attributes used:
exception - the exception that is shown, if specified
frameworkUrl - the url for the portal framework. Used as prefix in urls in this jsp.
--%>
<%@ page import="lumis.util.PortalUtil,lumis.portal.*,lumis.util.CookieUtil,lumis.portal.manager.ManagerFactoryInternal,lumis.portal.website.IWebsiteBaseURL" %>
<%@ taglib uri="/WEB-INF/lumis/tld/lum.tld" prefix="lum" %>
<lum:addResource path="lumis/portal/error/strings/strings"/>
<%
	String frameworkUrl = (String)request.getAttribute("frameworkUrl");
	if (frameworkUrl == null)
	{
		IWebsiteBaseURL baseURL = ManagerFactoryInternal.getWebsiteManager().getWebsiteBaseURL(request);
 		if(baseURL != null)
 		{
 			frameworkUrl = baseURL.toString();
 			if(frameworkUrl.indexOf("://") == -1)
 				frameworkUrl = (request.isSecure() ? "https://" : "http://") + frameworkUrl;
 		}
 		else
 		{
 			String path = request.getRequestURI();

 			int indexOfAppRequestedPath = path.lastIndexOf(lumis.portal.servlet.ServletUtil.getApplicationRequestedPath(request));
 			if (indexOfAppRequestedPath != -1)
 				path = path.substring(0, indexOfAppRequestedPath);
 			else
 				path = request.getContextPath();
 			
 			frameworkUrl = "http" + (request.isSecure() ? "s" : "") + "://" + request.getServerName() + ":" + request.getServerPort() + path;
 		}
	}

	Throwable exception = (Throwable)request.getAttribute("exception");
	if (exception instanceof InvalidSessionException)
	{
		// redirect to login. After login it will be automatically redirected back to the original uri
		String queryString = "";
		if (request.getQueryString() != null)
			queryString = "?" + request.getQueryString();
	
		String originalAddress = request.getAttribute("javax.servlet.error.request_uri") + queryString;
		CookieUtil.setCookie(request, response, "lumRequestedPage", originalAddress);
		response.sendRedirect(frameworkUrl + "/login.jsp");
		return;	
	}
	
	if(PortalContext.getErrorPage() != null)
	{
		request.getRequestDispatcher("/" + PortalContext.getErrorPage()).forward(request, response);

		return;
	}
	
	if(exception instanceof PageNotFoundException)
	{
		response.setStatus(404);
	}
%>
<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
		<title>Website Error</title>
		<link href="<%=frameworkUrl%>/lumis/portal/client/stylesheet/error.css" rel="stylesheet" type="text/css" />
		<script type="text/javascript" src="<%=frameworkUrl%>/lumis/tool/jquery/jquery.js"></script>
	</head>
	<body>		
		<div id="erro-wrapper" class="logged-error">
			<span class="logo-lumisportal">Lumis Portal</span>
			<h2 id="warning-error-title"><lum:message key="STR_SOMETHING_HAPPEN"/></h2>
			<h3 id="warning-error-message"><lum:message key="STR_PROCESSING_ERROR"/></h3>
			<br/>
			<%
					if (exception != null)
						out.print(PortalUtil.getExceptionDetailsHtml(exception, request));
			%>
		</div>
	</body>
</html>