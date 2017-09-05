package br.com.qualicorp.redenarede.service.useraccount.rs;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.json.simple.JSONObject;

import br.com.qualicorp.redenarede.service.useraccount.manager.BeneficiarioManager;
import br.com.qualicorp.redenarede.service.useraccount.to.BeneficionarioTO;
import br.com.qualicorp.redenarede.webservice.manager.BeneficiarioWebServiceManager;
import br.com.qualicorp.redenarede.webservice.stub.beneficiario.AtualizarBeneficiarioResponse;
import lumis.portal.PortalException;
import lumis.portal.authentication.SessionConfig;
import lumis.portal.transaction.ITransaction;
import lumis.portal.transaction.PortalTransactionFactory;
import lumis.util.log.ILogger;
import lumis.util.log.LoggerFactory;

@Path("/beneficiario-rest")
public class BeneficiarioRestService
{
	private static ILogger logger = LoggerFactory.getServiceLogger("gsp.WebService");
	
	@POST
	@Path("/finish-add")
	@Consumes(MediaType.APPLICATION_JSON + ";charset=UTF-8")
	@Produces(MediaType.APPLICATION_JSON + ";charset=UTF-8")
	@SuppressWarnings({ "unchecked"})
    public Response finishAdd(BeneficionarioTO requestTO, @Context HttpServletRequest request, @Context HttpServletResponse response) throws PortalException, Exception
    {
		JSONObject json = new JSONObject();
		
        ITransaction transaction =  PortalTransactionFactory.createTransaction();
        
        try
        {
            transaction.begin();
            
            requestTO.setUserId(SessionConfig.getCurrentSessionConfig().getUserId());
            requestTO.setNumeroCarteira( requestTO.getNumeroCarteira().replaceAll("[^0-9]", "") );
            
            BeneficionarioTO beneficiarioOld = BeneficiarioManager.getInstance().getInSessionBeneficiarios(requestTO.getNumeroCarteira(), request);
            
            if (beneficiarioOld == null || !BeneficiarioManager.getInstance().isBeneficiarioAddedInSession(beneficiarioOld, request))
            {
            	json.put("error", "Você não tem permissão para realizar esta operação!");
            	
            	return Response.ok( json.toJSONString() ).build();
            }
            
            beneficiarioOld.setTelefone(requestTO.getTelefone());
            beneficiarioOld.setEmail(requestTO.getEmail());
            
            BeneficiarioManager.getInstance().cadastrar(beneficiarioOld, transaction);
            
            AtualizarBeneficiarioResponse responsews = new BeneficiarioWebServiceManager().atualizar(beneficiarioOld, beneficiarioOld.getCodigoInternoGama());
            
            if (!responsews.isResultado())
            {
            	logger.error("Error no retorno do serviço: " + responsews.getMensagem());
            	
    			json.put("error", responsews.getMensagem());
    			
    			return Response.ok( json.toJSONString() ).build();
            }
            
            transaction.commit();
            
            json.put("ok", "true");
            
            return Response.ok( json.toJSONString() ).build();
        }
        catch (PortalException e)
        {
        	logger.error("Error em /beneficiario-rest/update-short", e);
        	
			json.put("error", e.getMessage());
			
			return Response.ok( json.toJSONString() ).build();
        }
        catch (Exception e)
		{
        	logger.error("Error em /beneficiario-rest/update-short", e);
        	
			json.put("error", "Ocorreu um erro ao atualizar os dados do Beneficiário.");
			
			return Response.ok( json.toJSONString() ).build();
		}
		finally
		{
			transaction.close();
		}
    }
}