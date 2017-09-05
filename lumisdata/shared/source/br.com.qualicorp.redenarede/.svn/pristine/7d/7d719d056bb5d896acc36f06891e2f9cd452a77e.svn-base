package br.com.qualicorp.redenarede.service.useraccount.processaction;

import br.com.qualicorp.redenarede.webservice.manager.PrestadorWebServiceManager;
import br.com.qualicorp.redenarede.webservice.stub.pretador.RetornoUsuarioPrestador;
import lumis.doui.table.TableAddDataProcessActionHandler;
import lumis.portal.PortalException;
import lumis.portal.PortalObjectNotFoundException;
import lumis.portal.UnexpectedException;
import lumis.portal.authentication.SessionConfig;
import lumis.portal.group.IGroupManager;
import lumis.portal.manager.ManagerFactory;
import lumis.portal.principal.PrincipalConfig;
import lumis.portal.user.UserConfig;

public class AddPrestadorProcessActionHandler extends TableAddDataProcessActionHandler
{
	
	final String  GSP_PRESTADOR = "gsp.prestador";
	@Override
	public void processAction() throws PortalException
	{	
		try{
			try
			{
				
				String userIdByLogin = ManagerFactory.getUserManager().getUserIdByLogin(SessionConfig.getCurrentSessionConfig(), (String) douiContext.getRequest().getParameter("email"), transaction);
				if(userIdByLogin !=null)
					throw new PortalException("Usuário: '"+(String) douiContext.getRequest().getParameter("email")+"' já cadastrado.");
			}
			catch(PortalObjectNotFoundException p)
			{
				PrestadorWebServiceManager prestadorWS = new PrestadorWebServiceManager();
				try {
				RetornoUsuarioPrestador cadastrarPrestador = prestadorWS.cadastrarPrestador(douiContext.getRequest());
				if(!cadastrarPrestador.isSucesso())
					throw new PortalException(cadastrarPrestador.getMensagem());
					
				} catch (Exception e) {
					throw new PortalException(e.getMessage(), e);
				}
				
			}
			
			String userId = addUser();
			setParameter("user_id", userId);
			
			String cpf_cnpj = douiContext.getRequest().getParameter("provider-signup-cnpj")==null||
					"".equals(douiContext.getRequest().getParameter("provider-signup-cnpj")) ? 
							douiContext.getRequest().getParameter("provider-signup-cpf"):
								douiContext.getRequest().getParameter("provider-signup-cnpj");
			
			super.parameters.put("nome", douiContext.getRequest().getParameter("nome"));
			super.parameters.put("cpf_cnpj", cpf_cnpj);
			super.parameters.put("razao_social", douiContext.getRequest().getParameter("razao_social"));
			super.parameters.put("telefone", douiContext.getRequest().getParameter("telefone"));
			
			super.processAction();
		}catch(Exception e)
		{
			 throw new PortalException(e.getMessage(), getResource(), e);
		}
		
		
	}


	private String addUser() throws PortalException, UnexpectedException {
		UserConfig userConfig = new UserConfig();
		userConfig.setLogin((String) douiContext.getRequest().getParameter("email"));
		userConfig.setFirstName((String) douiContext.getRequest().getParameter("nome"));
		userConfig.setEmail((String) douiContext.getRequest().getParameter("email"));
		userConfig.setPassword((String) douiContext.getRequest().getParameter("password"));
		
		SessionConfig systemUser = ManagerFactory.getAuthenticationManager().impersonate(UserConfig.USER_SYSTEM_ID);
		String userId = null;
		try
		{
			
			userId = ManagerFactory.getUserManager().add(systemUser, userConfig, transaction);
			
			PrincipalConfig grupo = ManagerFactory.getPrincipalManager().getByShortId(systemUser, GSP_PRESTADOR, transaction);
			IGroupManager manager = ManagerFactory.getGroupManager();
            manager.addMember(systemUser, grupo.getId(), userConfig.getId(), transaction);
        }
		catch(Exception e)
        {
            throw new PortalException(e.getMessage(), getResource(), e);
        }
		finally
		{
			ManagerFactory.getAuthenticationManager().endImpersonation(systemUser);
		}
		return userId;
	}

}