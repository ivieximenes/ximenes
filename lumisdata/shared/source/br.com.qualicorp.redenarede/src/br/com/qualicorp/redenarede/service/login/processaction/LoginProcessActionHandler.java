package br.com.qualicorp.redenarede.service.login.processaction;

import java.util.Locale;

import javax.portlet.PortletSession;

import br.com.qualicorp.redenarede.commons.utils.CPFUtils;
import br.com.qualicorp.redenarede.service.administracaoestipulante.manager.EstipulanteManager;
import br.com.qualicorp.redenarede.service.useraccount.manager.BeneficiarioManager;
import br.com.qualicorp.redenarede.service.useraccount.to.BeneficionarioTO;
import br.com.qualicorp.redenarede.webservice.manager.BeneficiarioWebServiceManager;
import br.com.qualicorp.redenarede.webservice.manager.PrestadorWebServiceManager;
import br.com.qualicorp.redenarede.webservice.stub.beneficiario.AutenticarResponse;
import br.com.qualicorp.redenarede.webservice.stub.beneficiario.Beneficiario;
import br.com.qualicorp.redenarede.webservice.stub.pretador.RetornoUsuarioPrestador;
import lumis.doui.processaction.ProcessActionHandler;
import lumis.doui.table.TableSource;
import lumis.portal.PortalException;
import lumis.portal.UnexpectedException;
import lumis.portal.authentication.SessionConfig;
import lumis.portal.manager.ManagerFactory;
import lumis.portal.page.PageConfig;
import lumis.portal.page.acl.PagePermissions;
import lumis.portal.serviceinterface.IServiceInterfaceUrl;
import lumis.portal.transaction.ITransaction;
import lumis.portal.transaction.PortalTransactionFactory;
import lumis.portal.user.UserConfig;
import lumis.util.CookieUtil;
import lumis.util.XmlUtil;
import lumis.util.log.ILogger;
import lumis.util.log.LoggerFactory;

public class LoginProcessActionHandler  extends ProcessActionHandler<TableSource>
{
		public static final String ACTION_LOGIN = "lum_actionLogin";
		public static final String ACTION_LOGOUT = "lum_actionLogout";
		public static final String  GSP_BENEFICIARIO = "gsp.beneficiario";
		public static final String  GSP_PRESTADOR = "gsp.prestador";

		private static ILogger logger = LoggerFactory.getServiceLogger("gsp.WebService");
		
		@Override
		public void processAction() throws PortalException
		{
			String actionType = XmlUtil.readAttributeString("actionType", processActionNode);

			if (actionType.equals(ACTION_LOGIN))
				processLoginAction();
			else if (actionType.equals(ACTION_LOGOUT))
				processLogoutAction();
			
			addDefaultResponse();
		}
		
