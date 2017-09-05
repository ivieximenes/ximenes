package br.com.qualicorp.redenarede.service.auditoria.processaction;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Stack;

import org.w3c.dom.Node;

import br.com.qualicorp.redenarede.commons.utils.JDBCUtils;
import br.com.qualicorp.redenarede.commons.utils.JsonUtils;
import br.com.qualicorp.redenarede.service.auditoria.enums.AuditiaOperationEnum;
import br.com.qualicorp.redenarede.service.auditoria.to.FieldTO;
import br.com.qualicorp.redenarede.service.auditoria.to.RelationTO;
import br.com.qualicorp.redenarede.service.auditoria.to.SourceDefinitionTO;
import br.com.qualicorp.redenarede.service.auditoria.to.TableTO;
import lumis.content.ContentManagerFactory;
import lumis.content.core.Content;
import lumis.doui.processaction.GenericProcessActionHandler;
import lumis.portal.PortalException;
import lumis.portal.PortalRequestParameters;
import lumis.portal.authentication.SessionConfig;
import lumis.portal.dao.DaoException;
import lumis.portal.dao.jdbc.ITransactionJdbc;
import lumis.portal.manager.ManagerFactory;
import lumis.portal.serviceinstance.ServiceInstanceConfig;
import lumis.portal.transaction.AbstractTransactionObserver;
import lumis.portal.transaction.PortalTransactionFactory;
import lumis.portal.user.UserConfig;
import lumis.util.ITransaction;
import lumis.util.PortalUtil;
import lumis.util.XmlUtil;
import lumis.util.log.ILogger;
import lumis.util.log.LoggerFactory;

public class AuditProcessActionHandler extends GenericProcessActionHandler
{
	public static final String AUDITORIA_FIELDS_NEW = "auditoriaFieldsNew";
	public static final String AUDITORIA_FIELDS_OLD = "auditoriaFieldsOld";

	private static ILogger logger = LoggerFactory.getLogger(AuditProcessActionHandler.class);
	
	private static final String OPERATION_ADD = "add";
	private static final String OPERATION_EDIT = "edit";
	private static final String OPERATION_DELETE = "delete";
	
	private String customMessage = "";
	private int action = 0;
	
	public void processAction() throws PortalException
	{
		try
		{
			final String operation = getOperation();
			final Map<String, Object> jsonBeforeCommit = new LinkedHashMap<String, Object>();
			
			if( operation.equals(OPERATION_DELETE) )
			{
				String itemId = fillJsonFromDataBase( jsonBeforeCommit, transaction );
				
				addAudit( jsonBeforeCommit, transaction, itemId, false );
				
				return;
			}
			else if ( operation.equals(OPERATION_EDIT) )
			{
				fillJsonFromDataBase( jsonBeforeCommit, transaction );
			}
			
			transaction.addObserver( new AbstractTransactionObserver( )
			{
				public void afterCommit() throws PortalException
				{
					
					ITransaction transaction = null;
					try
					{
						transaction = (ITransaction) PortalTransactionFactory.createTransaction();
						transaction.begin();
						
						Map<String, Object> jsonAfterCommit = new LinkedHashMap<String, Object>( );
						
						String itemId = fillJsonFromDataBase( jsonAfterCommit, transaction );
						
						Map<String, Object> json = null;
						
						if ( operation.equals(OPERATION_EDIT) )
						{
							json = new LinkedHashMap<String, Object>( );
							
							json.put(AUDITORIA_FIELDS_OLD, jsonBeforeCommit);
							json.put(AUDITORIA_FIELDS_NEW, jsonAfterCommit);
						}
						else if ( operation.equals(OPERATION_ADD) )
						{
							json = jsonAfterCommit;
						}
						
						if( json != null && !json.isEmpty() )
						{
							addAudit( json, transaction, itemId, false );
						}
						
						transaction.commit();
					}
					catch (Exception e)
					{
						logger.error("Erro na auditoria!", e);
					}
					finally
					{
						if (transaction != null)
							transaction.close();
					}
				}
			});
		}
		catch (Exception e)
		{
			logger.error("Erro na auditoria!", e);
		}
	}
	
