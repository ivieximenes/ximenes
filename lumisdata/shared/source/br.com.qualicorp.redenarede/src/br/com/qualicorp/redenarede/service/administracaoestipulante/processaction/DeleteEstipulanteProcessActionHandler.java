package br.com.qualicorp.redenarede.service.administracaoestipulante.processaction;

import java.util.ArrayList;

import br.com.qualicorp.redenarede.service.administracaoestipulante.manager.EstipulanteManager;
import br.com.qualicorp.redenarede.service.administracaoestipulante.to.EstipulanteTO;
import lumis.doui.table.TableDeleteDataProcessActionHandler;
import lumis.portal.PortalException;
import lumis.portal.dao.jdbc.ITransactionJdbc;
import lumis.portal.group.GroupConfig;
import lumis.portal.group.IGroupManager;
import lumis.portal.manager.ManagerFactory;
import lumis.portal.principal.PrincipalManager;

public class DeleteEstipulanteProcessActionHandler extends TableDeleteDataProcessActionHandler
{
	@Override
	public void processAction() throws PortalException
	{
		if (getParameter("idestipulante") == null)
			throw new PortalException("Nenhum estipulante selecionado.");

		EstipulanteManager estipulanteManager = EstipulanteManager.getInstance();
		PrincipalManager principalManager = (PrincipalManager) ManagerFactory.getPrincipalManager();

		String[] idEstipulanteList = (String[]) getParameter("idestipulante");
		EstipulanteTO estipulanteTO = null;

		validaGrupoComUsuario(idEstipulanteList, estipulanteManager, principalManager);

		for (int i = 0; i < idEstipulanteList.length; i++)
		{
			estipulanteTO = estipulanteManager.getEstipulantePeloId(idEstipulanteList[i], (ITransactionJdbc) transaction);
			
			String groupId = principalManager.getByShortId(sessionConfig, estipulanteTO.getGroupAlias(), transaction).getId();

			GroupConfig groupConfig = ManagerFactory.getGroupManager().get(sessionConfig, groupId, transaction);
			
			ManagerFactory.getGroupManager().delete(sessionConfig, groupConfig.getId(), transaction);

			estipulanteManager.excluiLayoutPorEstipulante(idEstipulanteList[i]);
		}
	}

	private void validaGrupoComUsuario(String[] idEstipulanteList, EstipulanteManager estipulanteManager, PrincipalManager principalManager) throws PortalException
	{
		EstipulanteTO estipulanteTO = null;
		ArrayList<String> gruposComUsuarios = new ArrayList<String>();
		
		for (int i = 0; i < idEstipulanteList.length; i++)
		{

			estipulanteTO = estipulanteManager.getEstipulantePeloId(idEstipulanteList[i], (ITransactionJdbc) transaction);

			if (estipulanteTO == null)
				throw new lumis.portal.PortalException("Código do Estipulante inválido para deleção.");

			String groupId = principalManager.getByShortId(sessionConfig, estipulanteTO.getGroupAlias(), transaction).getId();

			if (ManagerFactory.getGroupManager().getMembers(sessionConfig, groupId, IGroupManager.FILTER_TYPE_ONLY_USERS, true, transaction).size() > 0)
			{
				gruposComUsuarios.add(groupId);
			}
		}

		if (gruposComUsuarios.size() > 0)
		{
			StringBuilder erroMsg = new StringBuilder("O(s) grupo(s) ");
			
			String grupos = "";
			
			for (String groupId : gruposComUsuarios)
			{
				grupos += ManagerFactory.getGroupManager().get(sessionConfig, groupId, transaction).getName() + ", ";
			}

			erroMsg.append(grupos.substring(0, grupos.lastIndexOf(",")));
			erroMsg.append(" não pode(em) ser excluído(s) pois possui(em) usuário(s) vinculado(s).");

			throw new lumis.portal.PortalException(erroMsg.toString());
		}
	}
}