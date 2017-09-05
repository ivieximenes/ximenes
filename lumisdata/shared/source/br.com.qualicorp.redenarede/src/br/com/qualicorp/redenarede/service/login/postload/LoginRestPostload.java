package br.com.qualicorp.redenarede.service.login.postload;

import java.util.Comparator;

import org.w3c.dom.Node;

import br.com.qualicorp.redenarede.service.administracaoestipulante.manager.EstipulanteManager;
import lumis.doui.source.ISourceData;
import lumis.doui.source.Source;
import lumis.doui.source.TabularData;
import lumis.doui.source.postloadprocessor.IPostLoadProcessor;
import lumis.portal.PortalException;
import lumis.portal.authentication.SessionConfig;
import lumis.portal.dao.jdbc.ITransactionJdbc;
import lumis.portal.manager.ManagerFactory;
import lumis.util.ITransaction;

public class LoginRestPostload implements IPostLoadProcessor
{
	@SuppressWarnings("rawtypes")
	@Override
	public void processSource(SessionConfig session, Source source, Node parameterNode, ITransaction transaction) throws PortalException
	{
		TabularData tabularData = (TabularData) source.getData();

		EstipulanteManager estipulanteManager = EstipulanteManager.getInstance();

		String estipulante = "";
		
		for (ISourceData row : tabularData.getRows())
		{
			String user_id = (String) row.get("user_id", String.class);

			if (user_id != null)
			{
				row.put("nome", ManagerFactory.getUserManager().get(session, user_id, transaction).getFirstName());

				estipulante = estipulanteManager.getNomeEstipulantePeloUsuario(user_id, (ITransactionJdbc) transaction, session);

				if (estipulante != null && !"".equals(estipulante))
				{
					row.put("estipulante", estipulante);
				}

			}
		}

		if (tabularData != null && tabularData.getRows().size() > 0)
		{
			Comparator<ISourceData> comparator = new Comparator<ISourceData>()
			{
				@Override
				public int compare(ISourceData o1, ISourceData o2)
				{
					int result = ((String) o1.get("nome")).compareTo((String) o2.get("nome"));

					return result != 0 ? result : ((String) o1.get("numero_carteira")).compareTo((String) o2.get("numero_carteira"));
				}
			};

			tabularData.sort(comparator);
		}
	}
}