	public String getOperation() throws PortalException
	{
		String operation = XmlUtil.readNodeString("action", processActionNode);
		
		if (operation != null)
			return operation;
		
		String typeInterface = douiContext.getRequest().getServiceInterfaceConfig().getInterfaceType();
		
		if ("lum_douiAdministrationAddPropertyPage".equals(typeInterface) || "lum_contentAdministrationAddPropertyPage".equals(typeInterface))
			return OPERATION_ADD;
		
		if ("lum_douiAdministrationEditPropertyPage".equals(typeInterface) || "lum_contentAdministrationEditPropertyPage".equals(typeInterface))
			return OPERATION_EDIT;
		
		if ("delete".equals(getId()))
			return OPERATION_DELETE;
		
		
		return operation;
	}
	
	private void fillJsonFromDataBase( ITransaction transaction, String id, TableTO table ) throws SQLException, DaoException
	{
		Connection connection = null;
		ResultSet rs = null;
		PreparedStatement statement = null;
		
		try
		{
			ITransactionJdbc  daoTransactionJdbc = (ITransactionJdbc)transaction;
			
			connection = daoTransactionJdbc.getConnection();
			
			StringBuilder sb = new StringBuilder()
			.append(" SELECT ").append(returnFields(table)).append(" \n")
			.append("   FROM ").append(table.getName()).append(" ").append(table.getAlias()).append(" \n");
			
			if (table.getParent() != null)
			{
				TableTO currentTable = table;
				
				while (currentTable != null)
				{
					TableTO parenTable = currentTable.getParent().getTable();
					
					sb
					.append(" INNER JOIN ").append(parenTable.getName()).append(" ").append(parenTable.getAlias())
					.append(" ON ").append(parenTable.getAlias()).append(".").append(currentTable.getParent().getParentColumn())
					.append(" = ")
					.append(currentTable.getAlias()).append(".").append(currentTable.getParent().getChildColumn())
					.append(" \n");
					
					if (parenTable.getParent() != null)
					{
						currentTable = parenTable;
					}
					else
					{
						sb.append("  WHERE ").append(parenTable.getAlias()).append(".").append(parenTable.getKey()).append(" = ?");
						currentTable = null;
					}
				}
			}
			else
			{
				sb.append("  WHERE ").append(table.getAlias()).append(".").append(table.getKey()).append(" = ?");
			}
			
			statement = connection.prepareStatement(sb.toString());

			statement.setString( 1, id );
		
			rs = statement.executeQuery();
			
			ResultSetMetaData metaData = rs.getMetaData();
			int columnCount = metaData.getColumnCount();
			
			while( rs.next() )
			{	
				Map<String, Object> row = new HashMap<String, Object>();
				
			   for(int i = 1; i <= columnCount; i++)
			   {
				   String columnName = metaData.getColumnLabel(i);
				   
				   if (table.containRemainColumn(columnName))
					   row.put( columnName, rs.getObject(i) );
				   else
					   row.put( table.getJsonLabel(columnName), rs.getObject(i) );
			   }
			   
			   table.putRow(row);
			}
		}
		finally
		{
			try
			{
				JDBCUtils.close(rs, statement);
			}
			catch (SQLException e)
			{
				logger.error("On Close SQL!", e);
			}
		}
	}
	
	private String fillJsonFromDataBase( Map<String, Object> json, ITransaction transaction ) throws PortalException, SQLException
	{
		String itemId = null;
		
		String operation = getOperation();
		String id = null;
		
		List<TableTO> tables = getTables();
		
		List<TableTO> rootTables = new ArrayList<TableTO>();
		
		for( TableTO table :  tables)
		{
			if( id == null )
			{
				id = getIdValue(operation, table);
				
				Content content = null;
				
				try
				{
					content = ContentManagerFactory.getContentManager().getContentByItemId(id);
					itemId = content.getId();
				}
				catch(PortalException e)
				{
				    itemId = id;
				}
			}
			
			if (table.getParent() == null)
				rootTables.add(table);
			
			fillJsonFromDataBase( transaction, id, table );
		}
		
		for (TableTO table : rootTables)
		{
			for (Map<String, Object> row : table.getRows().values())
			{
				json.putAll(row);
			}
		}
		
		return itemId;
	}
	
