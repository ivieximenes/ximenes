package br.com.qualicorp.redenarede.service.administracaoestipulante.processaction;

import br.com.qualicorp.redenarede.service.administracaoestipulante.manager.EstipulanteManager;
import lumis.doui.table.TableAddDataProcessActionHandler;
import lumis.portal.PortalException;

public class AddEstipulanteProcessActionHandler extends TableAddDataProcessActionHandler
{
	@Override
	public void processAction() throws PortalException
	{	
		String nomeGrupo = (String)getParameter("nome");
		String codigoGrupo = getParameter("codigo").toString();
		String subestipulante = getParameter("subestipulante").toString();
		
		EstipulanteManager.getInstance().createGroup(nomeGrupo, codigoGrupo, subestipulante, sessionConfig, transaction);
		
		addDefaultResponse();
	}
}

