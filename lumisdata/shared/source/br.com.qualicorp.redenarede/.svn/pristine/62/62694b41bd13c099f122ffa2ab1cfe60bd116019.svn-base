package br.com.qualicorp.redenarede.service.auditoria.to;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.w3c.dom.Node;

import br.com.qualicorp.redenarede.commons.utils.StringUtils;

public class TableTO
{
	public static final String $AUDITORIA_TITLE = "$auditoriaTitle";
	public static final String $AUDITORIA_RELATION = "$auditoriaRelation";
	
	private String name;
	private String key;
	private String alias;
	private List<FieldTO> fields = new ArrayList<FieldTO>();
	private Map<String, String> aliasJsonFields = new HashMap<String, String>();
	private RelationTO parent;
	
	private Set<String> remainColumns = new HashSet<String>();
	Map<String, String> columnsByFieldId = new HashMap<String, String>();
	
	private Map<String, Map<String, Object>> rows = new HashMap<String, Map<String, Object>>();
	
	private Node sourceDoui;
	
	public String getColumnNameByFieldId(String fieldId)
	{
		return columnsByFieldId.get(fieldId);
	}
	public String putColumnNameByFieldId(String fieldId, String columnName)
	{
		return columnsByFieldId.put(fieldId, columnName);
	}
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getKey() {
		return key;
	}
	public void setKey(String key) {
		this.key = key;
	}
	public List<FieldTO> getFields() {
		return fields;
	}
	public void setFields(List<FieldTO> fields) {
		this.fields = fields;
	}
	public String getAlias() {
		return alias;
	}
	public void setAlias(String alias) {
		this.alias = alias;
	}
	public RelationTO getParent() {
		return parent;
	}
	public void setParent(RelationTO parent) {
		this.parent = parent;
	}
	
	public void putJsonLabel(String column, String label)
	{
		aliasJsonFields.put(column.toUpperCase(), label);
	}
	
	public String getJsonLabel(String column)
	{
		String label = aliasJsonFields.get(column.toUpperCase());
		
		if (StringUtils.isBlankOrNull(label))
		{
			return column;
		}
		
		return label;
	}
	
	public void putRow(Map<String, Object> row)
	{
		rows.put(row.get(key.toUpperCase()).toString(), row);
		
		if (parent == null)
			return;
		
		Map<String, Object> parentRow = null;
		
		Object chieldValueRelation = row.get(parent.getChildColumn().toUpperCase());
		
		if (parent.getTable().getKey().equals(parent.getParentColumn()))
		{
			parentRow = parent.getTable().getRows().get(chieldValueRelation);
		}
		else
		{
			Collection<Map<String, Object>> parentRows = parent.getTable().getRows().values();
			
			String parenColumn = parent.getParentColumn().toUpperCase();
			
			for (Map<String, Object> parentRowTemp :  parentRows)
			{
				if (chieldValueRelation.equals(parentRowTemp.get(parenColumn)))
				{
					parentRow = parentRowTemp;
					break;
				}
			}
		}
		
		@SuppressWarnings("unchecked")
		List<Map<String, Object>> relations = (List<Map<String, Object>>) parentRow.get($AUDITORIA_RELATION);
		
		if (relations == null)
		{
			relations = new ArrayList<Map<String, Object>>();
			parentRow.put($AUDITORIA_RELATION, relations);
		}
		
		if (!StringUtils.isBlankOrNull(parent.getTitle()))
			row.put($AUDITORIA_TITLE, parent.getTitle());
		
		relations.add(row);
	}
	public Map<String, Map<String, Object>> getRows()
	{
		return rows;
	}
	
	public void putRemainColumn(String columnName)
	{
		remainColumns.add(columnName.toUpperCase());
	}
	
	public boolean containRemainColumn(String columnName)
	{
		return remainColumns.contains(columnName.toUpperCase());
	}
	public Node getSourceDoui()
	{
		return sourceDoui;
	}
	public void setSourceDoui(Node sourceDoui)
	{
		this.sourceDoui = sourceDoui;
	}
}