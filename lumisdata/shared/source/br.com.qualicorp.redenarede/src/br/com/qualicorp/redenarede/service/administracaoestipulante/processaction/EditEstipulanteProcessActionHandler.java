package br.com.qualicorp.redenarede.service.administracaoestipulante.processaction;

import br.com.qualicorp.redenarede.service.administracaoestipulante.manager.EstipulanteManager;
import lumis.doui.table.TableAddDataProcessActionHandler;
import lumis.portal.PortalException;
import lumis.portal.group.GroupConfig;
import lumis.portal.manager.ManagerFactory;
import lumis.portal.principal.PrincipalManager;

public class EditEstipulanteProcessActionHandler extends TableAddDataProcessActionHandler
{
	@Override
	public void processAction() throws PortalException
	{	
		String nomeGrupo = (String)getParameter("nome");
		String codigoGrupo = getParameter("codigo").toString();
		String subestipulante = getParameter("subestipulante").toString();
		
		String groupAlias = EstipulanteManager.getInstance().makeAliasGroup(codigoGrupo, subestipulante);
		
		PrincipalManager principalManager = (PrincipalManager) ManagerFactory.getPrincipalManager();

		GroupConfig groupConfig = ManagerFactory.getGroupManager().get(sessionConfig, principalManager.getByShortId(sessionConfig, groupAlias, transaction).getId(), transaction);
		groupConfig.setName(nomeGrupo);
		ManagerFactory.getGroupManager().update(sessionConfig, groupConfig, transaction);
		
		addDefaultResponse();
	}
}