	private String getIdValue(String operation, TableTO table)
	{
		String id = null;
		
		// No caso de "add" não temos o id como parametro, com isso é preciso busca-lo como atributo.
		// Se o serviço estiver utilizando um processAction customizado, é preciso setar manualmente esse atributo
		if( operation.equals(OPERATION_ADD) )
		{
			id = (String) douiContext.getRequest().getAttribute(PortalRequestParameters.PAGE_PARAMETER_ITEMID);
		}
		else if( operation.equals(OPERATION_EDIT) )
		{
			// Caso tenha versionamento
			id = (String) douiContext.getRequest().getAttribute("lumNewVersionPrimaryKey");
			
			if( id == null )
			{
				Object tempId = getParameter(table.getKey());
			    
				if( tempId != null )
				{
					if( tempId instanceof String ) 
				       id = (String) tempId;
					else
				       id = ((String[]) tempId)[0];
				}
				else
				{
					id = (String) douiContext.getRequest().getAttribute(PortalRequestParameters.PAGE_PARAMETER_ITEMID);
				}
			}
		}
		else
		{
			// No caso de "delete", esta setado a posição 0 pois nesse projeto não existirá
			// ação em massa, com isso, o array sempre retornará uma unica posição.
			id = ((String[]) getParameter(table.getKey()))[0];
		}
		
		return id;
	}
	
	private List<TableTO> getTables() throws PortalException
	{
		List<TableTO> tables = new ArrayList<TableTO>();
		
		Stack<SourceDefinitionTO> pilha = new Stack<SourceDefinitionTO>();
		
		initializePilha(pilha);
		
		int count = 0;
		
		while (!pilha.isEmpty())
		{
			TableTO table = new TableTO();
			
			SourceDefinitionTO to = pilha.pop();
			Node sourceDouiDefinitionNode = to.getSourceDoui();
			
			table.setSourceDoui(sourceDouiDefinitionNode);
			
			table.setName( XmlUtil.selectSingleNode("table", sourceDouiDefinitionNode).getTextContent() );
			
			Node fieldsTag = XmlUtil.selectSingleNode("fields", sourceDouiDefinitionNode);
			Node[] fields = XmlUtil.selectNodes("field", fieldsTag);
			
			putFieldsDefinitions(table, fields);
			
			table.setAlias("t" + count++);
			
			if (to.getParentTable() != null)
			{
				putParentRelation(table, to);
			}
			
			tables.add(table);
			
			if (to.getSourceAuditoria() != null)
				putDependenciesTables(table, to.getSourceAuditoria(), pilha);
		}
		
		return tables;
	}
	
	private void putParentRelation(TableTO tableChild, SourceDefinitionTO to) throws PortalException
	{
		Node relationIdNode = to.getSourceAuditoria().getAttributes().getNamedItem("relationId");
		
		if (relationIdNode == null)
			throw new PortalException(getServiceLabelException() + "falta o atributo 'relationId' dentro de uma tag source de relacionamento na configura do processaction de auditoria.");
		
		RelationTO relationTO = new RelationTO();
		
		relationTO.setTable(to.getParentTable());
		
		tableChild.setParent(relationTO);
		
		Node titleRelationNode = to.getSourceAuditoria().getAttributes().getNamedItem("title");
		
		if (titleRelationNode != null)
			relationTO.setTitle(titleRelationNode.getTextContent());
		
		boolean findedRelation = false;
		
		//Verificando se a definição do relation existe no source do tableChild
		Node relationsRoot = XmlUtil.selectSingleNode("relations", tableChild.getSourceDoui());
		
		if (relationsRoot != null)
		{
			Node[] relations = XmlUtil.selectNodes("relation", relationsRoot);
			
			for (Node relation : relations)
			{
				if (relation.getAttributes().getNamedItem("id").getTextContent().equals(relationIdNode.getTextContent()))
				{
					Node relationField = XmlUtil.selectSingleNode("relationField", relation);
					
					relationTO.setParentColumn( to.getParentTable().getColumnNameByFieldId(relationField.getAttributes().getNamedItem("foreignFieldId").getTextContent()) );
					relationTO.setChildColumn( tableChild.getColumnNameByFieldId(relationField.getAttributes().getNamedItem("fieldId").getTextContent()) );
					
					relationTO.getTable().putRemainColumn(relationTO.getParentColumn());
					tableChild.putRemainColumn(relationTO.getChildColumn());
					
					findedRelation = true;
					
					break;
				}
			}
		}
		
		if (findedRelation)
			return;
		
		//Verificando se a definição do relation existe no source do tableParent
		relationsRoot = XmlUtil.selectSingleNode("relations", to.getParentTable().getSourceDoui());
		
		if (relationsRoot != null)
		{
			Node[] relations = XmlUtil.selectNodes("relation", relationsRoot);
			
			for (Node relation : relations)
			{
				if (relation.getAttributes().getNamedItem("id").getTextContent().equals(relationIdNode.getTextContent()))
				{
					Node relationField = XmlUtil.selectSingleNode("relationField", relation);
					
					relationTO.setParentColumn( to.getParentTable().getColumnNameByFieldId(relationField.getAttributes().getNamedItem("fieldId").getTextContent()) );
					relationTO.setChildColumn( tableChild.getColumnNameByFieldId(relationField.getAttributes().getNamedItem("foreignFieldId").getTextContent()) );
					
					relationTO.getTable().putRemainColumn(relationTO.getParentColumn());
					tableChild.putRemainColumn(relationTO.getChildColumn());
					
					findedRelation = true;
					
					break;
				}
			}
		}
	}
	
