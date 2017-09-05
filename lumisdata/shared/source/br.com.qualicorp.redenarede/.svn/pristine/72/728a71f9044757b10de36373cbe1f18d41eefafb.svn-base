package br.com.qualicorp.redenarede.service.administracaodelayout.dataprovider;

import java.util.List;

import br.com.qualicorp.redenarede.service.administracaodelayout.manager.LayoutManager;
import br.com.qualicorp.redenarede.service.administracaodelayout.to.LayoutTO;
import lumis.doui.source.ISourceData;
import lumis.doui.source.TabularData;
import lumis.doui.table.TableDataProvider;
import lumis.doui.table.TableSource;
import lumis.portal.PortalException;
import lumis.portal.authentication.SessionConfig;
import lumis.portal.dao.jdbc.ITransactionJdbc;
import lumis.util.ITransaction;

public class LayoutUserDataProvider extends TableDataProvider
{
	public LayoutUserDataProvider() throws PortalException {
		super();
	}

	public void loadData(SessionConfig sessionConfig, TableSource source, ITransaction transaction) throws PortalException
    {
    	LayoutTO to = LayoutManager.getInstance().getLayoutForLoggedUser((ITransactionJdbc) transaction, sessionConfig);
		
		TabularData data = source.getData();
		
		if (to != null)
		{
			data.setTotalRows(1);
			
			ISourceData row = data.addRow();

			row.put("idlayout", to.getIdlayout());
			row.put("nomeLayout", to.getNomeLayout());
			row.put("corDeFundo", to.getCorDeFundo());
			row.put("corDaLetra", to.getCorDaLetra());
			row.put("fonteDaLetra", to.getFonteDaLetra());
			
			List<String> customizedP = source.getDouiContext().getRequest().getPageWebResource().getProperties().get("qualicorp.custumized-layout");
			
			if (customizedP != null && customizedP.size() > 0 && customizedP.get(0).toLowerCase().equals("true"))
				source.getDouiContext().getRequest().setAttribute("custumizedLayout", "true");
		}
		else
		{
			data.setTotalRows(0);
		}
    }
}