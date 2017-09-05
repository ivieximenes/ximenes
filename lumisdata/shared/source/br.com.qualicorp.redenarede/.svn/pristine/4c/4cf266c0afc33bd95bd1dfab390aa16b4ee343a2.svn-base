package br.com.qualicorp.redenarede.service.auditoria.filter;

import br.com.qualicorp.redenarede.commons.utils.StringUtils;
import lumis.doui.source.filter.RequiredFilterValueException;
import lumis.doui.table.filter.TableSourceFilter;
import lumis.portal.PortalException;
import lumis.util.parameter.IParameters;
import lumis.util.query.IQueryFilter;
import lumis.util.query.IQueryValue;
import lumis.util.query.QueryBase;
import lumis.util.query.QueryField;
import lumis.util.query.QueryFilter;
import lumis.util.query.QueryValue;

public class AuditFilter extends TableSourceFilter
{	
	@Override
	public IQueryFilter getQueryFilter(QueryBase queryBase, IParameters params)	throws PortalException, RequiredFilterValueException
	{
		final String fieldId = getFieldId();
		
		QueryField field = queryBase.getTable().getField(fieldId);
		
		QueryFilter queryFilter = new QueryFilter();
		
		IQueryValue qValue = getFilterValue();
		
		if (qValue == null)
		{
			return null;
		}
		
		queryFilter.setLeftField     ( field                              );
		queryFilter.setFilterOperator( IQueryFilter.FILTER_OPERATOR_EQUAL );
		queryFilter.setRightField    ( qValue            				  );
		
		return queryFilter;
	}
	
	@Override
	public IQueryValue getFilterValue() {
		
		String value = getParamFilterValue(getFieldId());
		
		if (StringUtils.isBlankOrNull(value))
		{
			return null;
		}
		
		return new QueryValue(value);
	}
	
	private String getParamFilterValue(String paramName)
	{
		
		return getSource().getDouiContext().getRequest().getParameter("adminList.filters." + paramName + ".value");
	}
}