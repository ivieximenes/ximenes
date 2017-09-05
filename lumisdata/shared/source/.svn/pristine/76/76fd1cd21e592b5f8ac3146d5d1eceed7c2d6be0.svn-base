package br.com.qualicorp.redenarede.service.administracaoestipulante.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.json.simple.JSONObject;

import br.com.qualicorp.redenarede.commons.csv.CSVUtils;
import br.com.qualicorp.redenarede.commons.exceptions.ManageGSPException;
import br.com.qualicorp.redenarede.commons.utils.FileUtils;
import br.com.qualicorp.redenarede.commons.utils.StringUtils;
import br.com.qualicorp.redenarede.service.administracaoestipulante.manager.EstipulanteManager;
import br.com.qualicorp.redenarede.service.administracaoestipulante.to.EstipulanteImporterCSV;
import br.com.qualicorp.redenarede.service.useraccount.manager.BeneficiarioManager;
import lumis.doui.service.DouiService;
import lumis.portal.PortalException;
import lumis.portal.authentication.SessionConfig;
import lumis.portal.manager.ManagerException;
import lumis.portal.manager.ManagerFactory;
import lumis.portal.transaction.ITransaction;
import lumis.portal.transaction.PortalTransactionFactory;
import lumis.portal.user.UserConfig;
import lumis.util.log.ILogger;
import lumis.util.log.LoggerFactory;

public class EstipulanteDouiService extends DouiService
{
	private static final String ERRO_INESPERADO_NENHUMA_LINHA_FOI_PROCESSADA = "Erro inesperado! Nenhuma linha foi processada!";
	private static ILogger logger = LoggerFactory.getLogger(EstipulanteDouiService.class);
	
	@SuppressWarnings("unchecked")
	@Path("/estupulante-rest/beneficiario/associar-csv")
	@POST
	@Produces({MediaType.APPLICATION_JSON})
	public Response getEnderecoByCep(@Context HttpServletRequest request, @FormParam("arquivo") String arquivoURL, @FormParam("charset") String charset, @FormParam("useHeader") String useHeaderStr)
	{
		JSONObject dataReturn = new JSONObject();
		
		boolean useHeader = useHeaderStr != null && ( "true".equals(useHeaderStr.toLowerCase()) || "1".equals(useHeaderStr.toLowerCase()));
		
		List<EstipulanteImporterCSV> tos;
		
		try
		{
			tos = getEstipulantesImporterCSV(arquivoURL, useHeader, charset);
		}
		catch (IOException e)
		{
			dataReturn.put("msg", ERRO_INESPERADO_NENHUMA_LINHA_FOI_PROCESSADA);
			logger.error("Erro in " + request.getRequestURL(), e);
			return Response.ok(dataReturn.toJSONString()).build();
		}
		catch (ManageGSPException e)
		{
			dataReturn.put("msg", ERRO_INESPERADO_NENHUMA_LINHA_FOI_PROCESSADA);
			logger.error("Erro in " + request.getRequestURL(), e);
			return Response.ok(dataReturn.toJSONString()).build();
		}
		
		List<EstipulanteImporterCSV> erros = new ArrayList<EstipulanteImporterCSV>();;
		
		SessionConfig sessionConfigAdmin;
		try
		{
			sessionConfigAdmin = ManagerFactory.getAuthenticationManager().impersonate(UserConfig.USER_SYSTEM_ID);
		}
		catch (PortalException e)
		{
			dataReturn.put("msg", ERRO_INESPERADO_NENHUMA_LINHA_FOI_PROCESSADA);
			logger.error("Erro in " + request.getRequestURL(), e);
			return Response.ok(dataReturn.toJSONString()).build();
		}
		
		try
		{
			for (EstipulanteImporterCSV to : tos)
			{
				associate(to, erros, sessionConfigAdmin);
			}
		}
		finally
		{
			try
			{
				ManagerFactory.getAuthenticationManager().endImpersonation(sessionConfigAdmin);
			}
			catch (PortalException e)
			{
				logger.error("Erro in " + request.getRequestURL(), e);
			}
		}
		
		if (erros.isEmpty())
		{
			dataReturn.put("msg", "Cadastro totalmente realizado com sucesso!");
		}
		else
		{
			try
			{
				dataReturn.put("fileLineErros", CSVUtils.parse(erros, useHeader));
				dataReturn.put("msg", "Nem todas as linhas foram importadas com sucesso! Será feito o download das linhas pendentes com erros!");
			}
			catch (IllegalAccessException e)
			{
				dataReturn.put("msg", "Erro inesperado!");
			}
		}
		
		return Response.ok(dataReturn.toJSONString()).build();
	}
	