		private void processLoginAction() throws PortalException
		{
			try
			{
				String loginParameter = getParameter("login", String.class); 
				String password = getParameter("password", String.class);
				String loginType = getParameter("typeLogin", String.class);
				boolean isCPF = false;
				
				BeneficiarioWebServiceManager beneficiarioWS = null;
				AutenticarResponse loginBeneficiario = null;
				PrestadorWebServiceManager prestadorWS = null;
				RetornoUsuarioPrestador loginPrestador = null;
				
				if (loginParameter != null){
					String userId = "";
					
					if("beneficiario".equals(loginType)){
						beneficiarioWS = new BeneficiarioWebServiceManager();
						loginBeneficiario = beneficiarioWS.login(loginParameter, password);
					}else if ("prestador".equals(loginType)){
						prestadorWS = new PrestadorWebServiceManager();
						loginPrestador = prestadorWS.login(loginParameter, password);
					}
	
					try{
						if(CPFUtils.isCPF(loginParameter)){
							if(loginBeneficiario.isResultado()){
								loginParameter = loginBeneficiario.getBeneficiario().getCodigoCarteirinha();	
							}
							isCPF = true;
						}
						
						userId = ManagerFactory.getUserManager().getUserIdByLogin(sessionConfig, loginParameter, transaction);
					}catch(PortalException e){
						
						if("prestador".equals(loginType)){
							throw new PortalException("O login '"+loginParameter+"' não foi encontrado.", getResource());
						}
						
						if (loginBeneficiario.isResultado()){
						
							BeneficionarioTO beneficiarioTO = beneficiarioWS.createBeneficionarioTO(loginBeneficiario.getBeneficiario());
							beneficiarioTO.setPassword(password);
							
							ITransaction transactionCadastrar =  PortalTransactionFactory.createTransaction();
						        
							transactionCadastrar.begin();
				            
							BeneficiarioManager.getInstance().cadastrar(beneficiarioTO, transactionCadastrar);
							
							transactionCadastrar.commit();
							transactionCadastrar.close();
							
							loginParameter = beneficiarioTO.getNumeroCarteira();
							
							userId = ManagerFactory.getUserManager().getUserIdByLogin(sessionConfig, loginParameter, transaction);
							
						}else{
							throw new PortalException(erroBeneficiario(loginBeneficiario, isCPF), getResource());
						}
					}
					
					if ("beneficiario".equals(loginType))
					{	
						if (loginBeneficiario.isResultado()){
							String codeEstipulante = loginBeneficiario.getBeneficiario().getEmpresa().getCodigo().toString();
							String codeSubestipulante = loginBeneficiario.getBeneficiario().getSubestipulante().getCodigo().toString();
							
							if (!EstipulanteManager.getInstance().existsSubEstipulante(codeEstipulante, codeSubestipulante))
							{
								throw new PortalException("Empresa do beneficiário inválida!");
							}
							
							EstipulanteManager.getInstance().updateAssociation(userId, codeEstipulante, codeSubestipulante, transaction);
							update(loginBeneficiario.getBeneficiario(), beneficiarioWS); //A atualização deve vir antes do login para ter o nome atualizado no cookie
							
							updateBeneficiarioPassword(loginBeneficiario.getBeneficiario().getCodigoCarteirinha(), password);
							ManagerFactory.getAuthenticationManager().loginUser(userId, transaction);
							CookieUtil.addLumisUserCookies(douiContext.getRequest(), douiContext.getResponse());
							
							logger.info("Tokem: " + String.valueOf(loginBeneficiario.getBeneficiario().getToken()));
							
							BeneficiarioManager.getInstance().putSessionAtributesLogin(loginBeneficiario.getBeneficiario(), douiContext.getRequest().getPortletSession());
							
							IServiceInterfaceUrl url = getServiceInterfaceHyperLink(douiContext.getRequest().getServiceConfig().getId()+".homeBeneficiario");
							douiContext.getActionResponse().sendRedirect("/"+url.toString());
						}else{
							throw new PortalException(erroBeneficiario(loginBeneficiario, isCPF), getResource());
						}
					}
					else if("prestador".equals(loginType))
					{
						
						if(!loginPrestador.isSucesso())
							throw new PortalException(loginPrestador.getMensagem());
						
						ManagerFactory.getAuthenticationManager().loginUser(userId, transaction);
						CookieUtil.addLumisUserCookies(douiContext.getRequest(), douiContext.getResponse());
						douiContext.getRequest().getPortletSession().setAttribute("isPrestador", true, PortletSession.APPLICATION_SCOPE);
						IServiceInterfaceUrl url = getServiceInterfaceHyperLink(douiContext.getRequest().getServiceConfig().getId()+".homeCredenciado");
						douiContext.getActionResponse().sendRedirect("/"+url.toString());
					}
					else
					{
						SessionConfig loginUser = ManagerFactory.getAuthenticationManager().login(loginParameter, password, transaction);
						
						if (loginUser != null)
						{
							CookieUtil.addLumisUserCookies(douiContext.getRequest(), douiContext.getResponse());
							douiContext.getActionResponse().sendRedirect("/"+ PageConfig.PAGE_MAIN);	
							
						}
						else
						{
							throw new PortalException("STR_ERROR_MSG", getResource());
						}
					}
					
				}
			}
			catch (PortalException e)
			{
				throw e;
			}
			catch (Exception e)
			{
				throw new UnexpectedException(e);
			}
		}
		
		
		private void update(Beneficiario beneficiario, BeneficiarioWebServiceManager beneficiarioWS)
		{
			// ATENÇÂO!! A PEDIDO DO CLIENTE, SE HOUVER EXCEPTION NA ATUALIZAÇÂO DOS DADOS DO BENEFICIÁ, NÂO DEVE IMPEDIR O LOGIN, APENAS LOGAR!
	        ITransaction transaction =  PortalTransactionFactory.createTransaction();
	        
	        try
	        {
	            transaction.begin();
	            
	            BeneficionarioTO toNew = beneficiarioWS.createBeneficionarioTO(beneficiario);
				
	            BeneficiarioManager.getInstance().update(toNew.getNumeroCarteira(), toNew, transaction);
	            
	            transaction.commit();
	        } 
	        catch (Exception e)
			{
	        	logger.error("Error em /beneficiario-rest/update-short", e);
			}
			finally
			{
				transaction.close();
			}
		}
		
