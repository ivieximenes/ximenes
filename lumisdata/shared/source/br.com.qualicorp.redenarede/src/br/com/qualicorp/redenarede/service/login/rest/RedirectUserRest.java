package br.com.qualicorp.redenarede.service.login.rest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.core.Context;

@Path("/home")
public class RedirectUserRest {
	
	@GET
	@Path("/redirect")
	public void redirecParaHomeEspecifica(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception {
		
		Boolean isBeneficiario = (Boolean) request.getSession().getAttribute("isBeneficiario");
		Boolean isPrestador = (Boolean) request.getSession().getAttribute("isPrestador");
		
		if(isBeneficiario !=null && isBeneficiario)
			response.sendRedirect("/beneficiario");
		else if(isPrestador !=null && isPrestador)
			response.sendRedirect("/prestador");
		else
			response.sendRedirect("/home.htm");
	}
	
	@GET
	@Path("/login")
	public void redirectParaHomeQuandoLogado(@Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception {
		
		Boolean isBeneficiario = (Boolean) request.getSession().getAttribute("isBeneficiario");
		Boolean isPrestador = (Boolean) request.getSession().getAttribute("isPrestador");
		
		if(isBeneficiario !=null && isBeneficiario)
			response.sendRedirect("/beneficiario");
		else if(isPrestador !=null && isPrestador)
			response.sendRedirect("/prestador");
		else
			return;
	}
}