	private void associate(EstipulanteImporterCSV to, List<EstipulanteImporterCSV> erros, SessionConfig sessionConfigAdmin)
	{
		ITransaction transaction = PortalTransactionFactory.createTransaction();
		
		try
		{
			transaction.begin();
			
			if (to.getCodigoCarteirinha() != null)
				to.setCodigoCarteirinha(to.getCodigoCarteirinha().replaceAll("[^0-9]", ""));
			
			validateImport(to, sessionConfigAdmin, transaction);
			
			if (!StringUtils.isBlankOrNull(to.getErros()))
			{
				erros.add(to);
				return;
			}
			
			String userId = ManagerFactory.getUserManager().getUserIdByLogin(sessionConfigAdmin, to.getCodigoCarteirinha(), transaction);
			
			EstipulanteManager.getInstance().associate(userId, to.getCodigoEstipulante(), to.getCodigoSubestipulante(), sessionConfigAdmin, transaction);
			
			transaction.commit();
		}
		catch (Exception e)
		{
			logger.error(e.getMessage() + " para: " + to.toStringLitle(), e);
			to.appendError(e.getMessage());
			erros.add(to);
			return;
		}
		finally
		{
			transaction.close();
		}
	}
	
	private void validateImport(EstipulanteImporterCSV to, SessionConfig sessionConfig, lumis.util.ITransaction transaction) throws ManagerException, PortalException
	{
		if (StringUtils.isBlankOrNull(to.getCodigoCarteirinha()))
		{
			to.appendError("Código da Carteira vazia!");
		}
		else if (!BeneficiarioManager.getInstance().existsCodigoCarteiraInSystem(to.getCodigoCarteirinha()))
		{
			to.appendError("Não existe um beneficiário com o Código da Carteira no sistema!");
		}
		
		if (StringUtils.isBlankOrNull(to.getCodigoEstipulante()))
			to.appendError("Código do Estipulante vazio!");

		if (StringUtils.isBlankOrNull(to.getCodigoSubestipulante()))
			to.appendError("Código do Subestipulante vazio!");
		
		if (!StringUtils.isBlankOrNull(to.getCodigoEstipulante()) && !StringUtils.isBlankOrNull(to.getCodigoSubestipulante()))
		{
			if (!EstipulanteManager.getInstance().existsSubEstipulante(to.getCodigoEstipulante(), to.getCodigoSubestipulante()))
			{
				to.appendError("Não existe o Subestipulante no sistema!");
			}
		}
		
		if (StringUtils.isBlankOrNull(to.getErros()))
		{
			String imporGroupAlias = EstipulanteManager.getInstance().makeAliasGroup(to.getCodigoEstipulante(), to.getCodigoSubestipulante());
			
			String userId = ManagerFactory.getUserManager().getUserIdByLogin(sessionConfig, to.getCodigoCarteirinha(), transaction);
			
			Collection<String> groupsId = ManagerFactory.getGroupManager().getMemberGroups(sessionConfig, userId, true, transaction);
			
			for (String groupId : groupsId)
			{
				String groupAlias = ManagerFactory.getGroupManager().get(sessionConfig, groupId, transaction).getAlias();
				
				if (EstipulanteManager.getInstance().isAliasGroupEstipulante(groupAlias) && !groupAlias.equals(imporGroupAlias))
				{
					to.appendError("O beneficiário já está associado ao estipulante: " + groupAlias + "!");
					break;
				}
			}
		}
	}
	
	
	private List<EstipulanteImporterCSV> getEstipulantesImporterCSV(String arquivoURL, boolean useHeader, String charset) throws IOException, ManageGSPException
	{
		BufferedReader br = null;
		InputStream is = FileUtils.getByteArrayInputStream(arquivoURL);
		
		try
		{
			try
			{
				br = new BufferedReader(new InputStreamReader(is));
				
				int firstLine = 0;
				
				if (useHeader)
					firstLine = 1;
				
				if (StringUtils.isBlankOrNull(charset))
					charset = "ISO-8859-1";
				
				return CSVUtils.parse(br, firstLine, EstipulanteImporterCSV.class, charset);
			}
			finally
			{
				if (br != null)
					br.close();
			}
		}
		finally
		{
			if (is != null)
				is.close();
		}
	}
}