	public String getServiceLabelException()
	{
		return "Interface '" + douiContext.getRenderRequest().getServiceInterfaceConfig().getId() + "': ";
	}
	
	private void initializePilha(Stack<SourceDefinitionTO> pilha) throws PortalException
	{
		Node custumizedSourcesHolder = XmlUtil.selectSingleNode("sources", processActionNode);
		
		if (custumizedSourcesHolder == null)
		{
			pilha.push(new SourceDefinitionTO(null, douiContext.getSourceContainer().getDefaultSource().getDefinitionNode()));
		}
		else
		{
			Node[] custumizedSources = XmlUtil.selectNodes("source", custumizedSourcesHolder);
			
			for (int i = custumizedSources.length - 1; i > -1; i--)
			{
				Node custumizedSource = custumizedSources[i];
				
				String sourceId = custumizedSource.getAttributes().getNamedItem("id").getTextContent();
				
				pilha.push( new SourceDefinitionTO(custumizedSource, douiContext.getSourceContainer().getSourceById(sourceId).getDefinitionNode()) );
			}
		}
	}
	
	private void putFieldsDefinitions(TableTO table, Node[] fields) throws PortalException
	{
		String keyField = null;
		
		for (Node field : fields)
		{
			Node columnNameNode = field.getAttributes().getNamedItem("columnName");
			Node fieldIdNode = field.getAttributes().getNamedItem("id");
			
			if (columnNameNode == null)
				columnNameNode = fieldIdNode;
			
			String columnName = columnNameNode.getTextContent();
			
			table.putColumnNameByFieldId(fieldIdNode.getTextContent(), columnName);
			
			if (field.getAttributes().getNamedItem("name") != null)
				table.putJsonLabel(columnName, field.getAttributes().getNamedItem("name").getTextContent());
			
			Node isPrimaryKey = field.getAttributes().getNamedItem("isPrimaryKey");
			
			if (isPrimaryKey != null && "true".equals(isPrimaryKey.getTextContent()))
			{
				keyField = columnName;
				
				table.putRemainColumn(columnName);
			}
		}
		
		if (keyField == null)
			throw new PortalException("Não isPrimaryKey no douidefinition '" + douiContext.getSourceContainer().getDefaultSource().getId() + "'");
		
		table.setKey(keyField);
	}
	
	private void putDependenciesTables(TableTO table, Node sourceDefinitionNode, Stack<SourceDefinitionTO> pilha) throws PortalException
	{
		Node additionalSourcesRoot = XmlUtil.selectSingleNode("additionalSources", sourceDefinitionNode);
		
		if (additionalSourcesRoot == null)
			return;
		
		Node[] additionalSources = XmlUtil.selectNodes("source", additionalSourcesRoot);
		
		for (Node additionalSource : additionalSources)
		{
			String sourceId = additionalSource.getAttributes().getNamedItem("id").getTextContent();
			
			pilha.push( new SourceDefinitionTO(table, additionalSource, douiContext.getSourceContainer().getSourceById(sourceId).getDefinitionNode()) );
		}
	}
	
