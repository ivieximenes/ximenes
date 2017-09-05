package br.com.qualicorp.redenarede.service.auditoria.to;

import org.w3c.dom.Node;

public class SourceDefinitionTO
{
	private Node sourceAuditoria;
	private Node sourceDoui;
	private TableTO parentTable;
	
	public SourceDefinitionTO(Node sourceAuditoria, Node sourceDoui)
	{
		this.sourceAuditoria = sourceAuditoria;
		this.sourceDoui = sourceDoui;
	}
	
	public SourceDefinitionTO(TableTO parentTable, Node sourceAuditoria, Node sourceDoui)
	{
		this.sourceAuditoria = sourceAuditoria;
		this.sourceDoui = sourceDoui;
		this.parentTable = parentTable;
	}
	
	public Node getSourceAuditoria()
	{
		return sourceAuditoria;
	}
	public void setSourceAuditoria(Node sourceAuditoria)
	{
		this.sourceAuditoria = sourceAuditoria;
	}
	public Node getSourceDoui()
	{
		return sourceDoui;
	}
	public void setSourceDoui(Node sourceDoui)
	{
		this.sourceDoui = sourceDoui;
	}

	public TableTO getParentTable()
	{
		return parentTable;
	}

	public void setParentTable(TableTO parentTable)
	{
		this.parentTable = parentTable;
	}
}