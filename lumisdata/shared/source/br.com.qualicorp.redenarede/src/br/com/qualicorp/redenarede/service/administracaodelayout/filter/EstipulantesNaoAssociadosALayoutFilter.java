package br.com.qualicorp.redenarede.service.administracaodelayout.filter;

import java.util.List;

import br.com.qualicorp.redenarede.commons.utils.StringUtils;
import lumis.doui.source.ISourceData;
import lumis.doui.source.TabularSource;
import lumis.doui.source.filter.RequiredFilterValueException;
import lumis.doui.table.filter.TableSourceFilter;
import lumis.portal.PortalException;
import lumis.util.JdbcUtil;
import lumis.util.parameter.IParameters;
import lumis.util.query.IQueryFilter;
import lumis.util.query.QueryBase;
import lumis.util.query.QueryFilter;
import lumis.util.query.QueryValue;

public class EstipulantesNaoAssociadosALayoutFilter extends TableSourceFilter
{
	@Override
	public IQueryFilter getQueryFilter(QueryBase queryBase, IParameters params)	throws PortalException, RequiredFilterValueException
	{
		if (StringUtils.isBlankOrNull(queryBase.getTable().getTableAlias()))
			queryBase.getTable().setTableAlias("estipulante");
		
		QueryFilter queryFilter = new QueryFilter();
		
		StringBuilder sb = new StringBuilder()
		.append("SELECT * \n")
		.append("  FROM qc_layoutestipulante le \n")
		.append("  WHERE le.idEstipulante = ").append(queryBase.getTable().getTableAlias()).append(".idEstipulante \n");
		
		
		String[] idLayouts = getIdsDefaultSource();
		
		if (idLayouts != null)
		{
			sb.append(" AND le.idLayout NOT IN ( \n");
			
			for (String idLayout : idLayouts)
				sb.append("'").append(JdbcUtil.prepareQueryParameter(idLayout)).append("', ");
			
			sb.delete(sb.length() - 2, sb.length());
			
			sb.append(" ) \n");
		}
		
		QueryValue qValue = new QueryValue(sb.toString());
		
		qValue.setValueInParameter(false);
		
		queryFilter.setLeftField(qValue);
		queryFilter.setFilterOperator(IQueryFilter.FILTER_OPERATOR_NOT_EXISTS);
		
		return queryFilter;
	}
	
	private String[] getIdsDefaultSource() throws PortalException
	{
		TabularSource<?> mainSource = (TabularSource<?>) getSource().getSourceContainer().getDefaultSource();
		
		List<ISourceData> mainRows = mainSource.getData().getRows();
		
		if (mainRows == null || mainRows.isEmpty())
		{
			return null;
		}
		
		String[] ids = new String[mainRows.size()];
		
		for (int i = 0; i < mainRows.size(); i++)
			ids[i] = mainRows.get(i).get(mainSource.getPrimaryKeyField().getId()).toString();
		
		return ids;
	}
}