	private void addAudit( Map<String, Object> json, ITransaction transaction, String itemId, boolean isDouiDefinition ) throws PortalException, SQLException
	{
		Connection        connection = null;
		PreparedStatement statement = null;
		
		try
		{
			ITransactionJdbc  daoTransactionJdbc = (ITransactionJdbc) transaction;
			
			connection = daoTransactionJdbc.getConnection();
			statement  = connection.prepareStatement(" INSERT INTO qc_auditoria( id, userId, serviceId, instanceId, instanceName,                            \n" +
					                                 "                         operation, dateProcess, content, customMessage, itemId, userName, login, serviceName ) \n" +
					                                 "      VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)" );
			
			String jsonValue     = JsonUtils.parse(json);
			String customMessage = "";
			int    action        = 0;
			
			if( isDouiDefinition )
			{
				customMessage = this.customMessage;
				action        = this.action;
			}
			else
			{
				customMessage = XmlUtil.readNodeString("customMessage", processActionNode);
				action = returnAuditOperation(getOperation());
			}
			
			UserConfig user = ManagerFactory.getUserManager().get(sessionConfig, sessionConfig.getUserId(), daoTransactionJdbc);
			
			int count = 0;
			
			statement.setString(++count, PortalUtil.generateNewGuid());
			statement.setString(++count, sessionConfig.getUserId());
			statement.setString(++count, source.getDouiContext().getRequest().getServiceInstanceConfig().getServiceId());
			statement.setString(++count, source.getDouiContext().getRequest().getServiceInstanceConfig().getId());
			statement.setString(++count, source.getDouiContext().getRequest().getServiceInstanceConfig().getName());
			statement.setInt(++count, action);
			statement.setDate(++count, new java.sql.Date(new Date().getTime()));
			statement.setString(++count, jsonValue);
			statement.setString(++count, customMessage);
			statement.setString(++count, itemId);
			statement.setString(++count, user.getFullName());
			statement.setString(++count, user.getLogin());
			statement.setString(++count, localize(ManagerFactory.getServiceManager().get(sessionConfig, source.getDouiContext().getRequest().getServiceInstanceConfig().getServiceId() , transaction).getName()) );
			
			statement.execute();
		}
		finally
		{
			try
			{
				JDBCUtils.close(null, statement);
			}
			catch (SQLException e)
			{
				logger.error("On Close SQL!", e);
			}
		}
	}
	
	private int returnAuditOperation( String operation )
	{
		return operation.equals(OPERATION_ADD) ? AuditiaOperationEnum.INSERT.ordinal() 
				                       : ( operation.equals(OPERATION_EDIT) ? AuditiaOperationEnum.UPDATE.ordinal() 
				                    		                        : AuditiaOperationEnum.DELETE.ordinal() );
	}
	
	private String returnFields( TableTO table )
	{
		String fields = "";
		
		for( FieldTO field : table.getFields() )
		{
			if( fields.length() > 0 )
				fields += ", ";
			
			fields += table.getAlias() + ".";
			fields += field.getName() + ( field.getAlias() != null ? ( " " + field.getAlias() ) : "" );
		}
		
		return fields = fields.length() == 0 ? table.getAlias() + "." + "*" : fields;
	}
	
	public void processManual( Map<String, Object> json, ServiceInstanceConfig serviceInstanceConfig, String itemId, String customMessage, int action) throws PortalException
	{
		ITransaction transaction = null;
		Connection connection = null;
		PreparedStatement statement = null;
		
		try
		{
			transaction = PortalTransactionFactory.createTransaction();
			
			transaction.begin();
			
			ITransactionJdbc  daoTransactionJdbc = (ITransactionJdbc) transaction;
			
			connection = daoTransactionJdbc.getConnection();
			statement  = connection.prepareStatement(" INSERT INTO qc_auditoria( id, userId, serviceId, instanceId, instanceName,                            \n" +
					                                 "                         operation, dateProcess, content, customMessage, itemId, userName, login, serviceName ) \n" +
					                                 "      VALUES ( ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?)" );
			
			String jsonValue = JsonUtils.parse(json);
			
			UserConfig user = ManagerFactory.getUserManager().get(SessionConfig.getCurrentSessionConfig(), SessionConfig.getCurrentSessionConfig().getUserId(), daoTransactionJdbc);
			
			int count = 0;
			
			statement.setString(++count, PortalUtil.generateNewGuid());
			statement.setString(++count, itemId);
			statement.setString(++count, serviceInstanceConfig.getServiceId());
			statement.setString(++count, serviceInstanceConfig.getId());
			statement.setString(++count, serviceInstanceConfig.getName());
			statement.setInt(++count, action);
			statement.setString(++count, jsonValue);
			statement.setString(++count, customMessage);
			statement.setString(++count, itemId);
			statement.setString(++count, user.getFullName());
			statement.setString(++count, user.getLogin());
			statement.setString(++count, localize(ManagerFactory.getServiceManager().get(SessionConfig.getCurrentSessionConfig(), serviceInstanceConfig.getServiceId() , transaction).getName()) );
			
			statement.execute();

			transaction.commit();

		}
		catch (SQLException e) 
		{
			logger.error("Erro no cadastro da auditoria!", e);
		}
		finally
		{
			try
			{
				JDBCUtils.closeAndDispose(null, statement, transaction);
			}
			catch (SQLException e)
			{
				logger.error("On Close SQL!", e);
			}
		}
	}
}