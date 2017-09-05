package br.com.qualicorp.redenarede.service.banner.service;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import br.com.qualicorp.redenarede.service.banner.BannerController;

public class BannerQualicorpServlet extends HttpServlet
{
	private static final long serialVersionUID = 1L;

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		try
		{
			response.setHeader("Pragma", "no-cache"); 
			response.setHeader("Cache-Control", "no-store"); 
			response.setDateHeader("Expires", -1);
	
			BannerController bannerController = new BannerController(request, response, null);
			bannerController.handleRequest();
			
			response.getWriter().flush();
		}
		catch (Exception e)
		{
			throw new ServletException(e);
		}
	}
}