package br.com.qualicorp.redenarede.service.useraccount.processaction;

import br.com.qualicorp.redenarede.service.useraccount.manager.UserAccountManager;
import lumis.doui.processaction.ProcessActionHandler;
import lumis.doui.table.TableSource;
import lumis.portal.PortalException;

public class RodarScriptProcessActionHandler  extends ProcessActionHandler<TableSource>
{
	public static final String ACTION_BENEFICIARIO = "alterarSenhaBeneficiario";
	public static final String ACTION_PRESTADOR = "alterarSenhaPrestador";

	@Override
	public void processAction() throws PortalException
	{
		UserAccountManager.getInstance().executaScript(transaction);
		
		addDefaultResponse();
	}
}
