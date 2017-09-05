<%-- $Revision: 10364 $ $Date: 2009-04-15 19:24:32 -0300 (Wed, 15 Apr 2009) $ --%>
<%@ page isErrorPage="true" %>
<%
	String frameworkUrl = request.getRequestURL().toString();
	final String thisJspName = "error.jsp";
	int errorIndex = frameworkUrl.indexOf(thisJspName);
	if(errorIndex > 0)
		frameworkUrl = frameworkUrl.substring(0, errorIndex-1);

	request.setAttribute("exception", exception);
	request.setAttribute("frameworkUrl", frameworkUrl);
%><jsp:forward page="/lumis/portal/error/defaultErrorPage.jsp"/>