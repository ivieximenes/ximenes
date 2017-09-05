package br.com.qualicorp.redenarede.service.useraccount.processaction;

import com.restfb.json.JsonObject;

import br.com.qualicorp.redenarede.service.useraccount.manager.BeneficiarioManager;
import br.com.qualicorp.redenarede.service.useraccount.to.BeneficionarioTO;
import br.com.qualicorp.redenarede.webservice.manager.BeneficiarioWebServiceManager;
import br.com.qualicorp.redenarede.webservice.stub.beneficiario.Beneficiario;
import br.com.qualicorp.redenarede.webservice.stub.beneficiario.CriarSenhaGspResponse;
import lumis.doui.processaction.ProcessActionHandler;
import lumis.doui.table.TableAddDataProcessActionHandler;
import lumis.portal.PortalException;
import lumis.portal.PortalObjectNotFoundException;
import lumis.portal.authentication.SessionConfig;
import lumis.portal.manager.ManagerFactory;
import lumis.portal.user.UserConfig;

public class InitAddBeneficiarioProcessActionHandler extends TableAddDataProcessActionHandler
{
	@Override
	public void processAction() throws PortalException
	{
		BeneficiarioWebServiceManager beneficiarioWS = null;
		Beneficiario beneficiario = null;
		
		String numeroCarteira = douiContext.getRequest().getParameter("numero_carteira").replaceAll("[^0-9]", "");
		
		try
		{
			System.out.println("iniciando cadastro de beneficiario");
			String userIdByLogin = ManagerFactory.getUserManager().getUserIdByLogin(SessionConfig.getCurrentSessionConfig(), numeroCarteira, transaction);
			
			if (userIdByLogin != null)
			{
				System.out.println("Usuário '" + numeroCarteira + "' já foi previamente cadastrado.");
				throw new PortalException("Usuário '" + numeroCarteira + "' já foi previamente cadastrado.");
			}
		}
		catch (PortalObjectNotFoundException p)
		{
			try
			{
				setParameter("numero_carteira", numeroCarteira);
				
				System.out.println("criando beneficiario Web Service Manager");
				beneficiarioWS = new BeneficiarioWebServiceManager();
				CriarSenhaGspResponse cadastrarBeneficiario = beneficiarioWS.cadastrarBeneficiario(douiContext.getRequest());
				System.out.println("cadastrando beneficiario");
				
				if (!cadastrarBeneficiario.isResultado())
				{
					System.out.println("cadastro não realizado no WS Gama. Mensagem: " + cadastrarBeneficiario.getMensagem());
					throw new PortalException(cadastrarBeneficiario.getMensagem());
				}

				beneficiario = cadastrarBeneficiario.getBeneficiario();

				if (beneficiario == null)
					throw new PortalException("No momento não podemos realizar o seu cadastro. Entre em contato com a central de atendimento 0800 779 9005 ou 11 3004-4633");
				
				if(!isEstipulanteValido(beneficiario.getEmpresa().getCodigo(), beneficiario.getSubestipulante().getCodigo())){
					throw new PortalException("Seu cadastro não foi encontrado na base de clientes GAMA SMART. Por favor, entre em contato com a Central de Atendimento no número de telefone que se encontra em sua carteirinha.");
				}

			}
			catch (Exception e)
			{
				System.out.println("erro ao cadastrar beneficiario no WS" + e.getMessage());
				throw new PortalException(e.getMessage(), getResource());
			}
  
		}
		
		BeneficionarioTO to = beneficiarioWS.createBeneficionarioTO(beneficiario);
		
		to.setPassword(douiContext.getRequest().getParameter("password"));

		BeneficiarioManager.getInstance().informSessionBeneficiariosCadastrados(to, douiContext);
		BeneficiarioManager.getInstance().saveInSessionBeneficiarios(to, douiContext);
		
		if (to.getTelefone() != null && (to.getTelefone().length() >= 10))
			to.setTelefone(to.getTelefoneFormated());
		
		// Retorna um json para passar informações para o popup
		addResponseParameter(ProcessActionHandler.RESPONSE_TYPE_MESSAGE, new JsonObject(to).toString());
	}
	
	/**
	 * Intetifica se o estipulante está cadastrado.
	 * 
	 * @param estipulanteCode Código da empresa estipulante
	 * @param subEstipulanteCode Código da empresa subEstipulante
	 * @return retorna true caso o estupulante informado esteja cadastrado no sistema. 
	 * @throws PortalException
	 */
	private boolean isEstipulanteValido(Integer estipulanteCode, Integer subEstipulanteCode) throws PortalException{
		boolean estitupanteValido = false;
		if(estipulanteCode != null && subEstipulanteCode != null){
			SessionConfig systemUser = ManagerFactory.getAuthenticationManager().impersonate(UserConfig.USER_SYSTEM_ID);
			String estipulanteAlias = "estipulante_" + estipulanteCode + "_subestipulante_" + subEstipulanteCode;
			estitupanteValido = ManagerFactory.getPrincipalManager().getByShortId(systemUser, estipulanteAlias, transaction) != null;
		}
		return estitupanteValido;
		
	}
}
