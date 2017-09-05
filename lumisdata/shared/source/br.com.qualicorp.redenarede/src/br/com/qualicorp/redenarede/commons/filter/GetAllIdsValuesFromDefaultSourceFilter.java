package br.com.qualicorp.redenarede.commons.filter;

import java.util.List;

import org.w3c.dom.Node;

import lumis.doui.source.ISourceData;
import lumis.doui.source.TabularSource;
import lumis.doui.table.filter.TableSourceFilter;
import lumis.portal.PortalException;
import lumis.util.query.IQueryValue;
import lumis.util.query.QueryValue;

public class GetAllIdsValuesFromDefaultSourceFilter extends TableSourceFilter
{
	@Override
	protected IQueryValue calculateFilterValue(Node filterNode) throws PortalException
	{
		TabularSource<?> mainSource = (TabularSource<?>) getSource().getSourceContainer().getDefaultSource();
		
		List<ISourceData> mainRows = mainSource.getData().getRows();
		
		if (mainRows == null || mainRows.isEmpty())
		{
			return null;
		}
		
		Object[] ids = new Object[mainRows.size()];
		
		for (int i = 0; i < mainRows.size(); i++)
			ids[i] = mainRows.get(i).get(mainSource.getPrimaryKeyField().getId());
			
		
		return new QueryValue(ids);
	}
}