		private void updateBeneficiarioPassword(String numCarteirinha, String password)
		{
	        ITransaction transaction =  PortalTransactionFactory.createTransaction();
	        
	        try
	        {
	            transaction.begin();
	            
	            BeneficiarioManager.getInstance().updateBeneficiarioPassword(numCarteirinha, password, transaction);
	            
	            transaction.commit();
	        } 
	        catch (Exception e)
			{
	        	logger.error("Erro na atualização de senha do beneficiario", e);
			}
			finally
			{
				transaction.close();
			}
		}
		
		private void processLogoutAction() throws PortalException
		{
			try
			{
				Locale originalSessionConfigLocale = sessionConfig.getLocale();
				
				// logout the user
				ManagerFactory.getAuthenticationManager().logoutUser(sessionConfig, transaction);
				CookieUtil.deleteLumisStandardCookies(douiContext.getRequest(), douiContext.getResponse());
				douiContext.getRequest().getPortletSession().invalidate();
				
				// from now on, this request must be processed as a guest user in
				// the same locale as the original session
				SessionConfig guestSessionConfig = ManagerFactory.getAuthenticationManager().impersonate(UserConfig.USER_GUEST_ID);
				guestSessionConfig.setLocale(originalSessionConfigLocale);

				// reads the original web resource path from the request
				String originalWebResource = getParameter("originalWebResource", String.class);

				// checks whether the user may stay in the same page
				boolean mayStayInTheSamePage =
						originalWebResource != null
						&& !originalWebResource.isEmpty()
						&& ManagerFactory.getPageAclManager().checkPermission(guestSessionConfig, douiContext.getRequest().getPageConfig().getId(), PagePermissions.VIEW_PAGE, transaction);

				// if so, redirect him to the very same web resource
				if (mayStayInTheSamePage)
				{
					douiContext.getActionResponse().sendRedirect(douiContext.getActionRequest().getContextPath() + originalWebResource);
				}

				// if not, redirect him to root
				else
				{
					IServiceInterfaceUrl url = douiContext.getResponse().createPortalURL();
					url.setParameter("logout", "1");
					douiContext.getActionResponse().sendRedirect(douiContext.getActionRequest().getContextPath() + "/" + url.toString());
				}
			}
			catch (PortalException e)
			{
				throw e;
			}
			catch (Exception e)
			{
				throw new UnexpectedException(e);
			}
		}
		
		private String erroBeneficiario(AutenticarResponse loginBeneficiario, boolean isCPF) throws PortalException {
			
			if (loginBeneficiario.getCodigoErro() == 3)
			{	
				if(isCPF){
					loginBeneficiario.setMensagem("CPF ou senha inválida.");
				}else{
					loginBeneficiario.setMensagem("Número de carteirinha ou senha inválida.");
				}
			}
			
			return loginBeneficiario.getMensagem();
		}
}